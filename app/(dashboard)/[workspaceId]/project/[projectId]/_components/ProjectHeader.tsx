'use client'

import { useState } from 'react'
import { ChevronDown, UserCircle2 } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ProjectShareForm } from '@/components/shared/ProjectShareForm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProjectWithSections } from '@/types/types'
import { Separator } from '@/components/ui/separator'
import { ProjectNameForm } from './ProjectNameForm'

interface ProjectHeaderProps {
  project: ProjectWithSections
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const [showShareForm, setShowShareForm] = useState(false)
  return (
    <>
      <div className="flex items-center justify-between px-2 py-3">
        <div className="flex items-center">
          {/* <p className="text-xl font-semibold">{project.name}</p> */}
          <ProjectNameForm project={project} />
          <Button variant={'ghost'} size={'icon'} className="ml-1 h-6 w-6" title="Project Actions">
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Badge variant="default" className="mx-2">
            {project.privacy}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {project.users.map((user) => (
              <Avatar key={user.id} className="h-7 w-7" title={user.name}>
                <AvatarImage src={user.image || ''} alt={user.name} />
                <AvatarFallback>
                  <UserCircle2 className="h-7 w-7" />
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <Button
            variant={'default'}
            size={'sm'}
            className="h-8 w-16"
            onClick={() => setShowShareForm(true)}
          >
            Share
          </Button>
          {showShareForm && (
            <ProjectShareForm
              dialogOpen={showShareForm}
              setDialogOpen={setShowShareForm}
              project={project}
            />
          )}
        </div>
      </div>
      <Separator />
    </>
  )
}
