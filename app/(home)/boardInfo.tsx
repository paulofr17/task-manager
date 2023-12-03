'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { BoardWithColumns } from '@/models/types'
import { User } from '@prisma/client'
import { AddMembers } from './addMembers'

interface BoardInfoProps {
  board: BoardWithColumns
  userList: User[]
}

export function BoardInfo({ board, userList }: BoardInfoProps) {
  return (
    <div className="mb-4 flex shrink-0 items-center justify-between">
      <Button
        className="flex h-fit w-fit flex-1 justify-start truncate px-0 pr-1 text-sm font-medium sm:text-base md:text-lg"
        variant={'link'}
        onClick={() => console.log('a')}
      >
        {board.name}
      </Button>
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
        <div className="hidden sm:flex">
          {board.users.map((user) => (
            <Avatar key={user.id} className="h-6 w-6">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <p className="text-xs text-zinc-500">{board.userIds.length} Members</p>
        <AddMembers
          boardId={board.id}
          userList={userList.filter((user) => !board.userIds.includes(user.id))}
        />
      </div>
    </div>
  )
}
