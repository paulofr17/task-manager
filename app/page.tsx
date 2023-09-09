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
  const issues = await prisma.issue.findMany({
    include: {
      tasks: true,
    },
  })
  return (
    <div className="flex pr-4">
      <Sidebar />
      <Filter />
      <div className="flex w-full flex-col">
        <Navbar />
        <HomeContent issues={issues} activeTab={searchParams.tab} />
      </div>
    </div>
  )
}
