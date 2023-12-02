'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { User } from '@prisma/client'

import { CheckIcon, PlusCircleIcon } from 'lucide-react'

interface MemberSelectionProps {
  members: Set<string>
  setMembers: (users: Set<string>) => void
  users: User[]
}

export function MemberSelection({ members, setMembers, users }: MemberSelectionProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Members
          {members?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="flex space-x-1 ">
                {members.size > 5 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {members.size} selected
                  </Badge>
                ) : (
                  users
                    .filter((user) => members.has(user.id))
                    .map((user) => (
                      <Badge
                        variant="secondary"
                        key={user.id}
                        className="rounded-sm px-1 font-normal"
                      >
                        {user.email}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Select members email" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => {
                const isSelected = members.has(user.id)
                return (
                  <CommandItem
                    key={user.id}
                    onSelect={() => {
                      const newMembers = new Set(members)
                      newMembers.has(user.id) ? newMembers.delete(user.id) : newMembers.add(user.id)
                      setMembers(newMembers)
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <span>{user.email}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {members.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setMembers(new Set<string>())}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
