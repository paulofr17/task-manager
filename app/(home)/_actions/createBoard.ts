'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NewBoardSchema, NewBoardType } from '@/lib/schemas/newBoardSchema'

export async function createBoard(
  formData: NewBoardType,
  projectId: string,
  boardMembers: Set<string>,
) {
  const session = await getServerSession(authOptions)
  const boardName = formData?.boardName

  if (!NewBoardSchema.safeParse(formData).success) {
    return { error: 'Invalid board data provided' }
  }

  if (!session?.user?.email) {
    return { error: 'You must be logged in to create a board' }
  }

  if (boardMembers.size === 0) {
    return { error: 'You must add at least one member to the board' }
  }

  try {
    const board = await prisma.board.create({
      data: {
        name: boardName,
        projectId,
        users: {
          connect: Array.from(boardMembers).map((id) => ({ id })),
        },
      },
    })

    revalidatePath('/')
    return { message: `Board '${boardName}' successfully created`, board }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
