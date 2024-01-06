'use server'

import prisma from '@/lib/prisma'
import { SectionWithTasks } from '@/types/types'
import { revalidatePath } from 'next/cache'

export async function changeSectionsOrder(newSectionsOrder: SectionWithTasks[]) {
  try {
    const transaction = newSectionsOrder.map((column) => {
      return prisma.section.update({
        where: {
          id: column.id,
        },
        data: {
          order: column.order,
        },
      })
    })

    const columns = await prisma.$transaction(transaction)
    revalidatePath('/')
    return { data: columns }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
