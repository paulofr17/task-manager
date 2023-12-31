'use client'

import { ChevronRight, PlusCircle, Users } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WorkspaceShareForm } from '@/components/shared/WorkspaceShareForm'
import { CreateProjectForm } from '@/components/shared/CreateProjectForm'
import { WorkspaceWithProjectsUsers } from '@/types/types'

interface TeamMenuProps {
  workspace: WorkspaceWithProjectsUsers
}

export function TeamMenu({ workspace }: TeamMenuProps) {
  const [open, setOpen] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showInviteMembers, setShowInviteMembers] = useState(false)
  return (
    <>
      {showCreateProject && (
        <CreateProjectForm
          workspaceId={workspace.id}
          dialogOpen={showCreateProject}
          setDialogOpen={setShowCreateProject}
        />
      )}
      {showInviteMembers && (
        <WorkspaceShareForm
          workspace={workspace}
          dialogOpen={showInviteMembers}
          setDialogOpen={setShowInviteMembers}
        />
      )}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={'icon'} className="h-5 w-5 hover:bg-muted-foreground/30">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52">
          <DropdownMenuLabel className="" title={workspace.name}>
            {workspace.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                setOpen(false)
                setShowCreateProject(true)
              }}
            >
              <PlusCircle size={18} className="" />
              Create Project
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                setOpen(false)
                setShowInviteMembers(true)
              }}
            >
              <Users size={18} className="" />
              Invite Members
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
