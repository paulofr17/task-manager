'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NewProjectSchema, NewProjectType } from '@/lib/schemas/newProjectSchema'

export async function createProject(formData: NewProjectType, projectMembers: Set<string>) {
  const session = await getServerSession(authOptions)

  if (!NewProjectSchema.safeParse(formData).success) {
    return { error: 'Invalid project data provided' }
  }

  if (!session?.user?.email) {
    return { error: 'You must be logged in to create a project' }
  }

  if (projectMembers.size === 0) {
    return { error: 'You must add at least one member to the project' }
  }

  try {
    const project = await prisma.project.create({
      data: {
        name: formData.projectName,
        users: {
          connect: Array.from(projectMembers).map((id) => ({ id })),
        },
      },
    })

    revalidatePath('/')
    return { message: `Project '${formData.projectName}' successfully created`, project }
  } catch (error: any) {
    revalidatePath('/')
    return { error: 'Error processing request, please retry...' }
  }
}
