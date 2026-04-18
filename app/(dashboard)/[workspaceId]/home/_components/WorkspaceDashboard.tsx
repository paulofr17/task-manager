'use client'

import { CheckIcon, ChevronDown, CheckCircle2, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProjectWithSections, WorkspaceWithProjectsUsers } from '@/types/types'

interface WorkspaceDashboardProps {
  workspace: WorkspaceWithProjectsUsers
}

const calculateAllProjectsCompletedTasks = (
  workspace: WorkspaceWithProjectsUsers,
  userId: string,
) => {
  return workspace.projects.reduce((acc, project) => {
    return (
      acc +
      project.sections.reduce((accSection, section) => {
        return (
          accSection +
          section.tasks.filter(
            (task) => task.completed && task.userId === userId,
          ).length
        )
      }, 0)
    )
  }, 0)
}

const calculateProjectCompletedTasks = (
  project: ProjectWithSections,
  userId: string,
) => {
  return project.sections.reduce((accSection, section) => {
    return (
      accSection +
      section.tasks.filter((task) => task.completed && task.userId === userId)
        .length
    )
  }, 0)
}

const calculateAllProjectsCollaborators = (
  workspace: WorkspaceWithProjectsUsers,
) => {
  return workspace.projects.reduce((acc, project) => {
    return acc.concat(project.users)
  }, workspace.users)
}

export function WorkspaceDashboard({ workspace }: WorkspaceDashboardProps) {
  const { data: session } = useSession()
  const [selectedProject, setSelectedProject] = useState<
    ProjectWithSections | 'All'
  >('All')

  if (!session?.user.id) {
    return null
  }

  const completedTasks =
    selectedProject === 'All'
      ? calculateAllProjectsCompletedTasks(workspace, session.user.id)
      : calculateProjectCompletedTasks(selectedProject, session.user.id)

  const collaborators =
    selectedProject === 'All'
      ? Array.from(
          new Set(
            calculateAllProjectsCollaborators(workspace).map((user) => user.id),
          ),
        ).length
      : Array.from(new Set(selectedProject.users.map((user) => user.id))).length

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:gap-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            title={
              selectedProject === 'All' ? 'All Projects' : selectedProject?.name
            }
            className="w-full max-w-[220px] justify-between"
          >
            <span className="truncate">
              {selectedProject === 'All'
                ? 'All Projects'
                : selectedProject?.name}
            </span>
            <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => setSelectedProject('All')}
            >
              <CheckIcon
                className={cn(
                  'h-4 w-4 shrink-0',
                  selectedProject === 'All' ? 'opacity-100' : 'opacity-0',
                )}
              />
              <span className="line-clamp-3 break-all">All Projects</span>
            </DropdownMenuItem>
            {workspace.projects.map((project) => (
              <DropdownMenuItem
                className="flex gap-2"
                key={project.id}
                onClick={() => setSelectedProject(project)}
              >
                <CheckIcon
                  className={cn(
                    'h-4 w-4 shrink-0',
                    selectedProject !== 'All' &&
                      project.id === selectedProject.id
                      ? 'opacity-100'
                      : 'opacity-0',
                  )}
                />
                <span className="line-clamp-3 break-all" title={project.name}>
                  {project.name}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="hidden h-10 w-px bg-border sm:block" />

      <div className="grid flex-1 grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-status-done-soft text-status-done-foreground">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-2xl font-semibold leading-none tracking-tight">
              {completedTasks}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tasks completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <p className="text-2xl font-semibold leading-none tracking-tight">
              {collaborators}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Collaborators</p>
          </div>
        </div>
      </div>
    </div>
  )
}
