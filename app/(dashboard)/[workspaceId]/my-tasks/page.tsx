import { getServerSession } from 'next-auth'
import { Metadata } from 'next'

import prisma from '@/lib/prisma'
import { Task } from '@prisma/client'
import { columns } from './_components/columns'
import { DataTable } from './_components/TasksTable'

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'My Tasks page.',
}

const getTaskStatus = (task: Task) => {
  if (task.completed) return 'Completed'
  if (!task.dueDate) return 'Upcoming'
  const today = new Date()
  const dueDate = new Date(task.dueDate)
  if (dueDate < today) return 'Overdue'
  return 'Upcoming'
}

export default async function MyTasksPage({ params }: { params: { workspaceId: string } }) {
  const session = await getServerSession()
  if (!session) {
    return null
  }

  const dbTasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      section: {
        project: {
          workspaceId: params.workspaceId,
        },
      },
    },
  })

  const myTasks = dbTasks.map((task) => ({
    description: task.description,
    status: getTaskStatus(task),
    priority: task.priority as string,
    dueDate: task.dueDate
      ? task.dueDate.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
        })
      : '',
  }))

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 overflow-auto px-2 py-6 sm:px-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your tasks in this workspace!
          </p>
        </div>
        <div className="flex items-center space-x-2"></div>
      </div>
      <DataTable data={myTasks || []} columns={columns} />
    </div>
  )
}
