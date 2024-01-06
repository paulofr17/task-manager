import { z } from 'zod'

export const NewTaskSchema = z.object({
  description: z.string().min(2, { message: 'Task description is too short' }),
  section: z.string({
    required_error: 'Please select section',
  }),
  priority: z.string({
    required_error: 'Please select task priority',
  }),
  dueDate: z.date().optional(),
})

export type NewTaskType = z.infer<typeof NewTaskSchema>
