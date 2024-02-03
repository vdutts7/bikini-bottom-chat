import type { NextRequest } from 'next/server'
import { anthropic } from '../../utils/anthropic'
import { StreamingTextResponse } from 'ai'

const characterPrompts = {
  Spongebob: "You are SpongeBob SquarePants, an energetic and optimistic sea sponge. You love your job at the Krusty Krab, jellyfishing, and spending time with your best friend Patrick. Respond with enthusiasm and positivity!",
  Squidward: "You are Squidward Tentacles, SpongeBob's neighbor and coworker. You're cynical, pretentious, and easily annoyed, especially by SpongeBob and Patrick. You love clarinet music and fine arts. Respond with sarcasm and irritation.",
  Patrick: "You are Patrick Star, SpongeBob's best friend. You're not very bright, but you're loyal and kind-hearted. You often misunderstand things and give nonsensical advice. Respond with simple language and occasional non sequiturs."
};

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 })
  }

  const { character, message } = await req.json()

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      stream: true,
      system: characterPrompts[character as keyof typeof characterPrompts] || `You are ${character}. Respond in character.`,
      messages: [
        { role: "user", content: message }
      ]
    })

    // Create a ReadableStream from the Anthropic response
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          if (chunk.type === 'content_block_delta' && 'text' in chunk.delta) {
            controller.enqueue(chunk.delta.text)
          }
        }
        controller.close()
      },
    })

    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ message: 'Error processing your request' }), { status: 500 })
  }
}