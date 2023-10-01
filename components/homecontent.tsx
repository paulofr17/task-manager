import { TabSelector } from './tabselector'
import { Board } from './board'

interface HomeContentProps {
  issues: Issue[]
  activeTab: string
}

export async function HomeContent({ issues, activeTab }: HomeContentProps) {
  return (
    <div className="ml-1 mt-4 sm:ml-2 md:ml-4">
      <TabSelector activeTab={activeTab} />
      {activeTab === 'Overview' && <div>Overview</div>}
      {(activeTab === 'Board' || activeTab === undefined) && (
        <Board issues={issues} />
      )}
    </div>
  )
}
