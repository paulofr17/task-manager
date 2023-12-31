'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { createSubTask } from '@/actions/CreateSubTask/action'
import { NewSubTaskSchema, NewSubTaskType } from '@/actions/CreateSubTask/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

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
      toast.success(`SubTask '${subTask.data?.description}' successfully created`)
    } else {
      toast.error('Error creating SubTask')
    }
    reset()
    setNewTask(false)
  }

  return (
    <>
      {newTask && (
        <div className="mb-1 flex h-fit flex-col gap-1">
          <Input
            autoFocus
            type="text"
            placeholder="Write SubTask description"
            className="my-auto flex h-8 w-full"
            maxLength={255}
            disabled={isSubmitting}
            {...register('description', {
              onBlur: handleSubmit(handleNewSubTask),
            })}
          />
          <Input className="hidden" id="projectId" defaultValue={taskId} {...register('taskId')} />
        </div>
      )}
      <Separator />
      <Button
        variant={'ghost'}
        size={'sm'}
        className="justify-start gap-1 pl-1 text-xs"
        disabled={isSubmitting}
        onClick={() => setNewTask(true)}
      >
        <Plus size={15} />
        Add SubTask
      </Button>
    </>
  )
}
