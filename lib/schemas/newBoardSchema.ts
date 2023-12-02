import { z } from 'zod'

export const NewBoardSchema = z.object({
  boardName: z.string().min(3, 'Board name must be at least 3 characters long'),
})

export type NewBoardType = z.infer<typeof NewBoardSchema>
