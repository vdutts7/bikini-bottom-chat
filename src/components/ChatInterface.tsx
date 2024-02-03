import React, { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

interface Props {
  character: string
}

const ChatInterface: React.FC<Props> = ({ character }) => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character, message: input }),
      })

      if (!response.ok) throw new Error(response.statusText)
      
      const data = response.body
      if (!data) return

      const reader = data.getReader()
      const decoder = new TextDecoder()
      let done = false
      let accumulatedResponse = ''

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)
        accumulatedResponse += chunkValue
        setMessages([...newMessages, { role: 'assistant', content: accumulatedResponse }])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card shadow-lg border-4 border-secondary">
      <CardHeader className="flex items-center space-x-4 bg-primary text-primary-foreground rounded-t-lg">
        <Avatar className="w-16 h-16 border-2 border-white">
          <AvatarImage src={`/images/${character.toLowerCase()}.png`} alt={character} />
          <AvatarFallback>{character[0]}</AvatarFallback>
        </Avatar>
        <h2 className="text-3xl font-bold">{character}</h2>
      </CardHeader>
      <CardContent className="h-[400px] overflow-y-auto space-y-4 p-4 sand-gradient">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg shadow-md ${
              msg.role === 'user' 
                ? 'bg-secondary text-secondary-foreground' 
                : 'bg-accent text-accent-foreground'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="bg-card rounded-b-lg p-4">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-grow bg-white border-2 border-secondary"
          />
          <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

export default ChatInterface