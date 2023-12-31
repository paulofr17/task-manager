'use client'

import { useState } from 'react'
import { Users, UserCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { WorkspaceShareForm } from '@/components/shared/WorkspaceShareForm'
import { WorkspaceWithProjectsUsers } from '@/types/types'

interface MembersCardProps {
  workspace: WorkspaceWithProjectsUsers
}

export function MembersCard({ workspace }: MembersCardProps) {
  const [showShareForm, setShowShareForm] = useState(false)
  return (
    <Card className="mx-4 mt-4">
      <CardHeader>
        <div className="flex h-6 items-center justify-between">
          <CardTitle className="text-xl">{`Members (${workspace.users.length})`}</CardTitle>
          <Button
            size={'sm'}
            variant={'outline'}
            className="flex h-8 w-24 gap-2"
            onClick={() => setShowShareForm(true)}
          >
            <Users size={18} className="" />
            Share
          </Button>
        </div>
        <WorkspaceShareForm
          workspace={workspace}
          dialogOpen={showShareForm}
          setDialogOpen={setShowShareForm}
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 justify-center gap-y-4 px-2 sm:grid-cols-3">
          {workspace.users.map((member) => (
            <div key={member.id} className="flex items-center gap-2 text-center">
              <Avatar title={member.name} className="h-8 w-8">
                <AvatarImage src={member.image || ''} className="rounded-full" />
                <AvatarFallback>
                  <UserCircle2 className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <p className="truncate text-xs font-medium" title={member.name}>
                {member.name}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
