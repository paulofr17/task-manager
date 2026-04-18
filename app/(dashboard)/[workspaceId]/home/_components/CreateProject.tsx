'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'

import { CreateProjectForm } from '@/components/shared/CreateProjectForm'
import { Button } from '@/components/ui/button'

export function CreateProject({ workspaceId }: { workspaceId: string }) {
  const [showCreateProject, setShowCreateProject] = useState(false)
  return (
    <>
      <Button
        size="sm"
        variant="soft"
        onClick={() => setShowCreateProject(true)}
      >
        <Plus className="h-4 w-4" />
        New project
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
