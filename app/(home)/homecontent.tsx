import { TabSelector } from './tabselector'
import { Board } from './board'
import { BoardWithColumns } from '@/models/types'
import { BoardInfo } from './boardInfo'
import { User } from '@prisma/client'

interface HomeContentProps {
  board: BoardWithColumns
  activeTab: string
  userList: User[]
}

export async function HomeContent({ board, activeTab, userList }: HomeContentProps) {
  return (
    <div className="mx-1 mt-4 flex flex-1 flex-col overflow-hidden md:mx-2 lg:mx-3">
      <BoardInfo board={board} userList={userList} />
      <TabSelector board={board} activeTab={activeTab} />
      {activeTab === 'Overview' && <div>Overview</div>}
      {(activeTab === 'Board' || activeTab === undefined) && <Board board={board} />}
    </div>
  )
}
