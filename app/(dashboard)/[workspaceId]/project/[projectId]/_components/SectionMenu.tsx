'use client'

import { MoreHorizontal, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { SectionWithTasks } from '@/types/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { deleteSection } from '@/actions/Section/DeleteSection/action'

interface SectionMenuProps {
  section: SectionWithTasks
}

async function handleDeleteSection(sectionId: string) {
  const result = await deleteSection(sectionId)
  if (result.data) {
    toast.success(`Section ${result.data.name} successfully deleted`)
  } else {
    toast.error('Error deleting section')
  }
}

export function SectionMenu({ section }: SectionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="h-6 w-6">
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => handleDeleteSection(section.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
