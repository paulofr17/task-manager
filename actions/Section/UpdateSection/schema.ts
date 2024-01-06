import { z } from 'zod'

export const UpdateSectionNameSchema = z.object({
  sectionId: z.string(),
  sectionName: z.string().max(255, { message: 'Section name is too long' }),
})

export type UpdateSectionNameType = z.infer<typeof UpdateSectionNameSchema>
