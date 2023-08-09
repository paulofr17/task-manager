import { NavBar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'

export default function RootPage() {
  return (
    <div className="flex">
      <Sidebar />
      <NavBar />
    </div>
  )
}
