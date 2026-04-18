'use client'

import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'

import { Project } from '@prisma/client'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { deleteProject } from '@/actions/Project/DeleteProject/action'

interface ProjectItemProps {
  project: Project
}

const HUES = [210, 260, 330, 150, 30, 190, 290, 100]
const hashHue = (id: string) =>
  HUES[id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length]
const initial = (name: string) => name?.[0]?.toUpperCase() || '?'

const handleDeleteProject = async (projectId: string) => {
  const response = await deleteProject(projectId)
  if (response.data) {
    toast.success(`Project '${response.data.name}' deleted`)
  } else {
    toast.error(response.error || 'Error deleting Project')
  }
}

export function ProjectItem({ project }: ProjectItemProps) {
  const hue = hashHue(project.id)
  return (
    <div className="group relative flex items-center gap-3 rounded-md border border-transparent px-2 py-1.5 transition-colors hover:border-border hover:bg-muted/50">
      <Link
        href={`/${project.workspaceId}/project/${project.id}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold text-white shadow-soft"
          style={{
            backgroundImage: `linear-gradient(135deg, hsl(${hue} 75% 55%), hsl(${(hue + 30) % 360} 75% 60%))`,
          }}
        >
          {initial(project.name)}
        </div>
        <p className="truncate text-sm font-medium" title={project.name}>
          {project.name}
        </p>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={(event) => {
              event.stopPropagation()
              handleDeleteProject(project.id)
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
