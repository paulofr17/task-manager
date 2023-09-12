'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { useTransition } from 'react'
import { deleteIssue } from '@/actions/serverActions'
import toast, { Toaster } from 'react-hot-toast'

interface BoardCardMenuProps {
  issueId: string
}

async function deleteItem(issueId: string) {
  console.log('aqui2')
  const result = await deleteIssue(issueId)
  if (result.status === 'success') {
    toast.success('Issue successfully deleted')
  } else {
    toast.error('Error deleting issue')
  }
}

export function BoardCardMenu({ issueId }: BoardCardMenuProps) {
  const [isPending, startTransition] = useTransition()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <MoreHorizontal size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => startTransition(() => deleteItem(issueId))}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
      <Toaster />
    </DropdownMenu>
  )
}

export default BoardCardMenu
