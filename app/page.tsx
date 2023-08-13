import { Filter } from '@/components/filter'
import { HomeContent } from '@/components/homecontent'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'

export default function RootPage() {
  return (
    <div className="flex pr-4">
      <Sidebar />
      <Filter />
      <div className="flex w-full flex-col">
        <Navbar />
        <HomeContent />
      </div>
    </div>
  )
}
