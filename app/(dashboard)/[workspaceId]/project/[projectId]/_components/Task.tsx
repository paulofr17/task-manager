'use client'

import { CheckCircle2, Clock, ListChecks } from 'lucide-react'
import { Draggable } from '@hello-pangea/dnd'
import { useState } from 'react'
import { toast } from 'sonner'

import { updateTaskStatus } from '@/actions/UpdateTask/action'
import { TasksWithSubTasks } from '@/types/types'
import { Button } from '@/components/ui/button'
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
  // Update task completion
  const updatedTask = await updateTaskStatus(task.id, !task.completed)
  // show toast based on response
  updatedTask.data ? toast.success('Task updated successfully') : toast.error('Error updating Task')
}

export function Task({ task, index }: TaskProps) {
  const [openSubtasks, setOpenSubtasks] = useState(false)
  const numberOfTasks = task.subTasks.length
  const completedTaks = task.subTasks.filter((subtask) => subtask.completed).length
  const priorityColor = () => {
    switch (task.priority) {
      case 'High':
        return 'border-red-500 bg-red-300/10 text-red-600'
      case 'Medium':
        return 'border-yellow-500 bg-yellow-300/10 text-yellow-600'
      case 'Low':
        return 'border-green-500 bg-green-300/10 text-green-600'
      default:
        return 'border-blue-300 bg-blue-300/10 text-blue-700'
    }
  }
  const dueDateColor = () => {
    if (task.completed) return 'text-green-600'
    if (!task.dueDate) return 'text-muted-foreground'
    const today = new Date()
    const dueDate = new Date(task.dueDate)
    if (dueDate < today) return 'text-red-600'
    // Check days difference
    const daysDifference = Math.round((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
    if (daysDifference <= 3) return 'text-yellow-600'
    return 'text-muted-foreground'
  }

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <li
          className={`flex flex-col justify-stretch space-y-4 rounded-lg border bg-card p-3 ${
            task.completed ? 'opacity-70 dark:opacity-50' : 'opacity-100'
          }`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex items-center justify-between">
            <div
              className={`${priorityColor()} h-5 w-14 items-center rounded-sm border text-center text-xs`}
            >
              {task.priority}
            </div>
            <TaskMenu taskId={task.id} />
          </div>
          <TaskDescriptionForm task={task} />
          <div className="flex h-7 justify-between">
            <div className="flex items-center gap-3">
              <button
                className={`flex items-center space-x-1 rounded-md border p-1 text-xs ${
                  completedTaks === numberOfTasks
                    ? 'border-green-500 bg-green-300/10 text-green-600 hover:border-green-600 hover:bg-green-300/30'
                    : 'border-zinc-400 bg-white text-black hover:opacity-60'
                }`}
                onClick={() => setOpenSubtasks(!openSubtasks)}
              >
                <ListChecks size={15} />
                <span>
                  {completedTaks}/{numberOfTasks}
                </span>
              </button>
              <AssignTask task={task} />
              <Button
                variant="link"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleTaskCompletion(task)}
              >
                <CheckCircle2
                  className={`h-6 w-6 ${
                    task.completed
                      ? 'text-green-600 hover:opacity-40'
                      : 'text-zinc-300 hover:text-green-600 dark:text-zinc-600 dark:hover:text-green-600'
                  }`}
                />
              </Button>
            </div>
            <div className={`${dueDateColor()} flex items-center space-x-1 text-xs`}>
              <span>
                {task.dueDate?.toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                })}
              </span>
              <Clock size={14} />
            </div>
          </div>
          {openSubtasks && (
            <div className="flex flex-col space-y-1">
              {task.subTasks.map((subtask) => (
                <SubTask key={subtask.id} subTask={subtask} />
              ))}
              <AddSubTask taskId={task.id} />
            </div>
          )}
        </li>
      )}
    </Draggable>
  )
}
