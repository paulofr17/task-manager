'use client'

import { CheckIcon, PlusCircleIcon } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User } from '@prisma/client'
import { cn } from '@/lib/utils'

interface MemberSelectionProps {
  members: Set<string>
  setMembers: (users: Set<string>) => void
  currentUserId: string | undefined
  users: User[]
}

export function MemberSelection({
  members,
  setMembers,
  currentUserId,
  users,
}: MemberSelectionProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex h-fit border-dashed py-2 text-xs">
          <PlusCircleIcon className="mr-2 h-4 w-4 shrink-0" />
          Members
          {members?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="flex flex-wrap gap-1 text-xs">
                {users
                  .filter((user) => members.has(user.id))
                  .map((user) => (
                    <Badge
                      variant="secondary"
                      key={user.id}
                      className="rounded-sm px-1 font-normal"
                    >
                      {user.email}
                    </Badge>
                  ))}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search members" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => {
                const isSelected = members.has(user.id)
                return (
                  <CommandItem
                    disabled={user.id === currentUserId}
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
                    <span className="truncate text-xs" title={user.email}>
                      {user.email}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {members.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() =>
                      currentUserId
                        ? setMembers(new Set<string>([currentUserId]))
                        : setMembers(new Set<string>())
                    }
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
