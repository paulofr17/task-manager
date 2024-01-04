'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TasksWithSubTasks } from '@/types/types'
import { updateTaskDescription } from '@/actions/UpdateTask/action'

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
      toast.success(`Task description successfully updated to '${updatedTask.data.description}'`)
    } else {
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
          className="h-6 p-0 px-1 text-xs lg:text-sm"
        />
      ) : (
        <Button
          variant={'ghost'}
          size={'sm'}
          className="flex h-fit w-fit justify-start p-1 text-left"
          onClick={enableEdit}
          title={task.description}
        >
          <span
            className={`line-clamp-3 break-words text-xs lg:text-sm ${
              task.completed && 'line-through'
            }`}
          >
            {task.description}
          </span>
        </Button>
      )}
    </>
  )
}
