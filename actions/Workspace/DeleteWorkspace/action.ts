'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'

export async function deleteWorkspace(workspaceId: string) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return { error: 'You must be logged in to delete a workspace...' }
    }

    const workspace = await prisma.workspace.delete({
      where: {
        id: workspaceId,
      },
    })

    revalidatePath('/')
    return { data: workspace }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
