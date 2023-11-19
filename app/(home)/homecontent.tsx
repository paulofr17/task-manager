import { TabSelector } from './tabselector'
import { Board } from './board'
import { BoardWithColumns } from '@/models/types'

interface HomeContentProps {
  board: BoardWithColumns
  activeTab: string
}

export async function HomeContent({ board, activeTab }: HomeContentProps) {
  return (
    <div className="ml-1 mt-4 flex h-full flex-col md:ml-2 lg:ml-4">
      <TabSelector board={board} activeTab={activeTab} />
      {activeTab === 'Overview' && <div>Overview</div>}
      {(activeTab === 'Board' || activeTab === undefined) && <Board board={board} />}
    </div>
  )
}
