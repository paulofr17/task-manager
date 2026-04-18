'use client'

import Link from 'next/link'
import { Menu, CheckSquare } from 'lucide-react'

import { SearchBar } from './searchbar'
import { WorkspaceSelection } from './WorkspaceSelection'
import { ThemeSwitcher } from './ThemeSwitcher'
import { UserNav } from './UserNav'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  openSidebar: boolean
  setOpenSidebar(open: boolean): void
}

export function Navbar({ openSidebar, setOpenSidebar }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Toggle sidebar"
          onClick={() => setOpenSidebar(!openSidebar)}
        >
          <Menu className="h-4 w-4" />
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-gradient shadow-soft">
            <CheckSquare className="h-4 w-4 text-white" />
          </div>
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">
            Task Manager
          </span>
        </Link>
        <div className="hidden h-6 w-px bg-border sm:block" />
        <WorkspaceSelection />
      </div>
      <SearchBar />
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <UserNav />
      </div>
    </header>
  )
}
