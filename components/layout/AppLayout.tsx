'use client'

import { useState, useEffect } from 'react'

import { useWorkspaceContext } from '@/context/WorkspaceContext'
import { useUserContext } from '@/context/UserContext'
import { WorkspaceWithProjectsUsers } from '@/types/types'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { User } from '@prisma/client'

interface AppLayoutProps {
  children: React.ReactNode
  currentWorkspace: WorkspaceWithProjectsUsers | null
  workspaceList: WorkspaceWithProjectsUsers[]
  userList: User[]
}

export function AppLayout({ children, currentWorkspace, workspaceList, userList }: AppLayoutProps) {
  const { setCurrentWorkspace, setWorkspaceList } = useWorkspaceContext()
  const { setUserList } = useUserContext()
  const [openSidebar, setOpenSidebar] = useState(true)

  useEffect(() => {
    setCurrentWorkspace(currentWorkspace)
  }, [currentWorkspace, setCurrentWorkspace])

  useEffect(() => {
    setWorkspaceList(workspaceList)
  }, [workspaceList, setWorkspaceList])

  useEffect(() => {
    setUserList(userList)
  }, [userList, setUserList])

  return (
    <div className="flex h-full w-full flex-col">
      <Navbar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <div className="flex h-full overflow-hidden">
        <Sidebar openSidebar={openSidebar} />
        <main className="flex h-full w-full flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
