'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MoreHorizontal, PlusCircleIcon } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CreateWorkspace } from '@/components/shared/CreateWorkspace'
import { useWorkspaceContext } from '@/context/WorkspaceContext'
import { deleteWorkspace } from '@/actions/DeleteWorkspace/action'
import { toast } from 'sonner'

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
        <CreateWorkspace dialogOpen={showNewWorkspace} setDialogOpen={setShowNewWorkspace} />
      )}
      <div className="mx-auto w-full max-w-[700px] px-2">
        <Card className="my-12 w-full">
          <CardHeader className="text-center">
            <div className="flex h-6 items-center justify-between">
              <CardTitle>Workspaces</CardTitle>
              <Button
                size={'sm'}
                variant={'outline'}
                className="justify-between gap-2"
                onClick={() => setShowNewWorkspace(true)}
              >
                <PlusCircleIcon className="h-4 w-4" />
                <span className="text-xs">New Workspace</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {workspaceList.map((workspace) => (
              <Link
                key={workspace.id}
                href={`/${workspace.id}/home`}
                className="-mx-2 flex h-10 items-center justify-between space-x-4 rounded-md p-2 text-primary transition-all hover:bg-accent hover:text-accent-foreground"
              >
                <p className="text-sm font-medium leading-none">{workspace.name}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 bg-transparent p-0 hover:bg-muted-foreground/30 data-[state=open]:bg-muted"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[100px]">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(event) => {
                        event.stopPropagation()
                        handleDeleteWorkspace(workspace.id)
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
