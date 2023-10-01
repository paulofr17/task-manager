'use client'

import { Clock, ListChecks } from 'lucide-react'
import BoardCardMenu from './boardcardmenu'
import { useState } from 'react'
import { TaskList } from './taskList'

interface BoardCardProps {
  id: string
  priority: string
  description: string
  duration: string
  tasks: Task[]
}

export function BoardCard({
  id,
  priority,
  description,
  duration,
  tasks,
}: BoardCardProps) {
  const [taskMenuOpen, setTaskMenuOpen] = useState(false)
  const numberOfTasks = tasks.length
  const completedTaks = tasks.filter((task) => task.completed).length
  const priorityColor = () => {
    switch (priority) {
      case 'High':
        return 'border-purple-300 bg-purple-300/10 text-purple-650'
      case 'Medium':
        return 'border-emerald-300 bg-emerald-300/10 text-green-700'
      case 'Low':
        return 'border-yellow-500 bg-yellow-300/10 text-yellow-700'
      default:
        return 'border-blue-300 bg-blue-300/10 text-blue-700'
    }
  }
  return (
    <div className="flex flex-col justify-stretch space-y-4 rounded-lg border border-zinc-300 bg-white p-3">
      <div className="flex items-center justify-between">
        <div
          className={`${priorityColor()} h-5 w-14 items-center rounded-sm border text-center text-xs`}
        >
          {priority}
        </div>
        <BoardCardMenu issueId={id} />
      </div>
      <p className="break-all text-xs lg:text-base">{description}</p>
      <div className="flex items-center justify-between">
        <button
          className={`flex items-center space-x-1 rounded-md border p-1 text-xs ${
            completedTaks === numberOfTasks
              ? 'border-green-400 bg-green-300/10 text-green-600 hover:border-green-600 hover:bg-green-300/30'
              : 'border-zinc-400 bg-white text-zinc-700 hover:border-zinc-700 hover:bg-zinc-300/30'
          }`}
          onClick={() => setTaskMenuOpen(!taskMenuOpen)}
        >
          <ListChecks size={15} />
          <span>
            {completedTaks}/{numberOfTasks}
          </span>
        </button>
        <div className="flex items-center space-x-1 text-xs text-zinc-700">
          <Clock size={14} />
          <span>{duration}</span>
        </div>
      </div>
      {taskMenuOpen && <TaskList issueId={id} taskList={tasks} />}
    </div>
  )
}
