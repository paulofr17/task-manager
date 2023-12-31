'use client'

import { Menu } from 'lucide-react'

import { SearchBar } from './searchbar'
import { WorkspaceSelection } from './WorkspaceSelection'
import { ThemeSwitcher } from './ThemeSwitcher'
import { UserNav } from './UserNav'

interface NavbarProps {
  openSidebar: boolean
  setOpenSidebar(open: boolean): void
}

export function Navbar({ openSidebar, setOpenSidebar }: NavbarProps) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b-2 px-7 pl-8 md:px-2 lg:px-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setOpenSidebar(!openSidebar)}>
          <Menu className="h-6 w-6" />
        </button>
        <WorkspaceSelection />
      </div>
      <SearchBar />
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <UserNav />
      </div>
    </div>
  )
}
