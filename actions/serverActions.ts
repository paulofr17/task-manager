'use server'

import { addIssueSchema } from '@/lib/addIssueSchema'
import prisma from '@/lib/prisma'
import { Priority } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { genSaltSync, hashSync } from 'bcrypt-ts'

export async function revalidateHome() {
  revalidatePath('/')
}

export async function createIssue(issueFormData: FormData) {
  try {
    const issue = addIssueSchema.parse(Object.fromEntries(issueFormData))
    await prisma.issue.create({
      data: {
        description: issue.description,
        status: issue.status,
        priority: issue.priority as Priority,
        duration: `${issue.duration}${issue.durationUnit}`,
      },
    })
    revalidatePath('/')
    return { status: 'success' }
  } catch (error: any) {
    return { status: 'error' }
  }
}

export async function deleteIssue(issueId: string) {
  try {
    await prisma.issue.delete({
      where: {
        id: issueId,
      },
    })
    revalidatePath('/')
    return { status: 'success' }
  } catch (error: any) {
    return { status: 'error' }
  }
}

export async function createTask(issueId: string, description: string) {
  try {
    await prisma.task.create({
      data: {
        description,
        issueId,
      },
    })
    revalidatePath('/')
    return { status: 'success' }
  } catch (error: any) {
    return { status: 'error' }
  }
}

export async function updateTask(
  taskId: string,
  description: string,
  completed: boolean,
) {
  try {
    await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        description,
        completed,
      },
    })
    revalidatePath('/')
    return { status: 'success' }
  } catch (error: any) {
    return { status: 'error' }
  }
}

export async function deleteTask(taskId: string) {
  try {
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    })
    revalidatePath('/')
    return { status: 'success' }
  } catch (error: any) {
    return { status: 'error' }
  }
}

export async function createUser(
  name: string,
  email: string,
  password: string,
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (user)
      return {
        status: 'error',
        message: `This email is already associated with an account.`,
      }
    password = hashSync(password, genSaltSync(10))
    await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })
    return { status: 'success', message: 'Successfully registered' }
  } catch (error: any) {
    return { status: 'error', message: 'Error creating user' }
  }
}
