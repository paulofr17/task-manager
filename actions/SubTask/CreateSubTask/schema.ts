import { z } from 'zod'

export const NewSubTaskSchema = z.object({
  description: z.string().max(255, { message: 'SubTask name is too long' }),
  taskId: z.string(),
})

export type NewSubTaskType = z.infer<typeof NewSubTaskSchema>
