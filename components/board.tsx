import { MoreHorizontal, Plus } from 'lucide-react'
import { BoardCard } from './boardcard'

export function Board() {
  const types = ['To Do', 'In Progress', 'In Review', 'Done']
  return (
    <div className="ml-4 mt-4 grid grid-cols-4 gap-4">
      {types.map((type) => (
        <div
          className="flex flex-col gap-2 rounded-lg bg-zinc-100 px-2 py-2"
          key={type}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs text-zinc-500">
              <span className="pl-2 text-base font-medium text-black">
                {type}
              </span>
              <span className="rounded-xl bg-zinc-500 px-1 text-xs font-bold text-white">
                7
              </span>
            </div>
            <div className="flex space-x-1 text-xs text-zinc-500">
              <button>
                <Plus size={18} />
              </button>
              <button className="text-xl">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
          <BoardCard
            priority="Medium"
            task="[New Feature] Delete all Member"
            progress="0/6"
            time="14d"
          />
          <BoardCard
            priority="High"
            task="[New Feature] Delete all Member"
            progress="0/6"
            time="14d"
          />
          <BoardCard
            priority="Low"
            task="[New Feature] Delete all Member"
            progress="0/6"
            time="14d"
          />
        </div>
      ))}
    </div>
  )
}
