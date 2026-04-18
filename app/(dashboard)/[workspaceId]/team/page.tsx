import { redirect } from 'next/navigation'

import prisma from '@/lib/prisma'
import { WorkspaceHeader } from './_components/WorkspaceHeader'
import { ProjectsCard } from './_components/ProjectsCard'
import { MembersCard } from './_components/MembersCard'
import { WorkspaceWithProjectsUsers } from '@/types/types'

export default async function TeamPage({
  params,
}: {
  params: { workspaceId: string }
}) {
  const workspace: WorkspaceWithProjectsUsers | null =
    await prisma.workspace.findUnique({
      where: {
        id: params.workspaceId,
      },
      include: {
        users: true,
        projects: {
          include: {
            users: true,
            sections: {
              include: {
                tasks: {
                  include: {
                    subTasks: true,
                  },
                },
              },
            },
          },
        },
      },
    })

  if (!workspace) {
    redirect('/')
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <WorkspaceHeader workspace={workspace} />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 pb-8">
        <MembersCard workspace={workspace} />
        <ProjectsCard
          workspaceId={workspace.id}
          projects={workspace.projects}
        />
      </div>
    </div>
  )
}
