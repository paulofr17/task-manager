'use server'

import prisma from '@/lib/prisma'
import { Privacy, Section } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { NewProjectType, NewProjectSchema } from './schema'

const sectionsTemplate: Pick<Section, 'name' | 'order'>[] = [
  {
    name: 'To Do',
    order: 1,
  },
  {
    name: 'In Progress',
    order: 2,
  },
  {
    name: 'Done',
    order: 3,
  },
]

export async function createProject(formData: NewProjectType) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return { error: 'You must be logged in to create a project...' }
    }

    const result = NewProjectSchema.safeParse(formData)

    if (!result.success) {
      return { error: 'Invalid data provided to create project...' }
    }

    const project = await prisma.project.create({
      data: {
        name: formData.projectName,
        privacy: formData.privacy as Privacy,
        workspace: {
          connect: {
            id: formData.workspaceId,
          },
        },
        sections: {
          create: sectionsTemplate.map((section) => ({
            name: section.name,
            order: section.order,
          })),
        },
        users: {
          connect: {
            email: session.user.email,
          },
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
