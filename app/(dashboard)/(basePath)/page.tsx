'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MoreHorizontal, Plus, Users } from 'lucide-react'
import { toast } from 'sonner'

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CreateWorkspace } from '@/components/shared/CreateWorkspace'
import { useWorkspaceContext } from '@/context/WorkspaceContext'
import { deleteWorkspace } from '@/actions/Workspace/DeleteWorkspace/action'

const HUES = [210, 260, 330, 150, 30, 190, 290, 100]
const hashHue = (id: string) =>
  HUES[id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length]
const initialsOf = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'

const handleDeleteWorkspace = async (workspaceId: string) => {
  const response = await deleteWorkspace(workspaceId)
  if (response.data) {
    toast.success(`Workspace '${response.data.name}' deleted`)
  } else {
    toast.error(response.error || 'Error deleting Workspace')
  }
}

export default function DashboardPage() {
  const [showNewWorkspace, setShowNewWorkspace] = useState(false)
  const { workspaceList } = useWorkspaceContext()

  return (
    <>
      {showNewWorkspace && (
        <CreateWorkspace
          dialogOpen={showNewWorkspace}
          setDialogOpen={setShowNewWorkspace}
        />
      )}
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-16">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">Workspaces</h1>
          <p className="text-sm text-muted-foreground">
            Select a workspace to continue, or create a new one.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaceList.map((workspace) => {
            const hue = hashHue(workspace.id)
            return (
              <Card
                key={workspace.id}
                interactive
                className="group relative overflow-hidden"
              >
                <Link
                  href={`/${workspace.id}/home`}
                  className="flex flex-col gap-4 p-5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-sm font-semibold text-white shadow-soft"
                      style={{
                        backgroundImage: `linear-gradient(135deg, hsl(${hue} 75% 55%), hsl(${(hue + 30) % 360} 75% 60%))`,
                      }}
                    >
                      {initialsOf(workspace.name)}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
                          onClick={(e) => e.preventDefault()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            handleDeleteWorkspace(workspace.id)
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p
                      className="truncate text-base font-semibold"
                      title={workspace.name}
                    >
                      {workspace.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {workspace.users?.length ?? 0}
                      </span>
                      <span>•</span>
                      <span>
                        {workspace.projects?.length ?? 0}{' '}
                        {(workspace.projects?.length ?? 0) === 1
                          ? 'project'
                          : 'projects'}
                      </span>
                    </div>
                  </div>
                </Link>
              </Card>
            )
          })}
          <button
            onClick={() => setShowNewWorkspace(true)}
            className="group flex h-full min-h-[148px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-transparent p-5 text-sm font-medium text-muted-foreground transition-all hover:border-primary/50 hover:bg-accent/40 hover:text-primary"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10 group-hover:text-primary">
              <Plus className="h-5 w-5" />
            </div>
            New workspace
          </button>
        </div>
      </div>
    </>
  )
}
