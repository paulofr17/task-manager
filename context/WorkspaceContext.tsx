'use client'

import { useState, useContext, createContext, SetStateAction } from 'react'
import { WorkspaceWithProjectsUsers } from '@/types/types'

type WorkspaceContext = {
  currentWorkspace: WorkspaceWithProjectsUsers | null
  setCurrentWorkspace: React.Dispatch<SetStateAction<WorkspaceWithProjectsUsers | null>>
  workspaceList: WorkspaceWithProjectsUsers[]
  setWorkspaceList: React.Dispatch<SetStateAction<WorkspaceWithProjectsUsers[]>>
}

export const WorkspaceContext = createContext<WorkspaceContext | null>(null)

export function WorkspaceContextProvider({ children }: { children: React.ReactNode }) {
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceWithProjectsUsers | null>(null)
  const [workspaceList, setWorkspaceList] = useState<WorkspaceWithProjectsUsers[]>([])

  return (
    <WorkspaceContext.Provider
      value={{ currentWorkspace, setCurrentWorkspace, workspaceList, setWorkspaceList }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext)
  if (context === null) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceContextProvider')
  }
  return context
}
