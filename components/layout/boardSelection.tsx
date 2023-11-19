'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState, useCallback } from 'react'
import { Board } from '@prisma/client'

interface BoardSelectionProps {
  boards: Board[]
}

export function BoardSelection({ boards }: BoardSelectionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(searchParams?.get('board') || '')
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between border border-purple-200 text-purple-650"
        >
          {value ? boards.find((board) => board.id === value)?.name : 'Select Board'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-purple-650 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandInput placeholder="Search App..." />
          <CommandEmpty>No Board found.</CommandEmpty>
          <CommandGroup>
            {boards.map((board) => (
              <CommandItem
                key={board.id}
                value={board.name}
                onSelect={() => {
                  const newValue = value === board.id ? '' : board.id
                  setValue(newValue)
                  setOpen(false)
                  router.push(pathname + '?' + createQueryString('board', newValue))
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4 text-purple-650',
                    value === board.id ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {board.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
