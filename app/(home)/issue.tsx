'use client'

import { Clock, ListChecks } from 'lucide-react'
import { IssueMenu } from './issuemenu'
import { useState } from 'react'
import { TaskList } from './taskList'
import { Draggable } from 'react-beautiful-dnd'
import { IssueWithTasks } from '@/models/types'

interface IssueProps {
  issue: IssueWithTasks
  index: number
}

export function Issue({ issue, index }: IssueProps) {
  const [taskMenuOpen, setTaskMenuOpen] = useState(false)
  const numberOfTasks = issue.tasks.length
  const completedTaks = issue.tasks.filter((task) => task.completed).length
  const priorityColor = () => {
    switch (issue.priority) {
      case 'High':
        return 'border-red-300 bg-red-300/10 text-red-600'
      case 'Medium':
        return 'border-yellow-500 bg-yellow-300/10 text-yellow-700'
      case 'Low':
        return 'border-emerald-300 bg-emerald-300/10 text-green-700'
      default:
        return 'border-blue-300 bg-blue-300/10 text-blue-700'
    }
  }
  return (
    <Draggable key={issue.id} draggableId={issue.id} index={index}>
      {(provided) => (
        <div
          className="flex flex-col justify-stretch space-y-4 rounded-lg border border-zinc-300 bg-white p-3"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex items-center justify-between">
            <div
              className={`${priorityColor()} h-5 w-14 items-center rounded-sm border text-center text-xs`}
            >
              {issue.priority}
            </div>
            <IssueMenu issueId={issue.id} />
          </div>
          <p className="break-all text-xs lg:text-sm">{issue.description}</p>
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
              <span>{issue.duration}</span>
            </div>
          </div>
          {taskMenuOpen && <TaskList issueId={issue.id} taskList={issue.tasks} />}
        </div>
      )}
    </Draggable>
  )
}
