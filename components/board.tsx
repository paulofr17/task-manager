'use client'

import { MoreHorizontal, Plus } from 'lucide-react'
import { BoardCard } from './boardcard'

interface BoardProps {
  issues: Issue[]
}

export function Board({ issues }: BoardProps) {
  const issueStatus = ['To Do', 'In Progress', 'In Review', 'Done']
  return (
    <div>
      <div className="ml-4 mt-4 grid grid-cols-4 justify-start gap-4">
        {issueStatus.map((status) => (
          <div
            className="mb-auto flex flex-col gap-2 rounded-lg bg-zinc-100 px-2 py-2"
            key={status}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs text-zinc-500">
                <span className="pl-2 text-base font-medium text-black">
                  {status}
                </span>
                <div className="flex h-5 w-5 rounded-full bg-zinc-500 text-xs font-bold text-white">
                  <p className="m-auto">
                    {issues.filter((issue) => issue.status === status).length}
                  </p>
                </div>
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
            {issues
              .filter((issue) => issue.status === status)
              .map((issue) => (
                <BoardCard
                  key={issue.description}
                  id={issue.id}
                  priority={issue.priority}
                  description={issue.description}
                  duration={issue.duration}
                  tasks={issue.tasks}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
