'use server'

import { addIssueSchema } from '@/lib/addIssueSchema'
import prisma from '@/lib/prisma'
import { Priority } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function revalidateHome() {
  revalidatePath('/')
}

export async function createIssue(issueFormData: FormData) {
  try {
    const issue = addIssueSchema.parse(Object.fromEntries(issueFormData))
    const newIssue = await prisma.issue.create({
      data: {
        description: issue.description,
        status: issue.status,
        priority: issue.priority as Priority,
        duration: `${issue.duration}${issue.durationUnit}`,
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
    revalidatePath('/')
    return { status: 'success' }
  } catch (error: any) {
    return { status: 'error' }
  }
}

export async function createTask(issueId: string, description: string) {
  try {
    const newTask = await prisma.task.create({
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

export async function updateTask(
  taskId: string,
  description: string,
  completed: boolean,
) {
  try {
    const updatedTask = await prisma.task.update({
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
    return { status: 'error' }
  }
}

export async function deleteTask(taskId: string) {
  try {
    const deletedTask = await prisma.task.delete({
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
