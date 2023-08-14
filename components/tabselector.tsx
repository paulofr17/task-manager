'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from './ui/button'

interface tabSelectorProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const tabs = ['Overview', 'List', 'Board', 'Calendar', 'Timeline']

export function TabSelector({ setActiveTab, activeTab }: tabSelectorProps) {
  return (
    <div className="ml-4 mt-4 flex h-12 items-center justify-between rounded-xl border border-zinc-300 bg-zinc-50/50 px-2 lg:h-12">
      <div className="flex space-x-10 pl-4 sm:space-x-12 md:space-x-14">
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
              setActiveTab(tab)
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <Button
        className="h-8 bg-purple-650 text-xs text-white hover:bg-purple-650/50"
        size={'sm'}
      >
        Add new
        <Plus size={15} className="ml-1" />
      </Button>
    </div>
  )
}
