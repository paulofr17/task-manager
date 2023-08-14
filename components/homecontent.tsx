'use client'

import { useState } from 'react'

import { TabSelector } from './tabselector'
import { Board } from './board'

export function HomeContent() {
  const [activeTab, setActiveTab] = useState('Overview')

  return (
    <div>
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'Overview' && <div>Overview</div>}
      {activeTab === 'Board' && <Board />}
    </div>
  )
}
