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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MemberSelection } from './memberSelection'
import { useState } from 'react'
import { User } from '@prisma/client'
import { toaster } from '@/lib/toaster'
import { createProject } from './_actions/createProject'
import { PlusCircleIcon } from 'lucide-react'
import { CommandItem } from '@/components/ui/command'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NewProjectSchema, NewProjectType } from '@/lib/schemas/newProjectSchema'

interface AddProjectFormProps {
  userList: User[]
  changeSelectedProject: (newProjectId: string) => void
}

export function AddProjectForm({ userList, changeSelectedProject }: AddProjectFormProps) {
  const { data: session } = useSession()
  const [openProjectCreation, setOpenProjectCreation] = useState(false)
  const [projectMembers, setProjectMembers] = useState(new Set<string>())

  async function handleProjectCreation(formData: NewProjectType) {
    const response = await createProject(formData, projectMembers)
    if (response.message && response.project) {
      toaster('success', response.message)
      setOpenProjectCreation(false)
      changeSelectedProject(response.project.id)
    } else {
      toaster('error', response.error || 'Error creating project')
    }
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewProjectType>({
    resolver: zodResolver(NewProjectSchema),
  })

  const resetForm = () => {
    reset({ projectName: '' })
    setProjectMembers(
      new Set<string>([userList.find((user) => user.email === session?.user?.email)?.id || '']),
    )
    setOpenProjectCreation(false)
  }

  return (
    <Dialog open={openProjectCreation} onOpenChange={resetForm}>
      <DialogTrigger asChild>
        <CommandItem
          onSelect={() => {
            setProjectMembers(
              new Set<string>([
                userList.find((user) => user.email === session?.user?.email)?.id || '',
              ]),
            )
            setOpenProjectCreation(true)
          }}
        >
          <PlusCircleIcon className="mr-2 h-5 w-5" />
          Create Project
        </CommandItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Add a new project to create boards.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleProjectCreation)}>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project name</Label>
              <Input
                {...register('projectName')}
                id="projectName"
                name="projectName"
                placeholder="Project Example"
                required
                className="focus-visible:border-purple-650/50 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {errors.projectName?.message && (
                <p className="text-sm text-red-600">{errors.projectName?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <MemberSelection
                members={projectMembers}
                setMembers={setProjectMembers}
                users={userList}
              />
              {!projectMembers.size && (
                <p className="text-sm text-red-600">
                  You must add atleast one member to the project
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="reset" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !projectMembers.size}
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
