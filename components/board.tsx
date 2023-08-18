import { MoreHorizontal, Plus } from 'lucide-react'
import { BoardCard } from './boardcard'

interface Task {
  description: string
  priority: string
  completedSteps: number
  numberOfSteps: number
  time: string
}

interface TaskList {
  status: string
  tasks: Task[]
}

export function Board() {
  const taskList: TaskList[] = [
    {
      status: 'To Do',
      tasks: [
        {
          description: '[New Feature] Delete all Member',
          priority: 'High',
          completedSteps: 0,
          numberOfSteps: 6,
          time: '14d',
        },
        {
          description: 'Home page for Ask Friends app',
          priority: 'Medium',
          completedSteps: 0,
          numberOfSteps: 12,
          time: '6d',
        },
      ],
    },
    {
      status: 'In Progress',
      tasks: [
        {
          description: 'Create a site map on Figma',
          priority: 'Low',
          completedSteps: 9,
          numberOfSteps: 10,
          time: '4h',
        },
      ],
    },
    {
      status: 'In Review',
      tasks: [
        {
          description: 'Changes all thumbs on figma files',
          priority: 'High',
          completedSteps: 18,
          numberOfSteps: 18,
          time: '4h',
        },
      ],
    },
    {
      status: 'Done',
      tasks: [],
    },
  ]
  return (
    <div className="ml-4 mt-4 grid grid-cols-4 justify-start gap-4">
      {taskList.map((tasksByStatus) => (
        <div
          className="mb-auto flex flex-col gap-2 rounded-lg bg-zinc-100 px-2 py-2"
          key={tasksByStatus.status}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs text-zinc-500">
              <span className="pl-2 text-base font-medium text-black">
                {tasksByStatus.status}
              </span>
              <div className="flex h-5 w-5 rounded-full bg-zinc-500 text-xs font-bold text-white">
                <p className="m-auto">{tasksByStatus.tasks.length}</p>
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
          {tasksByStatus.tasks.map((task) => (
            <BoardCard
              key={task.description}
              priority={task.priority}
              description={task.description}
              completedSteps={task.completedSteps}
              numberOfSteps={task.numberOfSteps}
              time={task.time}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
