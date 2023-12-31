import { z } from 'zod'

export const ShareProjectSchema = z.object({
  projectId: z.string(),
  members: z.array(z.string()).min(1, 'You must select at least one member'),
})

export type ShareProjectType = z.infer<typeof ShareProjectSchema>
