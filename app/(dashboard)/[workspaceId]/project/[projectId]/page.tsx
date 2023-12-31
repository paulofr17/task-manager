import { getServerSession } from 'next-auth'

import { ProjectHeader } from './_components/ProjectHeader'
import { Board } from './_components/Board'
import prisma from '@/lib/prisma'

export default async function ProjectPage({ params }: { params: { projectId: string } }) {
  const session = await getServerSession()
  const userList = await prisma.user.findMany()
  const loggedUser = userList.find((user) => user.email === session?.user?.email)

  const project = await prisma.project.findMany({
    where: {
      workspace: {
        userIds: {
          has: loggedUser?.id,
        },
      },
    },
    include: {
      users: true,
      sections: {
        include: {
          tasks: {
            include: {
              subTasks: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  })

  const selectedProject = project.find((project) => project.id === params?.projectId)

  return (
    <>
      {selectedProject && (
        <div className="mr-1 flex h-full w-[calc(100%-4px)] flex-col">
          <ProjectHeader project={selectedProject} />
          <Board board={selectedProject} />
        </div>
      )}
    </>
  )
}
