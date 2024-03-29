import { z } from 'zod'

export const NewProjectSchema = z.object({
  projectName: z.string().min(3, 'Project name must be at least 3 characters long'),
  privacy: z.string(),
  workspaceId: z.string(),
})

export type NewProjectType = z.infer<typeof NewProjectSchema>
