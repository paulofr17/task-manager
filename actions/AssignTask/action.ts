'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'

import prisma from '@/lib/prisma'

export async function assignTask(taskId: string, userId: string) {
  try {
    // Check if user is logged in
    const session = await getServerSession()
    if (!session?.user?.email) {
      return { error: 'You must be logged in to assign a Task ...' }
    }

    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })

    revalidatePath('/')
    return { data: task }
  } catch (error: any) {
    return { error: 'Error processing request, please retry...' }
  }
}

export async function unassignTask(taskId: string) {
  try {
    // Check if user is logged in
    const session = await getServerSession()
    if (!session?.user?.email) {
      return { error: 'You must be logged in to unassign a Task ...' }
    }

    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        user: {
          disconnect: true,
        },
      },
    })

    revalidatePath('/')
    return { data: task }
  } catch (error: any) {
    return { error: 'Error processing request, please retry...' }
  }
}
