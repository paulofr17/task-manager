import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { authOptions } from './api/auth/[...nextauth]/route'
import { Filter } from '@/components/filter'
import { HomeContent } from '@/components/homecontent'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import prisma from '@/lib/prisma'

export default async function RootPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)
  const activeTab = Array.isArray(searchParams.tab) ? 'Board' : searchParams.tab
  const issues = await prisma.issue.findMany({
    include: {
      tasks: true,
    },
  })
  const project = await prisma.project.findFirst({
    include: {
      issues: {
        include: {
          tasks: true,
        },
      },
    },
  })

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="mx-auto flex h-screen max-w-[1920px] overflow-hidden py-1 pr-1">
      <Sidebar />
      <Filter />
      <div className="flex grow flex-col">
        <Navbar />
        {project ? (
          <HomeContent project={project} activeTab={activeTab || 'Board'} />
        ) : (
          <p>Loading project...</p>
        )}
      </div>
    </div>
  )
}
