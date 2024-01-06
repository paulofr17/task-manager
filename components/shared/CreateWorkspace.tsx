'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MemberSelection } from '@/components/shared/MemberSelection'
import { NewWorkspaceSchema, NewWorkspaceType } from '@/actions/Workspace/CreateWorkspace/schema'
import { createWorkspace } from '@/actions/Workspace/CreateWorkspace/action'
import { useUserContext } from '@/context/UserContext'

interface CreateWorkspaceProps {
  dialogOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
}

export function CreateWorkspace({ dialogOpen, setDialogOpen }: CreateWorkspaceProps) {
  const router = useRouter()
  const { userList } = useUserContext()
  const { data: session } = useSession()
  const currentUserId = userList.find((user) => user.email === session?.user?.email)?.id || ''
  const [workspaceMembers, setWorkspaceMembers] = useState(new Set<string>([currentUserId]))

  async function handleNewWorkspace(formData: NewWorkspaceType) {
    const response = await createWorkspace(formData)
    if (response.data) {
      toast.success(`Workspace '${response.data.name}' created`)
      router.push(`/${response.data.id}/home`)
    } else {
      toast.error(response.error || 'Error creating Workspace')
    }
    setDialogOpen(false)
    reset()
  }

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewWorkspaceType>({
    resolver: zodResolver(NewWorkspaceSchema),
    defaultValues: {
      members: Array.from(workspaceMembers),
    },
  })

  if (JSON.stringify(Array.from(workspaceMembers)) !== JSON.stringify(getValues('members'))) {
    setValue('members', Array.from(workspaceMembers))
    trigger('members')
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleNewWorkspace)}>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-1">
              <Label htmlFor="workspaceName">Workspace name</Label>
              <Input
                id="workspaceName"
                placeholder="Workspace or Team name"
                {...register('workspaceName')}
              />
              {errors.workspaceName?.message && (
                <p className="text-xs text-red-600">{errors.workspaceName?.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <MemberSelection
                members={workspaceMembers}
                setMembers={setWorkspaceMembers}
                currentUserId={currentUserId}
                users={userList}
              />
              {errors.members?.message && (
                <p className="text-xs text-red-600">{errors.members?.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="reset" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
