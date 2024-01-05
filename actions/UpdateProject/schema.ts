import { z } from 'zod'

export const UpdateProjectNameSchema = z.object({
  projectId: z.string(),
  projectName: z.string().min(3, 'Project name must be at least 3 characters long'),
})

export type UpdateProjectNameType = z.infer<typeof UpdateProjectNameSchema>
