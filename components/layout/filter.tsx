import React from 'react'

import { BoardSelection } from './boardSelection'
import prisma from '@/lib/prisma'

export async function Filter() {
  const boards = await prisma.board.findMany({})
  return (
    <div className="hidden h-full pb-4 pt-5 lg:flex">
      <div className="flex w-52 flex-col items-center space-y-6 rounded-xl border border-zinc-300 bg-zinc-50/50">
        <div className="pt-5">
          <BoardSelection boards={boards} />
        </div>
      </div>
    </div>
  )
}
