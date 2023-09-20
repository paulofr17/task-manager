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
  console.log('Session', JSON.stringify(session, null, 2))

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="flex pr-4">
      <Sidebar />
      <Filter />
      <div className="flex w-full flex-col">
        <Navbar />
        <HomeContent issues={issues} activeTab={activeTab || 'Board'} />
      </div>
    </div>
  )
}
