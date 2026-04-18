'use client'

import { useState } from 'react'
import { CheckSquare } from 'lucide-react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

import {
  ProjectWithSections,
  SectionWithTasks,
  TasksWithSubTasks,
  WorkspaceWithProjectsUsers,
} from '@/types/types'
import { cn } from '@/lib/utils'

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

const getTasksByStatus = (
  workspace: WorkspaceWithProjectsUsers,
  status: string,
): Task[] => {
  return workspace.projects.reduce(
    (acc: Task[], project: ProjectWithSections) => {
      return acc.concat(
        project.sections.reduce(
          (accSection: Task[], section: SectionWithTasks) => {
            let filteredTasks: TasksWithSubTasks[] = []
            if (status === 'Upcoming') {
              filteredTasks = section.tasks.filter(
                (task: TasksWithSubTasks) =>
                  !task.completed && getTaskStatus(task) === 'Upcoming',
              )
            } else if (status === 'Overdue') {
              filteredTasks = section.tasks.filter(
                (task: TasksWithSubTasks) =>
                  !task.completed && getTaskStatus(task) === 'Overdue',
              )
            } else if (status === 'Completed') {
              filteredTasks = section.tasks.filter(
                (task: TasksWithSubTasks) => task.completed,
              )
            }
            const tasksWithProjects: Task[] = filteredTasks.map((task) => ({
              ...task,
              project: project.name,
            }))
            return accSection.concat(tasksWithProjects)
          },
          [],
        ),
      )
    },
    [],
  )
}

type TabKey = 'Upcoming' | 'Overdue' | 'Completed'

export function TasksCard({ workspace }: TasksCardProps) {
  const [selectedTab, setSelectedTab] = useState<TabKey>('Upcoming')
  const tabOptions: TabKey[] = ['Upcoming', 'Overdue', 'Completed']
  const tasks: Task[] = getTasksByStatus(workspace, selectedTab)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-3 px-6 pb-0 pt-6">
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
          My Tasks
        </CardTitle>
        <div className="flex gap-1 border-b">
          {tabOptions.map((tab) => {
            const active = selectedTab === tab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedTab(tab)}
                className={cn(
                  'relative -mb-px px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        {tasks.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No {selectedTab.toLowerCase()} tasks.
          </p>
        ) : (
          <ul className="flex flex-col divide-y">
            {tasks.map((task) => {
              const isOverdue =
                task.dueDate &&
                new Date(task.dueDate) < new Date() &&
                !task.completed
              return (
                <li
                  key={task.id}
                  className="flex items-center gap-3 py-2.5 text-sm"
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 shrink-0 rounded-full',
                      task.completed
                        ? 'bg-status-done'
                        : isOverdue
                          ? 'bg-status-blocked'
                          : 'bg-status-progress',
                    )}
                  />
                  <span
                    className="truncate font-medium"
                    title={task.description}
                  >
                    {task.description}
                  </span>
                  <span
                    className="ml-auto max-w-[180px] shrink-0 truncate rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
                    title={task.project}
                  >
                    {task.project}
                  </span>
                  <span
                    className={cn(
                      'w-14 shrink-0 text-right text-xs',
                      isOverdue
                        ? 'text-status-blocked'
                        : 'text-muted-foreground',
                    )}
                  >
                    {task.dueDate &&
                      new Date(task.dueDate).toLocaleString('en-us', {
                        month: 'short',
                        day: 'numeric',
                      })}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
