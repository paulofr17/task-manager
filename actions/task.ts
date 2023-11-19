'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function revalidateRoute(path: string) {
  revalidatePath(path)
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
