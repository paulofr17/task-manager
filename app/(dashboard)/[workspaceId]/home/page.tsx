import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import prisma from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ProjectItem } from './_components/ProjectItem'
import { CreateProject } from './_components/CreateProject'
import { WorkspaceDashboard } from './_components/WorkspaceDashboard'
import { TasksCard } from './_components/TasksCard'
import { WorkspaceWithProjectsUsers } from '@/types/types'

export default async function HomePage({ params }: { params: { workspaceId: string } }) {
  const session = await getServerSession()
  const userList = await prisma.user.findMany()
  const loggedUser = userList.find((user) => user.email === session?.user?.email)

  if (!session || !loggedUser) {
    redirect('/api/auth/signin')
  }

  const workspaces: WorkspaceWithProjectsUsers[] = await prisma.workspace.findMany({
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
  const selectedWorkspace = workspaces.find((workspace) => workspace.id === params.workspaceId)
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

  return (
    <div className="flex w-full max-w-[1920px] flex-col gap-4 pt-6">
      <div className="mb-6 flex flex-col px-1 text-center text-primary">
        <p className="text-base font-medium">
          {new Date().toLocaleString('en-us', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <p className="mt-1 text-3xl">Hello, {loggedUser?.name}</p>
        <WorkspaceDashboard workspace={selectedWorkspace} />
      </div>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 justify-center gap-2 px-2 md:grid-cols-2">
        {selectedWorkspace && (
          <Card className="w-full">
            <CardHeader>
              <div className="flex h-6 items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <CreateProject workspaceId={selectedWorkspace.id} />
              </div>
            </CardHeader>
            <CardContent>
              {projects.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}
            </CardContent>
          </Card>
        )}
        <TasksCard workspace={selectedWorkspace} />
      </div>
    </div>
  )
}
