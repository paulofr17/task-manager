'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'

export async function deleteSection(sectionId: string) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return { error: 'You must be logged in to delete a section...' }
    }

    const section = await prisma.section.delete({
      where: {
        id: sectionId,
      },
    })

    revalidatePath('/')
    return { data: section }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
