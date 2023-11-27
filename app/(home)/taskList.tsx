'use client'

import { Plus } from 'lucide-react'
import { Task } from './task'
import { useEffect, useState } from 'react'
import { Task as TaskType } from '@prisma/client'
import { toaster } from '@/lib/toaster'

type taskMenuProps = {
  issueId: string
  taskList: TaskType[]
}

const handleNotification = (status: string, message: string) => {
  if (status === 'success') toaster('success', message)
  else if (status === 'error') toaster('error', message)
}

export function TaskList({ issueId, taskList }: taskMenuProps) {
  const [tasks, setTasks] = useState(taskList)
  useEffect(() => {
    setTasks(taskList)
  }, [taskList])

  return (
    <div className="flex flex-col space-y-1">
      <button
        className=" p flex w-fit items-center space-x-1 rounded-md border border-purple-650 bg-white p-1 text-xs text-purple-650 hover:bg-purple-300/20"
        onClick={() =>
          setTasks((prev) => [...prev, { id: '', issueId, description: '', completed: false }])
        }
      >
        <Plus size={15} />
        Add Task
      </button>
      {tasks.map((task) => (
        <Task key={task.id} issueId={issueId} task={task} handleNotification={handleNotification} />
      ))}
    </div>
  )
}
