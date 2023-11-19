'use server'

import prisma from '@/lib/prisma'
import { ColumnWithIssues } from '@/models/types'
import { revalidatePath } from 'next/cache'

export async function changeColumnsOrder(newColumnsOrder: ColumnWithIssues[]) {
  try {
    const transaction = newColumnsOrder.map((column) => {
      return prisma.column.update({
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
