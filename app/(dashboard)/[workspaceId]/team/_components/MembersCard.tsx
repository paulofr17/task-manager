'use client'

import { useState } from 'react'
import { UserPlus, UserCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { WorkspaceShareForm } from '@/components/shared/WorkspaceShareForm'
import { WorkspaceWithProjectsUsers } from '@/types/types'

interface MembersCardProps {
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

export function MembersCard({ workspace }: MembersCardProps) {
  const [showShareForm, setShowShareForm] = useState(false)
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg">Members</CardTitle>
          <p className="text-xs text-muted-foreground">
            {workspace.users.length}{' '}
            {workspace.users.length === 1 ? 'person' : 'people'} in this
            workspace
          </p>
        </div>
        <Button size="sm" variant="soft" onClick={() => setShowShareForm(true)}>
          <UserPlus className="mr-1 h-4 w-4" />
          Invite
        </Button>
        <WorkspaceShareForm
          workspace={workspace}
          dialogOpen={showShareForm}
          setDialogOpen={setShowShareForm}
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {workspace.users.map((member) => {
            const hue = hueFromId(member.id)
            return (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/40"
              >
                <Avatar title={member.name} className="h-10 w-10 shrink-0">
                  <AvatarImage src={member.image || ''} />
                  <AvatarFallback
                    className="text-sm font-semibold text-white"
                    style={{ background: `hsl(${hue} 70% 50%)` }}
                  >
                    {member.name ? (
                      initials(member.name)
                    ) : (
                      <UserCircle2 className="h-6 w-6" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-medium"
                    title={member.name}
                  >
                    {member.name}
                  </p>
                  <p
                    className="truncate text-xs text-muted-foreground"
                    title={member.email}
                  >
                    {member.email}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
