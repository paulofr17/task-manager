import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import prisma from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ProjectItem } from './_components/ProjectItem'
import { CreateProject } from './_components/CreateProject'
import { WorkspaceDashboard } from './_components/WorkspaceDashboard'
import { TasksCard } from './_components/TasksCard'
import { WorkspaceWithProjectsUsers } from '@/types/types'
import { FolderKanban } from 'lucide-react'

const greeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default async function HomePage({
  params,
}: {
  params: { workspaceId: string }
}) {
  const session = await getServerSession()
  const userList = await prisma.user.findMany()
  const loggedUser = userList.find(
    (user) => user.email === session?.user?.email,
  )

  if (!session || !loggedUser) {
    redirect('/api/auth/signin')
  }

  const workspaces: WorkspaceWithProjectsUsers[] =
    await prisma.workspace.findMany({
      where: {
        userIds: {
          has: loggedUser?.id,
        },
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
  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.id === params.workspaceId,
  )
  const projects = selectedWorkspace
    ? await prisma.project.findMany({
        where: {
          workspaceId: selectedWorkspace?.id,
          userIds: {
            has: loggedUser?.id || '',
          },
        },
      })
    : []

  if (!selectedWorkspace) {
    redirect('/')
  }

  const firstName = loggedUser?.name?.split(' ')[0] ?? ''

  return (
    <div className="flex w-full flex-col overflow-auto">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleString('en-us', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {greeting()}, {firstName}
          </h1>
          <WorkspaceDashboard workspace={selectedWorkspace} />
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {selectedWorkspace && (
            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    Projects
                  </CardTitle>
                  <CreateProject workspaceId={selectedWorkspace.id} />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                {projects.length ? (
                  projects.map((project) => (
                    <ProjectItem key={project.id} project={project} />
                  ))
                ) : (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No projects yet. Create one to get started.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
          <TasksCard workspace={selectedWorkspace} />
        </div>
      </div>
    </div>
  )
}
