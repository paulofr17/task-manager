'use client'

import { Board } from '@prisma/client'
import { ChevronRight } from 'lucide-react'
import { Disclosure } from '@headlessui/react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'

interface BoardSelectionProps {
  boards: Board[]
}

export function BoardSelection({ boards }: BoardSelectionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams],
  )
  return (
    <div className="flex w-full flex-col gap-2">
      <Disclosure as="div" className="mt-2" defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full gap-x-2 rounded-lg py-2 pl-2 text-left text-sm font-semibold text-gray-700 hover:bg-gray-100 focus-visible:outline-none">
              <ChevronRight className={`${open ? 'rotate-90 transform' : ''} h-5 w-5`} />
              <span>Boards</span>
            </Disclosure.Button>
            <Disclosure.Panel
              as="ol"
              className="pl-2 pr-1 pt-1 text-sm text-gray-500 focus-visible:outline-none"
            >
              {boards.map((board) => (
                <li
                  key={board.id}
                  className="w-full rounded-lg py-2 pl-4 text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-100 "
                  onClick={() => router.push(pathname + '?' + createQueryString('board', board.id))}
                >
                  {board.name}
                </li>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
