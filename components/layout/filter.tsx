import React from 'react'

import { ProjectSelection } from './projectselection'
import prisma from '@/lib/prisma'

export async function Filter() {
  const projects = await prisma.project.findMany({})
  return (
    <div className="hidden h-full pt-5 lg:flex">
      <div className="flex w-52 flex-col items-center space-y-6 rounded-xl border border-zinc-300 bg-zinc-50/50">
        <div className="pt-5">
          <ProjectSelection projects={projects} />
        </div>
      </div>
    </div>
  )
}
