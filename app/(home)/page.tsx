import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { authOptions } from '../api/auth/[...nextauth]/route'
import { Filter } from '@/components/layout/filter'
import { HomeContent } from '@/app/(home)/homecontent'
import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import prisma from '@/lib/prisma'

export default async function RootPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)
  const activeTab = Array.isArray(searchParams.tab) ? 'Board' : searchParams.tab
  const project = await prisma.project.findMany({
    include: {
      issues: {
        include: {
          tasks: true,
        },
      },
    },
  })
  const activeProject = searchParams.project
    ? project.find((project) => project.id === searchParams.project)
    : null

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="mx-auto flex h-screen max-w-[1920px] overflow-hidden py-1 pr-1">
      <Sidebar />
      <Filter />
      <div className="flex grow flex-col">
        <Navbar />
        {activeProject ? (
          <HomeContent project={activeProject} activeTab={activeTab || 'Board'} />
        ) : (
          <p className="mx-auto mt-2 text-xl">Please select one project</p>
        )}
      </div>
    </div>
  )
}
