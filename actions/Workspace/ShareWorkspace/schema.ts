import { z } from 'zod'

export const ShareWorkspaceSchema = z.object({
  workspaceId: z.string(),
  members: z.array(z.string()).min(1, 'You must select at least one member'),
})

export type ShareWorkspaceType = z.infer<typeof ShareWorkspaceSchema>
