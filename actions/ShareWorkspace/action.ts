'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ShareWorkspaceType, ShareWorkspaceSchema } from './schema'
import { getServerSession } from 'next-auth'

export async function shareWorkspace(formData: ShareWorkspaceType) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return { error: 'You must be logged in to share a workspace...' }
    }

    const result = ShareWorkspaceSchema.safeParse(formData)
    if (!result.success) {
      return { error: 'Invalid data provided to share workspace with members...' }
    }

    const workspace = await prisma.workspace.update({
      where: { id: formData.workspaceId },
      data: {
        users: {
          connect: formData.members.map((member) => ({ id: member })),
        },
      },
    })
    revalidatePath('/')
    return { data: workspace }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
