'use server'

import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'
import { TasksWithSubTasks } from '@/types/types'

export async function changeTasksOrder(newTasksOrder: TasksWithSubTasks[]) {
  try {
    const transaction = newTasksOrder.map((task) => {
      return prisma.task.update({
        where: {
          id: task.id,
        },
        data: {
          sectionId: task.sectionId,
          order: task.order,
        },
      })
    })

    const tasks = await prisma.$transaction(transaction)
    revalidatePath('/')
    return { data: tasks }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
