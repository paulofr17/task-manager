'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

import {
  ProjectWithSections,
  SectionWithTasks,
  TasksWithSubTasks,
  WorkspaceWithProjectsUsers,
} from '@/types/types'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface TasksCardProps {
  workspace: WorkspaceWithProjectsUsers
}

interface Task extends TasksWithSubTasks {
  project: string
}

const getTaskStatus = (task: TasksWithSubTasks) => {
  if (!task.dueDate) return 'Upcoming'
  const today = new Date()
  const dueDate = new Date(task.dueDate)
  if (dueDate < today) return 'Overdue'
  return 'Upcoming'
}

const getTasksByStatus = (workspace: WorkspaceWithProjectsUsers, status: string): Task[] => {
  return workspace.projects.reduce((acc: Task[], project: ProjectWithSections) => {
    return acc.concat(
      project.sections.reduce((accSection: Task[], section: SectionWithTasks) => {
        let filteredTasks: TasksWithSubTasks[] = []
        // Upcoming tasks
        if (status === 'Upcoming') {
          filteredTasks = section.tasks.filter(
            (task: TasksWithSubTasks) => !task.completed && getTaskStatus(task) === 'Upcoming',
          )
        }
        // Overdue tasks
        else if (status === 'Overdue') {
          filteredTasks = section.tasks.filter(
            (task: TasksWithSubTasks) => !task.completed && getTaskStatus(task) === 'Overdue',
          )
        }
        // Completed tasks
        else if (status === 'Completed') {
          filteredTasks = section.tasks.filter((task: TasksWithSubTasks) => task.completed)
        }
        const tasksWithProjects: Task[] = filteredTasks.map((task) => ({
          ...task,
          project: project.name,
        }))
        return accSection.concat(tasksWithProjects)
      }, []),
    )
  }, [])
}

export function TasksCard({ workspace }: TasksCardProps) {
  const [selectedTab, setSelectedTab] = useState<'Upcoming' | 'Overdue' | 'Completed'>('Upcoming')
  const tabOptions = ['Upcoming', 'Overdue', 'Completed']
  const tasks: Task[] = getTasksByStatus(workspace, selectedTab)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col px-6 pb-3 pt-6">
        <CardTitle>My Tasks</CardTitle>
        <div className="flex gap-2 border-b pt-1 ">
          {tabOptions.map((tab) => (
            <Button
              key={tab}
              variant={'ghost'}
              size={'sm'}
              className={cn(
                'rounded-none border-muted-foreground text-sm font-medium hover:border-b-2 hover:bg-transparent hover:text-primary',
                selectedTab === tab ? 'border-b-2 text-primary' : 'text-muted-foreground',
              )}
              onClick={() => setSelectedTab(tab as 'Upcoming' | 'Overdue' | 'Completed')}
            >
              {tab}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {tasks.map((task) => (
            <>
              <Separator key={task.id} className="my-1 bg-border/50" />
              <Button variant={'ghost'} size={'sm'} className="w-full justify-start gap-1 text-xs">
                <span className="truncate" title={task.description}>
                  {task.description}
                </span>
                <Badge variant={'default'} className="ml-auto h-6 w-40">
                  <span className="truncate" title={task.project}>
                    {task.project}
                  </span>
                </Badge>
                <span className="w-9 truncate text-[10px] text-muted-foreground">
                  {task.dueDate &&
                    new Date(task.dueDate).toLocaleString('en-us', {
                      month: 'short',
                      day: 'numeric',
                    })}
                </span>
              </Button>
            </>
          ))}
          <Separator className="my-1 bg-border/50" />
        </div>
      </CardContent>
    </Card>
  )
}
