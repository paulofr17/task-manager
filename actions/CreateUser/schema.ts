import { z } from 'zod'

export const CreateUserSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(5, {
    message: 'Name must be at least 5 characters long',
  }),

  email: z.string({ required_error: 'Email is required' }).email({
    message: 'Invalid email address',
  }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

export type CreateUserType = z.infer<typeof CreateUserSchema>
