'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { NewWorkspaceType, NewWorkspaceSchema } from './schema'
import { getServerSession } from 'next-auth'

export async function createWorkspace(formData: NewWorkspaceType) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return { error: 'You must be logged in to create a workspace...' }
    }

    const result = NewWorkspaceSchema.safeParse(formData)
    if (!result.success) {
      return { error: 'Invalid data provided to create workspace...' }
    }

    const workspace = await prisma.workspace.create({
      data: {
        name: formData.workspaceName,
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
