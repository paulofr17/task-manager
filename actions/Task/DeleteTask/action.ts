'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'

export async function deleteTask(taskId: string) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return { error: 'You must be logged in to delete a task...' }
    }

    const task = await prisma.task.delete({
      where: {
        id: taskId,
      },
    })

    revalidatePath('/')
    return { data: task }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
