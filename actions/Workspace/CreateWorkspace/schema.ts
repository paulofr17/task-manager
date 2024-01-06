import { z } from 'zod'

export const NewWorkspaceSchema = z.object({
  workspaceName: z.string().min(3, 'Workspace name must be at least 3 characters long'),
  members: z.array(z.string()).min(1, 'Workspace must have at least one member selected'),
})

export type NewWorkspaceType = z.infer<typeof NewWorkspaceSchema>
