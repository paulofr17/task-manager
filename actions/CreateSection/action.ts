'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

import { NewSectionSchema, NewSectionType } from './schema'
import prisma from '@/lib/prisma'

export async function createSection(formData: NewSectionType) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return { error: 'You must be logged in to create a workspace...' }
    }

    const result = NewSectionSchema.safeParse(formData)

    if (!result.success) {
      return { error: result.error.message }
    }

    const lastSectionOrder = await prisma.section.findFirst({
      select: {
        order: true,
      },
      orderBy: {
        order: 'desc',
      },
    })

    const sectionOrder = lastSectionOrder ? lastSectionOrder.order + 1 : 0

    const section = await prisma.section.create({
      data: {
        name: formData.sectionName,
        order: sectionOrder,
        project: {
          connect: {
            id: formData.projectId,
          },
        },
      },
    })

    revalidatePath('/')
    return { data: section }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
