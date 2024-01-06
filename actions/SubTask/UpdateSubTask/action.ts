'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

import { UpdateSubTaskSchema, UpdateSubTaskType } from './schema'
import prisma from '@/lib/prisma'

export async function updateSubTask(formData: UpdateSubTaskType) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return { error: 'You must be logged in to create a workspace...' }
    }

    const result = UpdateSubTaskSchema.safeParse(formData)

    if (!result.success) {
      return { error: 'Invalid data provided' }
    }

    const subTask = await prisma.subTask.update({
      where: {
        id: formData.subTaskId,
      },
      data: {
        description: formData.description,
        completed: formData.completed,
      },
    })

    revalidatePath('/')
    return { data: subTask }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
