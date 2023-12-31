'use client'

import { useState } from 'react'
import { CaretSortIcon, CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'

import { useWorkspaceContext } from '@/context/WorkspaceContext'

import {
  Command,
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { CreateWorkspace } from '@/components/shared/CreateWorkspace'
import { WorkspaceWithProjectsUsers } from '@/types/types'

export function WorkspaceSelection() {
  const { currentWorkspace, setCurrentWorkspace, workspaceList } = useWorkspaceContext()
  const [showNewWorkspace, setShowNewWorkspace] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  function handleSelectWorkspace(workspace: WorkspaceWithProjectsUsers) {
    if (workspace.id === currentWorkspace?.id) {
      setCurrentWorkspace(null)
      router.push('/')
    } else {
      setCurrentWorkspace(workspace)
      router.push(`/${workspace.id}/home`)
    }
    setOpen(false)
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            variant="outline"
            aria-expanded={open}
            aria-label="Select Workspace"
            title={currentWorkspace?.name || 'Select Workspace'}
            className="w-[180px] justify-between"
          >
            <span className="truncate">{currentWorkspace?.name || 'Select Workspace'}</span>
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-[99999] w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search Workspace..." />
              <CommandEmpty>No Workspace found.</CommandEmpty>
              <CommandGroup heading="Workspaces">
                {workspaceList.map((workspace) => (
                  <CommandItem
                    key={workspace.id}
                    onSelect={() => handleSelectWorkspace(workspace)}
                    className="flex"
                  >
                    <p className="line-clamp-3 break-all text-sm" title={workspace.name}>
                      {workspace.name}
                    </p>
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4 shrink-0',
                        workspace.id === currentWorkspace?.id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    setShowNewWorkspace(true)
                  }}
                >
                  <PlusCircledIcon className="mr-2 h-5 w-5" />
                  New Workspace
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {showNewWorkspace && (
        <CreateWorkspace dialogOpen={showNewWorkspace} setDialogOpen={setShowNewWorkspace} />
      )}
    </>
  )
}
