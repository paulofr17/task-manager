'use client'

import { useState } from 'react'
import { ChevronDown, UserCircle2 } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { WorkspaceWithProjectsUsers } from '@/types/types'
import { WorkspaceShareForm } from '@/components/shared/WorkspaceShareForm'

interface WorkspaceHeaderProps {
  workspace: WorkspaceWithProjectsUsers
}

export function WorkspaceHeader({ workspace }: WorkspaceHeaderProps) {
  const [showShareForm, setShowShareForm] = useState(false)
  return (
    <div
      className="flex w-full items-center justify-between gap-4 px-2 py-3
    "
    >
      <div className="flex items-center">
        <p className="line-clamp-2 truncate text-xl font-bold" title={workspace.name}>
          {workspace.name}
        </p>
        <Button variant={'ghost'} size={'icon'} className="ml-1 h-6 w-6" title="Workspace Actions">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {workspace.users.map((user) => (
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
      </div>
      <WorkspaceShareForm
        workspace={workspace}
        dialogOpen={showShareForm}
        setDialogOpen={setShowShareForm}
      />
    </div>
  )
}
