'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ShareProjectSchema, ShareProjectType } from '@/actions/ShareProject/schema'
import { shareProject } from '@/actions/ShareProject/action'
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
import { ProjectWithSections } from '@/types/types'

interface ProjectShareFormProps {
  project: ProjectWithSections
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
}

export function ProjectShareForm({ project, dialogOpen, setDialogOpen }: ProjectShareFormProps) {
  const { userList } = useUserContext()
  const [projectMembers, setProjectMembers] = useState(new Set<string>([]))
  const users = userList.filter((user) => project.users.find((u) => u.id === user.id) === undefined)

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShareProjectType>({
    resolver: zodResolver(ShareProjectSchema),
    defaultValues: {
      projectId: project.id,
      members: Array.from(projectMembers),
    },
  })

  async function handleShareProject(formData: ShareProjectType) {
    const response = await shareProject(formData)
    if (response.data) {
      toast.success(`Project '${response.data.name}' shared with selected members`)
    } else {
      toast.error(response.error || 'Error sharing Project')
    }
    setDialogOpen(false)
    setProjectMembers(new Set<string>([]))
  }

  if (JSON.stringify(Array.from(projectMembers)) !== JSON.stringify(getValues('members'))) {
    setValue('members', Array.from(projectMembers))
    trigger('members')
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={() => {
        setDialogOpen(!dialogOpen)
        setProjectMembers(new Set<string>([]))
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleShareProject)}>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-1">
              <MemberSelection
                members={projectMembers}
                setMembers={setProjectMembers}
                currentUserId={undefined}
                users={users}
              />
              {errors.members?.message && (
                <p className="text-xs text-red-600">{errors.members?.message}</p>
              )}
            </div>
            <input hidden {...register('projectId')} />
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
