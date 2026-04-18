'use client'

import { MoreHorizontal, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { deleteTask } from '@/actions/Task/DeleteTask/action'

interface TaskMenuProps {
  taskId: string
}

async function handleDeleteTask(taskId: string) {
  const result = await deleteTask(taskId)
  if (result.data) {
    toast.success('Task successfully deleted')
  } else {
    toast.error('Error deleting task')
  }
}

export function TaskMenu({ taskId }: TaskMenuProps) {
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
            onClick={() => handleDeleteTask(taskId)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
