import { TabSelector } from './tabselector'
import { Board } from './board'
import { BoardWithColumns } from '@/models/types'

interface HomeContentProps {
  board: BoardWithColumns
  activeTab: string
}

export async function HomeContent({ board, activeTab }: HomeContentProps) {
  return (
    <div className="mx-1 mt-4 flex flex-1 flex-col overflow-hidden md:mx-2 lg:mx-3">
      <TabSelector board={board} activeTab={activeTab} />
      {activeTab === 'Overview' && <div>Overview</div>}
      {(activeTab === 'Board' || activeTab === undefined) && <Board board={board} />}
    </div>
  )
}
