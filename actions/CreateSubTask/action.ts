'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

import { NewSubTaskSchema, NewSubTaskType } from './schema'
import prisma from '@/lib/prisma'

export async function createSubTask(formData: NewSubTaskType) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return { error: 'You must be logged in to create a workspace...' }
    }

    const result = NewSubTaskSchema.safeParse(formData)

    if (!result.success) {
      return { error: 'Invalid data provided' }
    }

    const subTask = await prisma.subTask.create({
      data: {
        description: formData.description,
        task: {
          connect: {
            id: formData.taskId,
          },
        },
      },
    })

    revalidatePath('/')
    return { data: subTask }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
