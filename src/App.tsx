import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import UserList from './components/UsersList'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'


function App() {
  // const [count, setCount] = useState(0)

  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
        <UserList />
      </SignedIn>
    </header>
  )
}

export default App
