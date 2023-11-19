import { z } from 'zod'

export const addIssueSchema = z.object({
  description: z.string().min(2, { message: 'Issue description is too short' }),
  column: z.string({
    required_error: 'Please select column',
  }),
  priority: z.string({
    required_error: 'Please select issue priority',
  }),
  duration: z.coerce
    .number({
      required_error: 'Issue duration is required',
    })
    .min(1, { message: 'Must be greater than 0' }),
  durationUnit: z.enum(['d', 'h']),
})
