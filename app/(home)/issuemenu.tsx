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
import { deleteIssue } from '@/actions/issue'
import toast, { Toaster } from 'react-hot-toast'

interface IssueMenuProps {
  issueId: string
}

async function deleteItem(issueId: string) {
  const result = await deleteIssue(issueId)
  if (result.status === 'success') {
    toast.success('Issue successfully deleted')
  } else {
    toast.error('Error deleting issue')
  }
}

export function IssueMenu({ issueId }: IssueMenuProps) {
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
          <DropdownMenuItem onClick={() => startTransition(() => deleteItem(issueId))}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
      <Toaster />
    </DropdownMenu>
  )
}
