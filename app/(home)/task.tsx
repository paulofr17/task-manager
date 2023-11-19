'use client'

import { createTask, updateTask, deleteTask, revalidateRoute } from '@/actions/task'
import { Checkbox } from '@/components/ui/checkbox'
import { Task } from '@prisma/client'
import { Edit2, Save, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { useRef, useState } from 'react'

type TaskProps = {
  issueId: string
  task: Task
  handleNotification: (status: string, message: string) => void
}

async function handleTaskDescriptionChange(
  issueId: string,
  description: string,
  task: Task,
  handleNotification: (status: string, message: string) => void,
) {
  if (task.description === '' && description !== task.description) {
    const response = await createTask(issueId, description)
    if (response.status === 'success') {
      handleNotification('success', 'Task successfully created')
    }
  } else if (description !== task.description) {
    task.description = description
    const response = await updateTask(task.id, task.description, undefined)
    if (response.status === 'success') handleNotification('success', 'Task successfully updated')
    else handleNotification('error', 'This task has already been deleted')
  } else revalidateRoute('/')
}

async function handleUpdateTaskCheckbox(
  task: Task,
  handleNotification: (status: string, message: string) => void,
) {
  task.completed = !task.completed
  const response = await updateTask(task.id, undefined, task.completed)
  if (response.status === 'success') handleNotification('success', 'Task successfully updated')
  else handleNotification('error', 'This task has already been deleted')
}

async function handleDeleteTask(
  taskId: string,
  handleNotification: (status: string, message: string) => void,
) {
  const response = await deleteTask(taskId)
  if (response.status === 'success') {
    handleNotification('success', 'Task successfully deleted')
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
          onCheckedChange={() => handleUpdateTaskCheckbox(task, handleNotification)}
        />
        <input
          autoFocus={description === ''}
          ref={inputRef}
          className="w-full rounded-sm p-1 text-sm ring-offset-background focus:ring-purple-650 focus-visible:outline-none focus-visible:ring-2 group-hover:bg-zinc-100/60"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onBlur={() => {
            setInputFocus(false)
            handleTaskDescriptionChange(issueId, description, task, handleNotification)
          }}
          onFocus={() => setInputFocus(true)}
        ></input>
        <button
          className={`${inputFocus ? 'hidden' : 'hidden group-hover:block'}`}
          onClick={() => (inputRef.current ? inputRef.current.focus() : '')}
        >
          <Edit2 size={18} />
        </button>
        <button className={`${!inputFocus ? 'hidden' : 'hidden group-hover:block'}`}>
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
