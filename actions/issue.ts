'use server'

import { addIssueSchema } from '@/lib/addIssueSchema'
import prisma from '@/lib/prisma'
import { Issue, Priority } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function createIssue(issueFormData: FormData) {
  try {
    const issue = addIssueSchema.parse(Object.fromEntries(issueFormData))

    const column = await prisma.column.findUnique({ where: { id: issue.column } })

    if (!column) return { status: 'error' }

    const lastIssue = await prisma.issue.findFirst({
      where: {
        columnId: issue.column,
      },
      orderBy: {
        order: 'desc',
      },
      select: {
        order: true,
      },
    })

    const order = lastIssue ? lastIssue.order + 1 : 0

    await prisma.issue.create({
      data: {
        description: issue.description,
        priority: issue.priority as Priority,
        duration: `${issue.duration}${issue.durationUnit}`,
        columnId: issue.column,
        order,
      },
    })

    revalidatePath('/')
    return { status: 'success' }
  } catch (error: any) {
    return { status: 'error' }
  }
}

export async function deleteIssue(issueId: string) {
  try {
    const deletedIssue = await prisma.issue.delete({
      where: {
        id: issueId,
      },
    })

    revalidatePath('/')
    return { data: deletedIssue }
  } catch (error: any) {
    return { status: 'error' }
  }
}

export async function changeIssuesOrder(newIssuesOrder: Issue[]) {
  try {
    const transaction = newIssuesOrder.map((issue) => {
      return prisma.issue.update({
        where: {
          id: issue.id,
        },
        data: {
          columnId: issue.columnId,
          order: issue.order,
        },
      })
    })

    const issues = await prisma.$transaction(transaction)
    revalidatePath('/')
    return { data: issues }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
