'use client'

import { rev } from '@/actions/serverActions'

export default function Teste({ issues }: any) {
  async function action() {
    await rev()
  }

  return (
    <div className="w-full text-center">
      <form action={action}>
        <button
          className="rounded-md border border-green-600 p-1"
          type="submit"
        >
          Teste
        </button>
      </form>
      {issues.map((issue: any) => (
        <div key={issue.id}>
          {issue.description} - {issue.duration} - {issue.status} -{' '}
          {issue.priority}
        </div>
      ))}
    </div>
  )
}
