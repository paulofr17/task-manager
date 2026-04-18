'use client'

import { useState } from 'react'

import { Search } from 'lucide-react'

export function SearchBar() {
  const [searchText, setSearchText] = useState('')

  return (
    <div className="hidden sm:flex">
      <div className="group flex h-9 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm transition-colors focus-within:border-primary/40 focus-within:bg-background hover:bg-muted/60 min-[400px]:w-52 sm:w-64 md:w-80">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          className="w-full border-none bg-transparent py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          placeholder="Search tasks, projects…"
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          autoComplete="off"
        />
        <kbd className="pointer-events-none hidden select-none items-center rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground md:inline-flex">
          ⌘K
        </kbd>
      </div>
    </div>
  )
}
