'use client'

import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'

import { Project } from '@prisma/client'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { deleteProject } from '@/actions/DeleteProject/action'

interface ProjectItemProps {
  project: Project
}

const handleDeleteProject = async (projectId: string) => {
  const response = await deleteProject(projectId)
  if (response.data) {
    toast.success(`Project '${response.data.name}' deleted`)
  } else {
    toast.error(response.error || 'Error deleting Project')
  }
}

export function ProjectItem({ project }: ProjectItemProps) {
  return (
    <Link
      href={`/${project.workspaceId}/project/${project.id}`}
      className="-mx-2 flex h-10 items-center justify-between space-x-4 rounded-md p-2 text-primary transition-all hover:bg-accent"
    >
      <p className="text-sm font-medium leading-none">{project.name}</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 bg-transparent p-0 hover:bg-muted-foreground/30 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[100px]">
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation()
              handleDeleteProject(project.id)
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Link>
  )
}
