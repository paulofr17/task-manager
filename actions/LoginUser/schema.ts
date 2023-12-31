import { z } from 'zod'

export const UserLoginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email({
    message: 'Invalid email address',
  }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

export type UserLoginType = z.infer<typeof UserLoginSchema>
