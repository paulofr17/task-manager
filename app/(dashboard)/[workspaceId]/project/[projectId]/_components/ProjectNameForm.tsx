'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProjectWithSections } from '@/types/types'
import { updateProjectName } from '@/actions/Project/UpdateProject/action'

interface ProjectNameFormProps {
  project: ProjectWithSections
}

export function ProjectNameForm({ project }: ProjectNameFormProps) {
  const [edit, setEdit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState(project.name)
  const inputRef = useRef<HTMLInputElement>(null)

  async function submitChanges() {
    if (!name || name === project.name) {
      setEdit(false)
      setName(project.name)
      return
    }
    setIsSubmitting(true)
    const updatedProject = await updateProjectName(project.id, name)
    if (updatedProject.data) {
      project.name = updatedProject.data.name
      toast.success(`Project name successfully updated to '${updatedProject.data.name}'`)
    } else {
      setName(project.name)
      toast.error(updatedProject.error || 'Error updating project')
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

  const onProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
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
          value={name}
          onBlur={submitChanges}
          onChange={onProjectNameChange}
          onKeyDown={onKeyDown}
          disabled={isSubmitting}
          maxLength={255}
          className="m-1 h-6 p-1 text-base font-semibold sm:text-xl"
        />
      ) : (
        <Button
          variant={'ghost'}
          size={'sm'}
          className="flex truncate px-2 py-1 text-left"
          onClick={enableEdit}
          title={project.name}
        >
          <span className="truncate text-base font-semibold sm:text-xl">{project.name}</span>
        </Button>
      )}
    </>
  )
}
