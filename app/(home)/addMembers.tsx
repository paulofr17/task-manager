'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { User } from '@prisma/client'
import { UserPlus2 } from 'lucide-react'
import { MemberSelection } from './memberSelection'
import { useState } from 'react'
import { shareBoard } from './_actions/shareBoard'
import { toaster } from '@/lib/toaster'

interface AddMembersProps {
  boardId: string
  userList: User[]
}

export function AddMembers({ boardId, userList }: AddMembersProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [members, setMembers] = useState(new Set<string>())

  const resetMembers = () => {
    setMembers(new Set<string>())
  }

  const addMembers = async () => {
    const response = await shareBoard(boardId, Array.from(members))
    if (response.message) {
      toaster('success', response.message)
      setMenuOpen(false)
      resetMembers()
    } else {
      toaster('error', response.error || 'Error sharing board')
    }
  }

  return (
    <Dialog
      open={menuOpen}
      onOpenChange={() => {
        resetMembers()
        setMenuOpen(!menuOpen)
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          className="flex h-9 items-center gap-0 p-1 text-zinc-700 md:gap-1 md:p-2 lg:p-4"
        >
          <UserPlus2 className="mr-1 h-5 w-5" />
          <span className="text-xs md:text-sm">Share Board</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Board</DialogTitle>
          <DialogDescription className="text-sm">
            Insert members to give them access to this board
          </DialogDescription>
        </DialogHeader>
        <MemberSelection members={members} setMembers={setMembers} users={userList} />
        <DialogFooter>
          <Button
            type="reset"
            variant="outline"
            onClick={() => {
              resetMembers()
              setMenuOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-purple-650 hover:bg-purple-650/70"
            disabled={members.size === 0}
            onClick={addMembers}
          >
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
