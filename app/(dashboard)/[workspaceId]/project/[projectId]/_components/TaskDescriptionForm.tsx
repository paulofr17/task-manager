'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { TasksWithSubTasks } from '@/types/types'
import { updateTaskDescription } from '@/actions/Task/UpdateTask/action'
import { cn } from '@/lib/utils'

interface TaskDescriptionFormProps {
  task: TasksWithSubTasks
}

export function TaskDescriptionForm({ task }: TaskDescriptionFormProps) {
  const [edit, setEdit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [description, setDescription] = useState(task.description)
  const inputRef = useRef<HTMLInputElement>(null)

  async function submitChanges() {
    if (!description || description === task.description) {
      setEdit(false)
      setDescription(task.description)
      return
    }
    setIsSubmitting(true)
    const updatedTask = await updateTaskDescription(task.id, description)
    if (updatedTask.data) {
      task.description = updatedTask.data.description
      toast.success(
        `Task description successfully updated to '${updatedTask.data.description}'`,
      )
    } else {
      setDescription(task.description)
      toast.error(updatedTask.error || 'Error updating task')
    }
    setEdit(false)
    setIsSubmitting(false)
  }

  const enableEdit = () => {
    setEdit(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)
  }

  const onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submitChanges()
    }
  }

  return (
    <>
      {edit ? (
        <Input
          ref={inputRef}
          value={description}
          onBlur={submitChanges}
          onChange={onDescriptionChange}
          onKeyDown={onKeyDown}
          disabled={isSubmitting}
          maxLength={255}
          className="h-7 px-2 text-sm"
        />
      ) : (
        <button
          type="button"
          className="-mx-1 w-full rounded-md px-1 py-0.5 text-left transition-colors hover:bg-muted/50"
          onClick={enableEdit}
          title={task.description}
        >
          <span
            className={cn(
              'line-clamp-3 break-words text-sm leading-snug',
              task.completed && 'text-muted-foreground line-through',
            )}
          >
            {task.description}
          </span>
        </button>
      )}
    </>
  )
}
