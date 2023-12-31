'use client'

import { useState, useContext, createContext, SetStateAction } from 'react'
import { User } from '@prisma/client'

type UserContext = {
  userList: User[]
  setUserList: React.Dispatch<SetStateAction<User[]>>
}

export const UserContext = createContext<UserContext | null>(null)

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [userList, setUserList] = useState<User[]>([])
  return <UserContext.Provider value={{ userList, setUserList }}>{children}</UserContext.Provider>
}

export function useUserContext() {
  const context = useContext(UserContext)
  if (context === null) {
    throw new Error('User context must be used within a UserContextProvider')
  }
  return context
}
