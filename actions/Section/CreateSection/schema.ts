import { z } from 'zod'

export const NewSectionSchema = z.object({
  sectionName: z.string().max(255, { message: 'Section name is too long' }),
  projectId: z.string(),
})

export type NewSectionType = z.infer<typeof NewSectionSchema>
