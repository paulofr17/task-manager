'use server'

import prisma from '@/lib/prisma'
import { hashSync, genSaltSync } from 'bcrypt-ts'

export async function createUser(name: string, email: string, password: string) {
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
