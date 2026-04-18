'use client'

import { useState } from 'react'
import { UserCircle2, UserPlus } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { WorkspaceWithProjectsUsers } from '@/types/types'
import { WorkspaceShareForm } from '@/components/shared/WorkspaceShareForm'

interface WorkspaceHeaderProps {
  workspace: WorkspaceWithProjectsUsers
}

const HUES = [210, 260, 330, 150, 30, 190, 290, 100]

function hueFromId(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return HUES[h % HUES.length]
}

function initials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function WorkspaceHeader({ workspace }: WorkspaceHeaderProps) {
  const [showShareForm, setShowShareForm] = useState(false)
  const hue = hueFromId(workspace.id)
  const coverBg = `linear-gradient(135deg, hsl(${hue} 80% 55%) 0%, hsl(${(hue + 40) % 360} 80% 60%) 100%)`

  return (
    <div className="mb-6">
      <div
        className="relative h-28 w-full overflow-hidden"
        style={{ background: coverBg }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
      </div>
      <div className="mx-auto mt-4 flex w-full max-w-5xl items-end justify-between gap-4 px-4">
        <div className="flex items-end gap-4 overflow-hidden">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-4 border-background text-xl font-semibold text-white shadow-elevated"
            style={{ background: coverBg }}
          >
            {initials(workspace.name)}
          </div>
          <div className="overflow-hidden pb-1">
            <h1
              className="truncate text-2xl font-semibold tracking-tight"
              title={workspace.name}
            >
              {workspace.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {workspace.users.length} member
              {workspace.users.length === 1 ? '' : 's'} ·{' '}
              {workspace.projects.length} project
              {workspace.projects.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 pb-1">
          <div className="hidden items-center -space-x-2 sm:flex">
            {workspace.users.slice(0, 5).map((user) => (
              <Avatar
                key={user.id}
                className="h-8 w-8 ring-2 ring-background"
                title={user.name}
              >
                <AvatarImage src={user.image || ''} alt={user.name} />
                <AvatarFallback className="text-xs">
                  <UserCircle2 className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
            ))}
            {workspace.users.length > 5 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium ring-2 ring-background">
                +{workspace.users.length - 5}
              </div>
            )}
          </div>
          <Button
            variant="brand"
            size="sm"
            onClick={() => setShowShareForm(true)}
          >
            <UserPlus className="mr-1 h-4 w-4" />
            Invite
          </Button>
        </div>
      </div>
      <WorkspaceShareForm
        workspace={workspace}
        dialogOpen={showShareForm}
        setDialogOpen={setShowShareForm}
      />
    </div>
  )
}
