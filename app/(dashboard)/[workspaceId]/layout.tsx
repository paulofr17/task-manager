import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { AppLayout } from '@/components/layout/AppLayout'
import { WorkspaceWithProjectsUsers } from '@/types/types'
import prisma from '@/lib/prisma'
import { User } from '@prisma/client'

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { workspaceId: string }
}) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    redirect('/signin')
  }

  const userList: User[] = await prisma.user.findMany()

  const workspaceList: WorkspaceWithProjectsUsers[] = await prisma.workspace.findMany({
    where: {
      users: {
        some: {
          email: session.user.email,
        },
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

  const currentWorkspace =
    workspaceList.find((workspace) => workspace.id === params.workspaceId) || null

  return (
    <AppLayout
      currentWorkspace={currentWorkspace}
      workspaceList={workspaceList}
      userList={userList}
    >
      {children}
    </AppLayout>
  )
}
