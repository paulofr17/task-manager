'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { createSubTask } from '@/actions/SubTask/CreateSubTask/action'
import {
  NewSubTaskSchema,
  NewSubTaskType,
} from '@/actions/SubTask/CreateSubTask/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AddSubTaskProps {
  taskId: string
}

export function AddSubTask({ taskId }: AddSubTaskProps) {
  const [newTask, setNewTask] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NewSubTaskType>({
    resolver: zodResolver(NewSubTaskSchema),
  })

  async function handleNewSubTask(formData: NewSubTaskType) {
    if (!formData.description) {
      setNewTask(false)
      return
    }
    const subTask = await createSubTask(formData)
    if (subTask.data) {
      toast.success(
        `SubTask '${subTask.data?.description}' successfully created`,
      )
    } else {
      toast.error('Error creating SubTask')
    }
    reset()
    setNewTask(false)
  }

  return (
    <>
      {newTask && (
        <div className="flex items-center gap-2 rounded-md border bg-background px-1 py-0.5">
          <Input
            autoFocus
            type="text"
            placeholder="SubTask description"
            className="h-7 border-0 bg-transparent px-1 text-xs shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            maxLength={255}
            disabled={isSubmitting}
            {...register('description', {
              onBlur: handleSubmit(handleNewSubTask),
            })}
          />
          <Input
            className="hidden"
            id="projectId"
            defaultValue={taskId}
            {...register('taskId')}
          />
        </div>
      )}
      {!newTask && (
        <Button
          variant="ghost"
          size="xs"
          className="justify-start gap-1 pl-1 text-xs text-muted-foreground hover:text-foreground"
          disabled={isSubmitting}
          onClick={() => setNewTask(true)}
        >
          <Plus size={14} />
          Add subtask
        </Button>
      )}
    </>
  )
}
