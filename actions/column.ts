'use server'

import prisma from '@/lib/prisma'
import { ColumnWithIssues } from '@/models/types'
import { revalidatePath } from 'next/cache'

export async function createColumn(columnName: string, boardId: string) {
  try {
    const lastColumnOrder = await prisma.column.findFirst({
      select: {
        order: true,
      },
      orderBy: {
        order: 'desc',
      },
    })

    const columnOrder = lastColumnOrder ? lastColumnOrder.order + 1 : 0

    const column = await prisma.column.create({
      data: {
        name: columnName,
        order: columnOrder,
        boardId,
      },
    })

    revalidatePath('/')
    return { data: column }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}

export async function deleteColumn(columnId: string) {
  try {
    const deletedColumn = await prisma.column.delete({
      where: {
        id: columnId,
      },
    })

    revalidatePath('/')
    return { data: deletedColumn }
  } catch (error: any) {
    revalidatePath('/')
    console.log(error)

    return { error: 'Error processing request, please retry...' }
  }
}

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
