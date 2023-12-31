'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ShareProjectType, ShareProjectSchema } from './schema'
import { getServerSession } from 'next-auth'

export async function shareProject(formData: ShareProjectType) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return { error: 'You must be logged in to share a project...' }
    }

    const result = ShareProjectSchema.safeParse(formData)
    if (!result.success) {
      return { error: 'Invalid data provided to share project with members...' }
    }

    const project = await prisma.project.update({
      where: { id: formData.projectId },
      data: {
        users: {
          connect: formData.members.map((member) => ({ id: member })),
        },
      },
    })
    revalidatePath('/')
    return { data: project }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
