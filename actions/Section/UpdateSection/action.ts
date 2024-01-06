'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'
import { UpdateSectionNameSchema } from './schema'

export async function updateSectionName(sectionId: string, sectionName: string) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return { error: 'You must be logged in to change section name...' }
    }

    const validation = UpdateSectionNameSchema.safeParse({ sectionId, sectionName })
    if (!validation.success) {
      return { error: 'Invalid data provided to update section name...' }
    }

    const section = await prisma.section.update({
      where: {
        id: sectionId,
      },
      data: {
        name: sectionName,
      },
    })

    revalidatePath('/')
    return { data: section }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
