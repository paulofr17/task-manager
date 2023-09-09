'use client'

import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Edit2, Edit2Icon, MoreHorizontal, Save, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { mutate } from 'swr'
import { revalidatePath } from 'next/cache'

type TaskProps = {
  issueId: string
  task: {
    id: string
    description: string
    completed: boolean
  }
  setTasks: () => void
}

function handleTaskDescriptionChange(
  issueId: string,
  description: string,
  task: Task,
  setTasks: () => void,
) {
  if (task.description === '' && description !== task.description) {
    createTask(issueId, description)
  } else if (description !== task.description) {
    task.description = description
    updateTask(task)
  }
  mutate('/api/issue')
  revalidatePath('/api/issue')
  setTasks()
}

async function createTask(issueId: string, description: string) {
  const taskToCreate = {
    issueId,
    description,
  }
  await fetch('/api/task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskToCreate),
  })
  await mutate('/api/issue')
}

async function updateTask(task: Task) {
  const taskToUpdate = {
    id: task.id,
    description: task.description,
    completed: task.completed,
  }
  await fetch('/api/task', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskToUpdate),
  })
  mutate('/api/issue')
}

export function Task({ issueId, task, setTasks }: TaskProps) {
  const [description, setDescription] = useState(task.description)
  const [inputFocus, setInputFocus] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="group flex justify-between py-1 text-xs hover:rounded-md hover:bg-zinc-100/60">
      <div className="flex flex-grow items-center space-x-2">
        <Checkbox
          className="border-purple-650 text-purple-650 data-[state=checked]:bg-purple-650 data-[state=checked]:text-white"
          checked={task.completed}
          onCheckedChange={() => {
            task.completed = !task.completed
            updateTask(task)
          }}
        />
        <input
          autoFocus={description === ''}
          ref={inputRef}
          className="grow rounded-sm p-[3px] text-sm ring-offset-background focus:ring-purple-650 focus-visible:outline-none focus-visible:ring-2 group-hover:bg-zinc-100/60"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onBlur={() => {
            setInputFocus(false)
            handleTaskDescriptionChange(issueId, description, task, setTasks)
            setTasks()
          }}
          onFocus={() => setInputFocus(true)}
        ></input>
        <button
          className={`${inputFocus ? 'hidden' : 'hidden group-hover:block'}`}
          onClick={() => (inputRef.current ? inputRef.current.focus() : '')}
        >
          <Edit2 size={16} />
        </button>
        <button
          className={`${!inputFocus ? 'hidden' : 'hidden group-hover:block'}`}
        >
          <Save size={16} />
        </button>
        <button
          onClick={() => (inputRef.current ? inputRef.current.focus() : '')}
          className={`${inputFocus ? 'hidden' : 'hidden group-hover:block'} `}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
