'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { SubTask } from '@prisma/client'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UpdateSubTaskSchema, UpdateSubTaskType } from '@/actions/SubTask/UpdateSubTask/schema'
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
      (formData.description === subTask.description && formData.completed === subTask.completed)
    ) {
      setValue('description', subTask.description)
      return
    }
    const updatedSubTask = await updateSubTask(formData)
    if (updatedSubTask.data) {
      toast.success(`SubTask '${updatedSubTask.data?.description}' successfully updated`)
    } else {
      toast.error('Error updating SubTask')
    }
  }

  async function handleDeleteSubTask() {
    const deletedSubTask = await deleteSubTask(subTask.id)
    if (deletedSubTask.data) {
      toast.success(`SubTask '${deletedSubTask.data?.description}' successfully deleted`)
    } else {
      toast.error('Error deleting SubTask')
    }
  }

  return (
    <>
      <Separator />
      <div className="group flex items-center justify-between gap-2 p-[2px] text-xs text-primary hover:rounded-md hover:bg-muted">
        <Input className="hidden" {...register('subTaskId')}></Input>
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
          className="h-6 rounded-sm border-0 p-1 text-xs group-hover:bg-muted"
          disabled={isSubmitting}
          {...register('description', {
            onBlur: handleSubmit(handleUpdateSubTask),
          })}
        />
        <Button
          variant={'ghost'}
          size={'sm'}
          className="hidden h-6 justify-start p-0 text-xs hover:opacity-50 group-hover:block"
          title="Delete SubTask"
          disabled={isSubmitting}
          onClick={() => handleDeleteSubTask()}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </>
  )
}
