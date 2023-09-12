'use client'

import {
  createTask,
  updateTask,
  deleteTask,
  revalidateHome,
} from '@/actions/serverActions'
import { Checkbox } from '@/components/ui/checkbox'
import { Edit2, Save, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'

type TaskProps = {
  issueId: string
  task: {
    id: string
    description: string
    completed: boolean
  }
  handleNotification: (message: string) => void
}

async function handleTaskDescriptionChange(
  issueId: string,
  description: string,
  task: Task,
  handleNotification: (message: string) => void,
) {
  if (task.description === '' && description !== task.description) {
    const response = await createTask(issueId, description)
    if (response.status === 'success') {
      handleNotification('Task successfully created')
    }
  } else if (description !== task.description) {
    task.description = description
    const response = await updateTask(task.id, task.description, task.completed)
    if (response.status === 'success') {
      handleNotification('Task successfully updated')
    }
  } else revalidateHome()
}

async function handleDeleteTask(
  taskId: string,
  handleNotification: (message: string) => void,
) {
  const response = await deleteTask(taskId)
  if (response.status === 'success') {
    handleNotification('Task successfully deleted')
  }
}

export function Task({ issueId, task, handleNotification }: TaskProps) {
  const [description, setDescription] = useState(task.description)
  const [inputFocus, setInputFocus] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="group flex items-center justify-between pr-1 text-xs hover:rounded-md hover:bg-zinc-100/60">
      <div className="flex w-full items-center space-x-2">
        <Checkbox
          className="border-purple-650 text-purple-650 data-[state=checked]:bg-purple-650 data-[state=checked]:text-white"
          checked={task.completed}
          onCheckedChange={() => {
            task.completed = !task.completed
            updateTask(task.id, task.description, task.completed)
            handleNotification('Task successfully updated')
          }}
        />
        <input
          autoFocus={description === ''}
          ref={inputRef}
          className="w-full rounded-sm p-1 text-sm ring-offset-background focus:ring-purple-650 focus-visible:outline-none focus-visible:ring-2 group-hover:bg-zinc-100/60"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onBlur={() => {
            setInputFocus(false)
            handleTaskDescriptionChange(
              issueId,
              description,
              task,
              handleNotification,
            )
          }}
          onFocus={() => setInputFocus(true)}
        ></input>
        <button
          className={`${inputFocus ? 'hidden' : 'hidden group-hover:block'}`}
          onClick={() => (inputRef.current ? inputRef.current.focus() : '')}
        >
          <Edit2 size={18} />
        </button>
        <button
          className={`${!inputFocus ? 'hidden' : 'hidden group-hover:block'}`}
        >
          <Save size={18} />
        </button>
        <button
          onClick={() => handleDeleteTask(task.id, handleNotification)}
          className={`${inputFocus ? 'hidden' : 'hidden group-hover:block'} `}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
