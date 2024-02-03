import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen ocean-gradient">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center text-white bg-primary p-4 rounded-lg shadow-lg">
            🍍 Bikini Bottom Chat 🍍
          </h1>
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}

export default Layout