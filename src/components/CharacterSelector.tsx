import React, { useState } from 'react'
import Image from 'next/image'
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"

const characters = [
  { name: 'Spongebob', image: '/images/spongebob.png' },
  { name: 'Squidward', image: '/images/squidward.png' },
  { name: 'Patrick', image: '/images/patrick.png' },
]

interface Props {
  onSelect: (character: string) => void
}

const CharacterSelector: React.FC<Props> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCharacters = characters.filter(char => 
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Input
        type="text"
        placeholder="Search characters..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-white border-2 border-secondary"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCharacters.map((character) => (
          <Card key={character.name} className="cursor-pointer hover:shadow-xl transition-shadow bg-card border-4 border-secondary" onClick={() => onSelect(character.name)}>
            <CardContent className="flex flex-col items-center p-6">
              <Avatar className="w-32 h-32 mb-4 border-4 border-primary">
                <AvatarImage src={character.image} alt={character.name} />
                <AvatarFallback>{character.name[0]}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-primary">{character.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CharacterSelector