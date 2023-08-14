import { Clock, ListChecks } from 'lucide-react'

interface BoardCardProps {
  priority: string
  task: string
  progress: string
  time: string
}

export function BoardCard({ priority, task, progress, time }: BoardCardProps) {
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
    <div className="flex flex-col space-y-4 rounded-lg border border-zinc-300 bg-white p-3">
      <div
        className={`${priorityColor()} h-5 w-14 items-center rounded-sm border text-center text-xs`}
      >
        {priority}
      </div>
      <span>{task}</span>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 rounded-md border border-zinc-400 p-1 text-xs text-zinc-700">
          <ListChecks size={15} />
          <span>{progress}</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-zinc-700">
          <Clock size={14} />
          <span>{time}</span>
        </div>
      </div>
    </div>
  )
}
