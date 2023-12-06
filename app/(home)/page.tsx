import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { authOptions } from '../api/auth/[...nextauth]/route'
import { Filter } from '@/components/layout/filter'
import { HomeContent } from '@/app/(home)/homecontent'
import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import prisma from '@/lib/prisma'
import { ProjectWithBoards } from '@/models/types'

export default async function RootPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)
  const userList = await prisma.user.findMany()
  const loggedUser = userList.find((user) => user.email === session?.user?.email)
  const activeTab = Array.isArray(searchParams.tab) ? 'Board' : searchParams.tab
  const projects: ProjectWithBoards[] = await prisma.project.findMany({
    where: {
      OR: [
        {
          id: {
            in: loggedUser?.projectIds || [],
          },
        },
        {
          boards: {
            some: {
              id: {
                in: loggedUser?.boardIds || [],
              },
            },
          },
        },
      ],
    },
    include: {
      boards: {
        where: {
          OR: [
            {
              project: {
                userIds: {
                  has: loggedUser?.id || '',
                },
              },
            },
            {
              id: {
                in: loggedUser?.boardIds || [],
              },
            },
          ],
        },
        include: {
          columns: {
            orderBy: {
              order: 'asc',
            },
            include: {
              issues: {
                orderBy: {
                  order: 'asc',
                },
                include: {
                  tasks: true,
                },
              },
            },
          },
          users: true,
        },
      },
    },
  })

  const activeProject = searchParams.project
    ? projects.find((project) => project.id === searchParams.project)
    : null

  const activeBoard = searchParams.board
    ? activeProject?.boards.find((board) => board.id === searchParams.board)
    : null

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="mx-auto flex h-screen max-w-[1920px] overflow-hidden pt-1">
      <Sidebar />
      <Filter projects={projects} activeProject={activeProject} userList={userList} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        {activeBoard ? (
          <HomeContent board={activeBoard} activeTab={activeTab || 'Board'} userList={userList} />
        ) : (
          <p className="mx-auto mt-60 text-xl">Waiting for Board selection ...</p>
        )}
      </div>
    </div>
  )
}
