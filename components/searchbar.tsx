'use client'

import { useState } from 'react'

import {
  Calculator,
  Calendar,
  CreditCard,
  Search,
  Settings,
  Smile,
  User,
} from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

export function SearchBar() {
  const [search, setSearch] = useState(false)
  const [searchText, setSearchText] = useState('')

  return (
    <div className="pl-5">
      {search ? (
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <Smile className="mr-2 h-4 w-4" />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <Calculator className="mr-2 h-4 w-4" />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      ) : (
        <div className="group flex w-60 items-center justify-between rounded-xl border border-zinc-300 px-2">
          <input
            className="w-[87%] border-none py-2 text-sm text-zinc-800 focus:outline-none"
            placeholder="Search"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            autoComplete="on"
          ></input>
          <Search
            size={18}
            className="text-zinc-300 group-hover:text-zinc-700"
          />
        </div>
      )}
    </div>
  )
}
