'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SectionWithTasks } from '@/types/types'
import { updateSectionName } from '@/actions/UpdateSection/action'

interface SectionNameFormProps {
  section: SectionWithTasks
}

export function SectionNameForm({ section }: SectionNameFormProps) {
  const [editName, setEditName] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sectionName, setSectionName] = useState(section.name)
  const nameRef = useRef<HTMLInputElement>(null)

  async function submitChanges() {
    if (!sectionName || sectionName === section.name) {
      setEditName(false)
      setSectionName(section.name)
      return
    }
    setIsSubmitting(true)
    const updatedSection = await updateSectionName(section.id, sectionName)
    if (updatedSection.data) {
      section.name = updatedSection.data.name
      toast.success(`Section name successfully updated to '${updatedSection.data.name}'`)
    } else {
      toast.error(updatedSection.error || 'Error updating section')
    }
    setEditName(false)
    setIsSubmitting(false)
  }

  const enableEditName = () => {
    setEditName(true)
    setTimeout(() => {
      nameRef.current?.focus()
      nameRef.current?.select()
    }, 0)
  }

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSectionName(event.target.value)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submitChanges()
    }
  }

  return (
    <>
      {editName ? (
        <Input
          ref={nameRef}
          value={sectionName}
          onBlur={submitChanges}
          onChange={onNameChange}
          onKeyDown={onKeyDown}
          disabled={isSubmitting}
          maxLength={255}
          className="h-6 p-0 px-1 text-sm font-medium"
        />
      ) : (
        <Button
          variant={'ghost'}
          size={'sm'}
          className="truncate px-1 text-sm font-medium"
          onClick={enableEditName}
          title={section.name}
        >
          <span className="truncate">{section.name}</span>
        </Button>
      )}
    </>
  )
}
