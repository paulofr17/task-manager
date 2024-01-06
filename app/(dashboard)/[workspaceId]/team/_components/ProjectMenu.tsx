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
          <Button
            variant={'ghost'}
            size={'icon'}
            className="ml-2 h-8 w-8 hover:bg-muted-foreground/30"
          >
            <MoreHorizontal size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuLabel className="text-base">Manage Project</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex gap-2"
              onClick={(event) => {
                event.stopPropagation()
                setShowProjectShareForm(true)
              }}
            >
              <Users size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex gap-2"
              onClick={(event) => {
                event.stopPropagation()
                handleDeleteProject(project.id)
              }}
            >
              <Trash size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
