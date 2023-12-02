'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MemberSelection } from './memberSelection'
import { useState } from 'react'
import { User } from '@prisma/client'
import { toaster } from '@/lib/toaster'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBoard } from './_actions/createBoard'
import { NewBoardSchema, NewBoardType } from '@/lib/schemas/newBoardSchema'

interface AddBoardFormProps {
  projectId: string
  userList: User[]
  changeSelectedBoard: (newProjectId: string) => void
  openBoardCreation: boolean
  setOpenBoardCreation: (open: boolean) => void
}

export function AddBoardForm({
  projectId,
  userList,
  changeSelectedBoard,
  openBoardCreation,
  setOpenBoardCreation,
}: AddBoardFormProps) {
  const { data: session } = useSession()
  const [boardMembers, setBoardMembers] = useState(new Set<string>())
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleBoardCreation(formData: NewBoardType) {
    const response = await createBoard(formData, projectId, boardMembers)
    if (response.message && response.board) {
      toaster('success', response.message)
      setOpenBoardCreation(false)
      changeSelectedBoard(response.board.id)
    } else {
      toaster('error', response.error || 'Error creating board')
    }
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewBoardType>({
    resolver: zodResolver(NewBoardSchema),
  })

  if (menuOpen !== openBoardCreation) {
    reset({ boardName: '' })
    setBoardMembers(
      new Set<string>([userList.find((user) => user.email === session?.user?.email)?.id || '']),
    )
    setMenuOpen(openBoardCreation)
  }

  return (
    <Dialog open={menuOpen} onOpenChange={setOpenBoardCreation}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
          <DialogDescription>
            Insert details to create a new Board inside the above selected project
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleBoardCreation)}>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="boardName">Board name</Label>
              <Input
                {...register('boardName')}
                type="text"
                id="boardName"
                name="boardName"
                placeholder="Board Example"
                required
                className="focus-visible:border-purple-650/50 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {errors.boardName?.message && (
                <p className="text-sm text-red-600">{errors.boardName?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <MemberSelection
                members={boardMembers}
                setMembers={setBoardMembers}
                users={userList}
              />
              {!boardMembers.size && (
                <p className="text-sm text-red-600">
                  You must add atleast one member to the project
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="reset" variant="outline" onClick={() => setOpenBoardCreation(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!boardMembers.size || isSubmitting}
              className="bg-purple-650 hover:bg-purple-650/70"
            >
              {!isSubmitting ? 'Create' : 'Creating...'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
