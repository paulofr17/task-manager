'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'

export async function deleteSubTask(subTaskId: string) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return { error: 'You must be logged in to delete a subTask...' }
    }

    const subTask = await prisma.subTask.delete({
      where: {
        id: subTaskId,
      },
    })

    revalidatePath('/')
    return { data: subTask }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
