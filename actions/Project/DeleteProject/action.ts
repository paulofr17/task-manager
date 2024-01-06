'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'

export async function deleteProject(projectId: string) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return { error: 'You must be logged in to delete a project...' }
    }

    const project = await prisma.project.delete({
      where: {
        id: projectId,
      },
    })

    revalidatePath('/')
    return { data: project }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
