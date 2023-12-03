'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function shareBoard(boardId: string, newMembers: string[]) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return { error: 'You must be logged in to share a board' }
  }

  if (newMembers.length === 0) {
    return { error: 'You must add at least one member to share a board' }
  }

  try {
    await prisma.board.update({
      where: { id: boardId },
      data: {
        users: {
          connect: newMembers.map((id) => ({ id })),
        },
      },
    })
    revalidatePath('/')
    return { message: `Board successfully shared` }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
