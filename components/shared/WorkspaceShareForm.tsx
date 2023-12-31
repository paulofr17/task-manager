'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ShareWorkspaceSchema, ShareWorkspaceType } from '@/actions/ShareWorkspace/schema'
import { shareWorkspace } from '@/actions/ShareWorkspace/action'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MemberSelection } from '@/components/shared/MemberSelection'
import { useUserContext } from '@/context/UserContext'
import { WorkspaceWithProjectsUsers } from '@/types/types'

interface WorkspaceShareFormProps {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  workspace: WorkspaceWithProjectsUsers
}

export function WorkspaceShareForm({
  dialogOpen,
  setDialogOpen,
  workspace,
}: WorkspaceShareFormProps) {
  const { userList } = useUserContext()
  const [workspaceMembers, setWorkspaceMembers] = useState(new Set<string>([]))
  const users = userList.filter(
    (user) => workspace.users.find((u) => u.id === user.id) === undefined,
  )

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShareWorkspaceType>({
    resolver: zodResolver(ShareWorkspaceSchema),
    defaultValues: {
      workspaceId: workspace.id,
      members: Array.from(workspaceMembers),
    },
  })

  async function handleShareWorkspace(formData: ShareWorkspaceType) {
    const response = await shareWorkspace(formData)
    if (response.data) {
      toast.success(`Workspace '${response.data.name}' shared with selected members`)
    } else {
      toast.error(response.error || 'Error sharing workspace')
    }
    setDialogOpen(false)
    setWorkspaceMembers(new Set<string>([]))
  }

  if (JSON.stringify(Array.from(workspaceMembers)) !== JSON.stringify(getValues('members'))) {
    setValue('members', Array.from(workspaceMembers))
    trigger('members')
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={() => {
        setDialogOpen(!dialogOpen)
        setWorkspaceMembers(new Set<string>([]))
      }}
    >
      {/* <DialogTrigger asChild>
        <Button variant={'default'} size={'sm'} className="h-8 w-16">
          Share
        </Button>
      </DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleShareWorkspace)}>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-1">
              <MemberSelection
                members={workspaceMembers}
                setMembers={setWorkspaceMembers}
                currentUserId={undefined}
                users={users}
              />
              {errors.members?.message && (
                <p className="text-xs text-red-600">{errors.members?.message}</p>
              )}
            </div>
            <input hidden {...register('workspaceId')} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="reset" variant="outline" onClick={() => reset()}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sharing...' : 'Share'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
