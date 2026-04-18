'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import type { SubTask } from '@prisma/client'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  UpdateSubTaskSchema,
  UpdateSubTaskType,
} from '@/actions/SubTask/UpdateSubTask/schema'
import { updateSubTask } from '@/actions/SubTask/UpdateSubTask/action'
import { deleteSubTask } from '@/actions/SubTask/DeleteSubTask/action'

interface SubTaskProps {
  subTask: SubTask
}

export function SubTask({ subTask }: SubTaskProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<UpdateSubTaskType>({
    resolver: zodResolver(UpdateSubTaskSchema),
    defaultValues: {
      subTaskId: subTask.id,
      completed: subTask.completed,
      description: subTask.description,
    },
  })

  async function handleUpdateSubTask(formData: UpdateSubTaskType) {
    if (
      !formData.description ||
      (formData.description === subTask.description &&
        formData.completed === subTask.completed)
    ) {
      setValue('description', subTask.description)
      return
    }
    const updatedSubTask = await updateSubTask(formData)
    if (updatedSubTask.data) {
      toast.success(
        `SubTask '${updatedSubTask.data?.description}' successfully updated`,
      )
    } else {
      toast.error('Error updating SubTask')
    }
  }

  async function handleDeleteSubTask() {
    const deletedSubTask = await deleteSubTask(subTask.id)
    if (deletedSubTask.data) {
      toast.success(
        `SubTask '${deletedSubTask.data?.description}' successfully deleted`,
      )
    } else {
      toast.error('Error deleting SubTask')
    }
  }

  return (
    <div className="group flex items-center gap-2 rounded-md px-1 py-0.5 text-xs transition-colors hover:bg-muted/60">
      <Input className="hidden" {...register('subTaskId')} />
      <Checkbox
        checked={subTask.completed}
        onCheckedChange={(value) => {
          setValue('completed', value === true)
          handleSubmit(handleUpdateSubTask)()
        }}
        disabled={isSubmitting}
        {...register('completed')}
      />

      <Input
        className={cn(
          'h-6 flex-1 rounded-sm border-0 bg-transparent px-1 text-xs shadow-none focus-visible:ring-0 focus-visible:ring-offset-0',
          subTask.completed && 'text-muted-foreground line-through',
        )}
        disabled={isSubmitting}
        {...register('description', {
          onBlur: handleSubmit(handleUpdateSubTask),
        })}
      />
      <Button
        variant="ghost"
        size="icon-sm"
        className="h-6 w-6 opacity-0 group-hover:opacity-100"
        title="Delete SubTask"
        disabled={isSubmitting}
        onClick={() => handleDeleteSubTask()}
      >
        <Trash2 size={14} />
      </Button>
    </div>
  )
}
