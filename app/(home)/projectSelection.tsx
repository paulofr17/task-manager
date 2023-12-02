'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState, useCallback } from 'react'
import { ProjectWithBoards } from '@/models/types'
import { User } from '@prisma/client'
import { AddProjectForm } from './addProjectForm'

interface ProjectSelectionProps {
  projects: ProjectWithBoards[]
  userList: User[]
}

export function ProjectSelection({ projects, userList }: ProjectSelectionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [openProjectSelection, setOpenProjectSelection] = useState(false)
  const [activeProject, setActiveProject] = useState(searchParams?.get('project') || '')
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams],
  )
  const changeSelectedProject = (newProjectId: string) => {
    const newValue = activeProject === newProjectId ? '' : newProjectId
    setActiveProject(newValue)
    setOpenProjectSelection(false)
    router.push(pathname + '?' + createQueryString('project', newValue))
  }

  return (
    <Popover open={openProjectSelection} onOpenChange={setOpenProjectSelection}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openProjectSelection}
          className="w-full justify-between border border-purple-200 text-purple-650 "
        >
          <p className="truncate">
            {projects.find((project) => project.id === activeProject)?.name || 'Select Project'}
          </p>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-purple-650 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandInput placeholder="Search Project..." />
          <CommandEmpty>No Project found.</CommandEmpty>
          <CommandGroup heading="Projects">
            {projects.map((project) => (
              <CommandItem
                key={project.id}
                value={project.name}
                onSelect={() => changeSelectedProject(project.id)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4 text-purple-650',
                    activeProject === project.id ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {project.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <AddProjectForm userList={userList} changeSelectedProject={changeSelectedProject} />
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
