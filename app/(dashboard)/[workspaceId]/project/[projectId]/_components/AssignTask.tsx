'use client'

import { CheckIcon } from '@radix-ui/react-icons'
import { UserCircle2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useWorkspaceContext } from '@/context/WorkspaceContext'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { assignTask, unassignTask } from '@/actions/Task/AssignTask/action'
import { TasksWithSubTasks } from '@/types/types'
import { cn } from '@/lib/utils'

interface AssignTaskProps {
  task: TasksWithSubTasks
}

export function AssignTask({ task }: AssignTaskProps) {
  const { currentWorkspace } = useWorkspaceContext()
  const [open, setOpen] = useState(false)
  const assignee = currentWorkspace?.users.find(
    (user) => user.id === task.userId,
  )

  async function handleAssignTask(userId: string) {
    const updatedTask =
      userId === task.userId
        ? await unassignTask(task.id)
        : await assignTask(task.id, userId)
    updatedTask.data
      ? toast.success('Task updated successfully')
      : toast.error('Error updating Task')
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {assignee ? (
          <Button
            variant="ghost"
            size="icon-sm"
            title={assignee.name}
            className="h-6 w-6 p-0 hover:bg-transparent"
          >
            <Avatar className="h-6 w-6 ring-1 ring-border transition-all hover:ring-primary/40">
              <AvatarImage src={assignee.image || ''} alt={assignee.name} />
              <AvatarFallback>
                <UserCircle2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            title="Unassigned"
            className="h-6 w-6 text-muted-foreground/60 hover:text-foreground"
          >
            <UserCircle2 className="h-5 w-5" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="z-[99999] w-[320px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search member…" />
            <CommandEmpty>No member found.</CommandEmpty>
            <CommandGroup heading="Team members">
              {currentWorkspace?.users.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => handleAssignTask(user.id)}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckIcon
                    className={cn(
                      'h-4 w-4',
                      user.id === task?.userId ? 'block' : 'hidden',
                    )}
                  />
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.image || ''} alt={user.name} />
                    <AvatarFallback>
                      <UserCircle2 className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-xs font-medium">
                      {user.name}
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {user.email}
                    </span>
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
