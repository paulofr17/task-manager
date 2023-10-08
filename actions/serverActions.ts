'use server'

import { addIssueSchema } from '@/lib/addIssueSchema'
import prisma from '@/lib/prisma'
import { Priority } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { genSaltSync, hashSync } from 'bcrypt-ts'
import { DropResult } from 'react-beautiful-dnd'

export async function revalidateHome() {
  revalidatePath('/')
}

export async function createIssue(project: Project, issueFormData: FormData) {
  try {
    const issue = addIssueSchema.parse(Object.fromEntries(issueFormData))
    const newIssue = await prisma.issue.create({
      data: {
        description: issue.description,
        status: issue.status,
        priority: issue.priority as Priority,
        duration: `${issue.duration}${issue.durationUnit}`,
        projectId: project.id,
      },
    })

    project.issuesOrder.columns.forEach((column) => {
      if (column.title === issue.status) {
        column.issueIds.push(newIssue.id)
      }
    })
    await prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        issuesOrder: project.issuesOrder,
      },
    })

    revalidatePath('/')
    return { status: 'success' }
  } catch (error: any) {
    return { status: 'error' }
  }
}

export async function changeIssueOrder(dropResult: DropResult, projectId: string) {
  try {
    const { destination, source, draggableId } = dropResult

    const project = await prisma.project.findUnique({ where: { id: projectId } })

    if (!project) return { status: 'error' }
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
    console.log(project.issuesOrder)
    console.log('#################################')
    project.issuesOrder.columns.forEach((column) => {
      column.issueIds = column.issueIds.filter((issueId) => issueId !== draggableId)
      if (column.id === destination?.droppableId) {
        column.issueIds.splice(destination.index, 0, draggableId)
      }
    })
    console.log(project.issuesOrder)
    if (source.droppableId !== destination?.droppableId) {
      const newStatus = project.issuesOrder.columns.find(
        (status) => status.id === destination?.droppableId,
      )
      await prisma.issue.update({
        where: {
          id: draggableId,
        },
        data: {
          status: newStatus?.title,
        },
      })
    }

    await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        issuesOrder: project.issuesOrder,
      },
    })

    revalidatePath('/')
    return { status: 'success' }
  } catch (error: any) {
    return { status: 'error' }
  }
}

export async function deleteIssue(issueId: string) {
  try {
    const deletedIssue = await prisma.issue.delete({
      where: {
        id: issueId,
      },
    })
    // Purge unused issue ids from issuesOrder object inside project
    const issueIds = await prisma.issue.findMany({ select: { id: true } })
    const issuesIdsArray = issueIds.map((issue) => issue.id)
    const project = await prisma.project.findFirstOrThrow({ where: { id: deletedIssue.projectId } })
    project.issuesOrder.columns.forEach((column) => {
      column.issueIds = column.issueIds.filter((issueId) => issuesIdsArray.includes(issueId))
    })

    await prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        issuesOrder: project.issuesOrder,
      },
    })

    revalidatePath('/')
    return { status: 'success' }
  } catch (error: any) {
    return { status: 'error' }
  }
}

export async function createTask(issueId: string, description: string) {
  try {
    await prisma.task.create({
      data: {
        description,
        issueId,
      },
    })
    revalidatePath('/')
    return { status: 'success' }
  } catch (error: any) {
    return { status: 'error' }
  }
}

export async function updateTask(taskId: string, description?: string, completed?: boolean) {
  try {
    await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        description,
        completed,
      },
    })
    revalidatePath('/')
    return { status: 'success' }
  } catch (error: any) {
    revalidatePath('/')
    return { status: 'error' }
  }
}

export async function deleteTask(taskId: string) {
  try {
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    })
    revalidatePath('/')
    return { status: 'success' }
  } catch (error: any) {
    return { status: 'error' }
  }
}

export async function createUser(name: string, email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (user)
      return {
        status: 'error',
        message: `This email is already associated with an account.`,
      }
    password = hashSync(password, genSaltSync(10))
    await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })
    return { status: 'success', message: 'Successfully registered' }
  } catch (error: any) {
    return { status: 'error', message: 'Error creating user' }
  }
}
