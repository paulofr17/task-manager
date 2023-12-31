'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'

export async function updateTaskStatus(taskId: string, completed: boolean) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return { error: 'You must be logged in to change Task status...' }
    }

    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        completed,
      },
    })

    revalidatePath('/')
    return { data: task }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}

export async function updateTaskName(taskId: string, completed: boolean) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return { error: 'You must be logged in to change Task status...' }
    }

    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        completed,
      },
    })

    revalidatePath('/')
    return { data: task }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
