'use client'

import { CheckIcon, ChevronDown } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
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

// Replace for UseMemo
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
          section.tasks.filter((task) => task.completed && task.userId === userId).length
        )
      }, 0)
    )
  }, 0)
}

// Replace for UseMemo
const calculateProjectCompletedTasks = (project: ProjectWithSections, userId: string) => {
  return project.sections.reduce((accSection, section) => {
    return (
      accSection + section.tasks.filter((task) => task.completed && task.userId === userId).length
    )
  }, 0)
}

const calculateAllProjectsCollaborators = (workspace: WorkspaceWithProjectsUsers) => {
  return workspace.projects.reduce((acc, project) => {
    return acc.concat(project.users)
  }, workspace.users)
}

export function WorkspaceDashboard({ workspace }: WorkspaceDashboardProps) {
  const { data: session } = useSession()
  const [selectedProject, setSelectedProject] = useState<ProjectWithSections | 'All'>('All')

  if (!session?.user.id) {
    return null
  }

  const completedTaks =
    selectedProject === 'All'
      ? calculateAllProjectsCompletedTasks(workspace, session.user.id)
      : calculateProjectCompletedTasks(selectedProject, session.user.id)

  const collaborators =
    selectedProject === 'All'
      ? Array.from(new Set(calculateAllProjectsCollaborators(workspace).map((user) => user.id)))
          .length
      : Array.from(new Set(selectedProject.users.map((user) => user.id))).length

  return (
    <div className="mx-auto mt-4 flex h-16 w-full max-w-[500px] items-center justify-between gap-2 rounded-full bg-accent px-4 text-xs text-primary sm:gap-4">
      <div className="flex flex-1 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size={'icon'}
              title={selectedProject === 'All' ? 'All Projects' : selectedProject?.name}
              className="flex w-full items-center hover:bg-muted-foreground/30 focus-visible:ring-transparent focus-visible:ring-offset-0"
            >
              <span className="line-clamp-2 break-words">
                {selectedProject === 'All' ? 'All Projects' : selectedProject?.name}
              </span>
              <ChevronDown className="ml-1 mt-1 h-4 w-4 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex gap-2" onClick={() => setSelectedProject('All')}>
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
                      selectedProject !== 'All' && project.id === selectedProject.id
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
        <Separator orientation="vertical" className="ml-1 h-8 bg-muted-foreground" />
      </div>
      <div className="flex items-center gap-1 pl-1">
        <p className="text-lg">{completedTaks}</p>
        <p>tasks Completed</p>
      </div>
      <div className="flex items-center gap-1">
        <p className="text-lg">{collaborators}</p>
        <p>collaborators</p>
      </div>
    </div>
  )
}
