'use client'

import { MoreHorizontal, Trash, Users } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProjectShareForm } from '@/components/shared/ProjectShareForm'
import { ProjectWithSections } from '@/types/types'
import { deleteProject } from '@/actions/Project/DeleteProject/action'

interface ProjectMenuProps {
  project: ProjectWithSections
}

const handleDeleteProject = async (projectId: string) => {
  const response = await deleteProject(projectId)
  if (response.data) {
    toast.success(`Project '${response.data.name}' deleted`)
  } else {
    toast.error(response.error || 'Error deleting Project')
  }
}

export function ProjectMenu({ project }: ProjectMenuProps) {
  const [showProjectShareForm, setShowProjectShareForm] = useState(false)

  return (
    <>
      {showProjectShareForm && (
        <ProjectShareForm
          project={project}
          dialogOpen={showProjectShareForm}
          setDialogOpen={setShowProjectShareForm}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="h-8 w-8">
            <MoreHorizontal size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Manage project</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation()
                setShowProjectShareForm(true)
              }}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(event) => {
                event.stopPropagation()
                handleDeleteProject(project.id)
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
