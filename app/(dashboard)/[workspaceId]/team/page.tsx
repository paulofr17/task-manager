import { redirect } from 'next/navigation'

import prisma from '@/lib/prisma'
import { Separator } from '@/components/ui/separator'
import { WorkspaceHeader } from './_components/WorkspaceHeader'
import { ProjectsCard } from './_components/ProjectsCard'
import { MembersCard } from './_components/MembersCard'
import { WorkspaceWithProjectsUsers } from '@/types/types'

export default async function TeamPage({ params }: { params: { workspaceId: string } }) {
  const workspace: WorkspaceWithProjectsUsers | null = await prisma.workspace.findUnique({
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
    <div className="mr-1 flex flex-col justify-center">
      <WorkspaceHeader workspace={workspace} />
      <Separator className="mr-1" />
      <div className="mx-auto flex w-full max-w-[800px] flex-col">
        <MembersCard workspace={workspace} />
        <ProjectsCard workspaceId={workspace.id} projects={workspace.projects} />
      </div>
    </div>
  )
}
