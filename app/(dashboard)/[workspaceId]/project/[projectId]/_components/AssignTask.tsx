'use client'

import { CheckIcon } from '@radix-ui/react-icons'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { UserCircle2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useWorkspaceContext } from '@/context/WorkspaceContext'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { assignTask, unassignTask } from '@/actions/AssignTask/action'
import { TasksWithSubTasks } from '@/types/types'
import { cn } from '@/lib/utils'

interface AssignTaskProps {
  task: TasksWithSubTasks
}

export function AssignTask({ task }: AssignTaskProps) {
  const { currentWorkspace } = useWorkspaceContext()
  const [open, setOpen] = useState(false)

  async function handleAssignTask(userId: string) {
    // Assign or unassign task based on user selected
    const updatedTask =
      userId === task.userId ? await unassignTask(task.id) : await assignTask(task.id, userId)
    // show toast based on response
    updatedTask.data
      ? toast.success('Task updated successfully')
      : toast.error('Error updating Task')
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {task.userId ? (
          <Button
            size="icon"
            variant="ghost"
            title="Unassigned"
            className="h-6 w-6 bg-transparent text-accent-foreground hover:opacity-50"
          >
            <Avatar title={currentWorkspace?.users.find((user) => user.id === task.userId)?.name}>
              <AvatarImage
                src={currentWorkspace?.users.find((user) => user.id === task.userId)?.image || ''}
                className="rounded-full"
              />
              <AvatarFallback>
                <UserCircle2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            title="Unassigned"
            className="h-6 w-6 bg-transparent text-accent-foreground opacity-50 hover:opacity-20"
          >
            <UserCircle2 className="h-6 w-6" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="z-[99999] w-[350px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search member ..." />
            <CommandEmpty>No Member found.</CommandEmpty>
            <CommandGroup heading="Team Members">
              {currentWorkspace?.users.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => handleAssignTask(user.id)}
                  className="text-sm"
                >
                  <CheckIcon
                    className={cn('mr-2 h-4 w-4', user.id === task?.userId ? 'block' : 'hidden')}
                  />
                  <div className="flex gap-2">
                    <span className="text-xs font-semibold">{user.name}</span>
                    <span className="text-xs font-medium text-muted-foreground">{user.email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
