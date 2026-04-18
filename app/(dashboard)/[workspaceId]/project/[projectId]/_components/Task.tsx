'use client'

import { CheckCircle2, Clock, ListChecks } from 'lucide-react'
import { Draggable } from '@hello-pangea/dnd'
import { useState } from 'react'
import { toast } from 'sonner'

import { updateTaskStatus } from '@/actions/Task/UpdateTask/action'
import { TasksWithSubTasks } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { AddSubTask } from './AddSubTask'
import { TaskMenu } from './TaskMenu'
import { AssignTask } from './AssignTask'
import { SubTask } from './SubTask'
import { TaskDescriptionForm } from './TaskDescriptionForm'

interface TaskProps {
  task: TasksWithSubTasks
  index: number
}

async function handleTaskCompletion(task: TasksWithSubTasks) {
  const updatedTask = await updateTaskStatus(task.id, !task.completed)
  updatedTask.data
    ? toast.success('Task updated successfully')
    : toast.error('Error updating Task')
}

type PriorityBadge =
  | 'priority-low'
  | 'priority-medium'
  | 'priority-high'
  | 'priority-urgent'
  | 'soft'

const priorityVariant = (p: string | null | undefined): PriorityBadge => {
  switch (p) {
    case 'High':
      return 'priority-high'
    case 'Medium':
      return 'priority-medium'
    case 'Low':
      return 'priority-low'
    default:
      return 'soft'
  }
}

const priorityEdge = (p: string | null | undefined) => {
  switch (p) {
    case 'High':
      return 'bg-priority-high'
    case 'Medium':
      return 'bg-priority-medium'
    case 'Low':
      return 'bg-priority-low'
    default:
      return 'bg-border'
  }
}

export function Task({ task, index }: TaskProps) {
  const [openSubtasks, setOpenSubtasks] = useState(false)
  const numberOfTasks = task.subTasks.length
  const completedTasks = task.subTasks.filter(
    (subtask) => subtask.completed,
  ).length
  const allSubTasksDone = numberOfTasks > 0 && completedTasks === numberOfTasks

  const dueDateState = () => {
    if (task.completed) return 'done'
    if (!task.dueDate) return 'none'
    const today = new Date()
    const dueDate = new Date(task.dueDate)
    if (dueDate < today) return 'overdue'
    const daysDifference = Math.round(
      (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24),
    )
    if (daysDifference <= 3) return 'soon'
    return 'future'
  }

  const dueClass = {
    done: 'text-status-done',
    overdue: 'text-status-blocked',
    soon: 'text-status-progress',
    future: 'text-muted-foreground',
    none: 'text-muted-foreground',
  }[dueDateState()]

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            className={cn(
              'group relative flex flex-col gap-3 overflow-hidden rounded-lg border bg-card p-3 shadow-soft hover:border-primary/30 hover:shadow-elevated',
              task.completed && 'opacity-60',
            )}
          >
            <span
              className={cn(
                'absolute left-0 top-0 h-full w-1',
                priorityEdge(task.priority),
              )}
            />
            <div className="flex items-center justify-between pl-1">
              <Badge
                variant={priorityVariant(task.priority)}
                className="text-[10px]"
              >
                {task.priority || 'None'}
              </Badge>
              <TaskMenu taskId={task.id} />
            </div>
            <div className="pl-1">
              <TaskDescriptionForm task={task} />
            </div>
            <div className="flex items-center justify-between pl-1">
              <div className="flex items-center gap-1.5">
                {numberOfTasks > 0 && (
                  <button
                    type="button"
                    onClick={() => setOpenSubtasks(!openSubtasks)}
                    className={cn(
                      'inline-flex h-6 items-center gap-1 rounded-md border px-1.5 text-[11px] font-medium transition-colors',
                      allSubTasksDone
                        ? 'border-status-done/40 bg-status-done-soft text-status-done-foreground'
                        : 'bg-background hover:bg-muted',
                    )}
                  >
                    <ListChecks size={13} />
                    <span>
                      {completedTasks}/{numberOfTasks}
                    </span>
                  </button>
                )}
                <AssignTask task={task} />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-6 w-6"
                  onClick={() => handleTaskCompletion(task)}
                  title={
                    task.completed ? 'Mark as incomplete' : 'Mark as complete'
                  }
                >
                  <CheckCircle2
                    className={cn(
                      'h-5 w-5 transition-colors',
                      task.completed
                        ? 'text-status-done'
                        : 'text-muted-foreground/40 hover:text-status-done',
                    )}
                  />
                </Button>
              </div>
              {task.dueDate && (
                <div
                  className={cn(
                    'flex items-center gap-1 text-[11px] font-medium',
                    dueClass,
                  )}
                >
                  <Clock size={12} />
                  <span>
                    {task.dueDate.toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                </div>
              )}
            </div>
            {openSubtasks && (
              <div className="flex flex-col gap-1 pl-1 pt-1">
                {task.subTasks.map((subtask) => (
                  <SubTask key={subtask.id} subTask={subtask} />
                ))}
                <AddSubTask taskId={task.id} />
              </div>
            )}
          </div>
        </li>
      )}
    </Draggable>
  )
}
