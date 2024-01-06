import { z } from 'zod'

export const UpdateSubTaskSchema = z.object({
  subTaskId: z.string(),
  description: z.string().max(255, { message: 'SubTask name is too long' }),
  completed: z.coerce.boolean(),
})

export type UpdateSubTaskType = z.infer<typeof UpdateSubTaskSchema>
