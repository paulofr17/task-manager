'use client'

import { CreateProjectForm } from '@/components/shared/CreateProjectForm'
import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import { useState } from 'react'

export function CreateProject({ workspaceId }: { workspaceId: string }) {
  const [showCreateProject, setShowCreateProject] = useState(false)
  return (
    <>
      <Button
        size={'sm'}
        variant={'outline'}
        className="flex justify-between gap-1"
        onClick={() => setShowCreateProject(true)}
      >
        <PlusCircleIcon className="h-4 w-4" />
        <span className="text-xs">New Project</span>
      </Button>
      {showCreateProject && (
        <CreateProjectForm
          workspaceId={workspaceId}
          dialogOpen={showCreateProject}
          setDialogOpen={setShowCreateProject}
        />
      )}
    </>
  )
}
