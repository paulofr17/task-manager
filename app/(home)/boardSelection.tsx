'use client'

import { Board, User } from '@prisma/client'
import { ChevronRight, PlusCircle } from 'lucide-react'
import { Disclosure } from '@headlessui/react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { AddBoardForm } from './addBoardForm'

interface BoardSelectionProps {
  boards: Board[]
  projectId: string
  userList: User[]
}

export function BoardSelection({ boards, projectId, userList }: BoardSelectionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [openBoardCreation, setOpenBoardCreation] = useState(false)
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams],
  )

  const changeSelectedBoard = (newBoardId: string) => {
    router.push(pathname + '?' + createQueryString('board', newBoardId))
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <Disclosure as="div" className="mt-2" defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className="group flex w-full items-center justify-between rounded-lg py-2 pl-2 text-left text-sm font-semibold text-zinc-700 hover:bg-gray-100 focus-visible:outline-none">
              <div className="flex gap-x-2">
                <ChevronRight className={`${open ? 'rotate-90 transform' : ''} h-5 w-5`} />
                <span>Boards ({boards.length})</span>
              </div>
              <a
                className="mr-1 hidden hover:scale-110 hover:text-purple-650 group-hover:flex"
                onClick={(event) => {
                  event.stopPropagation()
                  setOpenBoardCreation(true)
                }}
              >
                <PlusCircle size={20} />
              </a>
            </Disclosure.Button>
            <AddBoardForm
              projectId={projectId}
              userList={userList}
              changeSelectedBoard={changeSelectedBoard}
              openBoardCreation={openBoardCreation}
              setOpenBoardCreation={setOpenBoardCreation}
            />
            {/* List with project boards */}
            <Disclosure.Panel
              as="ol"
              className="flex flex-col gap-[2px] px-2 pt-1 focus-visible:outline-none"
            >
              {boards.map((board) => (
                <li
                  key={board.id}
                  className={`w-full truncate rounded-lg py-2 pl-4 text-sm text-zinc-700 hover:cursor-pointer hover:overflow-auto hover:whitespace-break-spaces hover:bg-gray-100 ${
                    searchParams.get('board') === board.id && 'bg-gray-200 font-bold'
                  } focus-visible:ring-offset-gray-1} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-650 focus-visible:ring-offset-2`}
                  onClick={() => changeSelectedBoard(board.id)}
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
