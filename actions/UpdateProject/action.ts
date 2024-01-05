'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'
import { UpdateProjectNameSchema } from './schema'

export async function updateProjectName(projectId: string, projectName: string) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return { error: 'You must be logged in to change project name...' }
    }

    const validation = UpdateProjectNameSchema.safeParse({ projectId, projectName })
    if (!validation.success) {
      return { error: 'Invalid data provided to update project name...' }
    }

    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        name: projectName,
      },
    })

    revalidatePath('/')
    return { data: project }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
