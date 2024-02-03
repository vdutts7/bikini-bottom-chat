import React, { useState } from 'react'
import Layout from '../components/Layout'
import CharacterSelector from '../components/CharacterSelector'
import ChatInterface from '../components/ChatInterface'

export default function Home() {
  const [selectedCharacter, setSelectedCharacter] = useState('')

  return (
    <Layout>
      <CharacterSelector onSelect={setSelectedCharacter} />
      {selectedCharacter && <ChatInterface character={selectedCharacter} />}
    </Layout>
  )
}