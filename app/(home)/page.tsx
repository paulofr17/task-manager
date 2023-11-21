import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { authOptions } from '../api/auth/[...nextauth]/route'
import { Filter } from '@/components/layout/filter'
import { HomeContent } from '@/app/(home)/homecontent'
import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import prisma from '@/lib/prisma'
import { BoardWithColumns } from '@/models/types'

export default async function RootPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)
  const activeTab = Array.isArray(searchParams.tab) ? 'Board' : searchParams.tab
  const boards: BoardWithColumns[] = await prisma.board.findMany({
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
    },
  })

  const activeBoard = searchParams.board
    ? boards.find((board) => board.id === searchParams.board)
    : null

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="mx-auto flex h-screen max-w-[1920px] overflow-hidden pt-1">
      <Sidebar />
      <Filter />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        {activeBoard ? (
          <HomeContent board={activeBoard} activeTab={activeTab || 'Board'} />
        ) : (
          <p className="mx-auto mt-2 text-xl">Please select one project</p>
        )}
      </div>
    </div>
  )
}
