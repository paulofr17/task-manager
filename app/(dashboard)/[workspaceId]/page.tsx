import { redirect } from 'next/navigation'

export default function WorkspacePage({ params }: { params: { workspaceId: string } }) {
  redirect(`/${params.workspaceId}/home`)
}
