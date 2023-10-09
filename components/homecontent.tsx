import { TabSelector } from './tabselector'
import { Board } from './board'

interface HomeContentProps {
  project: Project
  activeTab: string
}

export async function HomeContent({ project, activeTab }: HomeContentProps) {
  return (
    <div className="ml-1 mt-4 flex h-full flex-col md:ml-2 lg:ml-4">
      <TabSelector project={project} activeTab={activeTab} />
      {activeTab === 'Overview' && <div>Overview</div>}
      {(activeTab === 'Board' || activeTab === undefined) && <Board project={project} />}
    </div>
  )
}
