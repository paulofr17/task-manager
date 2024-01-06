'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'

import { NewTaskType, NewTaskSchema } from './schema'
import { Priority } from '@prisma/client'
import prisma from '@/lib/prisma'

export async function createTask(formData: NewTaskType) {
  try {
    // Check if user is logged in
    const session = await getServerSession()
    if (!session?.user?.email) {
      return { error: 'You must be logged in to create a Task...' }
    }

    // Check if provided data is valid
    const result = NewTaskSchema.safeParse(formData)
    if (!result.success) {
      return { error: 'Invalid data providade to create Task' }
    }

    // Check if section exists
    const section = await prisma.section.findUnique({ where: { id: formData.section } })
    if (!section) return { status: 'error' }

    // Get last task order
    const lastTask = await prisma.task.findFirst({
      where: {
        sectionId: formData.section,
      },
      orderBy: {
        order: 'desc',
      },
      select: {
        order: true,
      },
    })

    // Create new task with correct ordering
    const order = lastTask ? lastTask.order + 1 : 0
    const task = await prisma.task.create({
      data: {
        description: formData.description,
        priority: formData.priority as Priority,
        dueDate: formData.dueDate,
        sectionId: formData.section,
        order,
      },
    })

    revalidatePath('/')
    return { data: task }
  } catch (error: any) {
    return { error: 'Error processing request, please retry...' }
  }
}
