'use client'

import { useCallback, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { AddIssue } from './addIssue'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { BoardWithColumns } from '@/models/types'

interface tabSelectorProps {
  board: BoardWithColumns
  activeTab: string
}

const tabs = ['Overview', 'Board', 'Timeline']

export function TabSelector({ board, activeTab }: tabSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: session, status } = useSession()
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams],
  )

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'unauthenticated') {
    return <p>Access Denied</p>
  }

  return (
    <div className="mr-1 flex h-12 items-center justify-between rounded-xl border border-zinc-300 bg-zinc-50/50 px-2 lg:h-12">
      <div className="flex space-x-8 pl-4 sm:space-x-12 md:space-x-14">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${
              activeTab === tab
                ? 'border-b-2 border-purple-650 py-3 text-purple-650'
                : 'text-zinc-600'
            } text-xs sm:text-sm lg:text-base 
            `}
            onClick={() => {
              router.push(pathname + '?' + createQueryString('tab', tab))
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <Button
        className="h-8 bg-purple-650 text-xs text-white hover:bg-purple-650/50"
        size={'sm'}
        onClick={() => setDialogOpen(true)}
      >
        Add Issue
        <Plus size={15} className="ml-1" />
      </Button>
      <AddIssue columns={board.columns} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
    </div>
  )
}
