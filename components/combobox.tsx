'use client'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'

const frameworks = [
  {
    value: 'ask friends app',
    label: 'Ask Friends App',
  },
  {
    value: 'other app',
    label: 'Other App',
  },
  {
    value: 'another app',
    label: 'Another App',
  },
]

export function ComboBox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between border border-purple-200 text-purple-650"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : 'Select app'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-purple-650 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandInput placeholder="Search App..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4 text-purple-650',
                    value === framework.value ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {framework.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
