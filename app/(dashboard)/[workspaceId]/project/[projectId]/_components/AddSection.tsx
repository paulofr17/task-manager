'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NewSectionSchema, NewSectionType } from '@/actions/Section/CreateSection/schema'
import { createSection } from '@/actions/Section/CreateSection/action'

interface AddColumnProps {
  boardId: string
}

export function AddSection({ boardId }: AddColumnProps) {
  const [edit, setEdit] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewSectionType>({
    resolver: zodResolver(NewSectionSchema),
  })

  async function handleNewSection(formData: NewSectionType) {
    if (!formData.sectionName) {
      setEdit(false)
      return
    }
    const section = await createSection(formData)
    if (section.data) {
      toast.success(`Column ${section.data?.name} successfully created`)
    } else {
      toast.error(section.error || 'Error creating section')
    }
    reset()
    setEdit(false)
  }

  if (edit) {
    return (
      <div className="mx-1 flex h-fit flex-col gap-1 pt-1">
        <Input
          autoFocus
          type="text"
          placeholder="Enter Section Name"
          className="my-auto flex h-8 w-60"
          maxLength={255}
          disabled={isSubmitting}
          {...register('sectionName', {
            onBlur: handleSubmit(handleNewSection),
          })}
        />
        {errors.sectionName && (
          <p className="px-1 text-xs text-destructive">{errors.sectionName.message}</p>
        )}
        <Input
          className="hidden"
          id="projectId"
          defaultValue={boardId}
          {...register('projectId')}
        />
      </div>
    )
  }

  return (
    <Button
      variant={'outline'}
      className="flex w-40 shrink-0 gap-2 font-semibold"
      disabled={isSubmitting}
      onClick={() => {
        setEdit(true)
      }}
    >
      <Plus size={20} />
      Add Section
    </Button>
  )
}
