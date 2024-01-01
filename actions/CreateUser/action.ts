'use server'

import prisma from '@/lib/prisma'
import { hashSync, genSaltSync } from 'bcrypt-ts'
import { CreateUserSchema, CreateUserType } from './schema'

export async function createUser(formData: CreateUserType) {
  try {
    // Check if provided data is valid
    console.log(formData)
    const validation = CreateUserSchema.safeParse(formData)
    if (!validation.success) {
      console.log('error creating user')
      return { error: 'Invalid data providade to create User' }
    }
    const { name, email, password } = formData
    // Check if user already exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    console.log('user: ' + user)
    if (user) {
      return { error: 'This email is already associated with an account.' }
    }
    // Create new user
    const hashedPassword = hashSync(password, genSaltSync(10))
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
    console.log('created: ' + newUser)
    return { data: newUser }
  } catch (error: any) {
    console.log('catch: ' + error)
    return { error: 'Error processing request, please retry...' }
  }
}
