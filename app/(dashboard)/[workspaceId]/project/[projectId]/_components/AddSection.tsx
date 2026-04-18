'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

import { Input } from '@/components/ui/input'
import {
  NewSectionSchema,
  NewSectionType,
} from '@/actions/Section/CreateSection/schema'
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
      <div className="mx-1 flex h-fit w-72 shrink-0 flex-col gap-1 rounded-xl border bg-card p-2 shadow-soft">
        <Input
          autoFocus
          type="text"
          placeholder="Enter section name"
          className="h-9"
          maxLength={255}
          disabled={isSubmitting}
          {...register('sectionName', {
            onBlur: handleSubmit(handleNewSection),
          })}
        />
        {errors.sectionName && (
          <p className="px-1 text-xs text-destructive">
            {errors.sectionName.message}
          </p>
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
    <button
      type="button"
      className="group flex h-full min-h-[120px] w-72 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed bg-transparent p-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
      disabled={isSubmitting}
      onClick={() => setEdit(true)}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted group-hover:bg-primary/10 group-hover:text-primary">
        <Plus className="h-4 w-4" />
      </div>
      Add section
    </button>
  )
}
