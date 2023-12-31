'use client'

import { ElementRef, useRef, useState } from 'react'
import { Bell, CheckCircle, Home } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { useWorkspaceContext } from '@/context/WorkspaceContext'
import { Separator } from '../ui/separator'
import { cn } from '@/lib/utils'
import { TeamMenu } from './TeamMenu'

interface SidebarProps {
  openSidebar: boolean
}

export function Sidebar({ openSidebar }: SidebarProps) {
  const { currentWorkspace } = useWorkspaceContext()
  const pathname = usePathname()
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<ElementRef<'aside'>>(null)

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsResizing(true)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  if (!openSidebar) {
    sidebarRef.current?.style.setProperty('width', '')
  }

  const handleMouseMove = (event: MouseEvent) => {
    let newWidth = event.clientX

    if (newWidth < 192) newWidth = 192
    if (newWidth > 400) newWidth = 400

    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    // isResizingRef.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const highlightLink = (path: string) => {
    return pathname.includes(path) ? 'bg-accent' : 'hover:bg-accent'
  }

  const hrefLink = (path: string) => {
    return currentWorkspace?.id ? `/${currentWorkspace?.id}${path}` : `${path}`
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'z-[9] flex shrink-0 flex-col gap-1 overflow-hidden text-sm text-primary',
          openSidebar ? `w-52 border-r-2 p-4` : 'w-0',
          !isResizing && 'transition-all duration-300 ease-in-out',
        )}
      >
        <Link
          href={hrefLink('/home')}
          className={`flex items-center gap-3 truncate rounded-md px-4 py-2 ${highlightLink(
            '/home',
          )}`}
        >
          <Home size={20} strokeWidth={2} />
          Home
        </Link>
        <Link
          href={hrefLink('/my-tasks')}
          className={`flex items-center gap-3 truncate rounded-md px-4 py-2 ${highlightLink(
            '/my-tasks',
          )}`}
        >
          <CheckCircle size={20} strokeWidth={2} />
          My Tasks
        </Link>
        <Link
          href={hrefLink('/inbox')}
          className={`flex items-center gap-3 truncate rounded-md px-4 py-2 ${highlightLink(
            '/inbox',
          )}`}
        >
          <Bell size={20} strokeWidth={2} />
          Inbox
        </Link>
        <Separator className="my-3" />
        <p className="font-semibold">Projects</p>
        {currentWorkspace?.projects.map((project) => (
          <Link
            key={project.id}
            href={hrefLink(`/project/${project.id}`)}
            className={`flex items-center gap-3 truncate rounded-md px-4 py-2 hover:bg-accent ${highlightLink(
              `/project/${project.id}`,
            )}`}
          >
            <span className="truncate" title={project.name}>
              {project.name}
            </span>
          </Link>
        ))}
        <p className="mt-4 font-semibold">Team</p>
        {currentWorkspace && (
          <Link
            href={hrefLink(`/team`)}
            className={`flex items-center justify-between gap-3 rounded-md px-4 py-2 hover:bg-accent ${highlightLink(
              `/team`,
            )}`}
          >
            <span className="truncate" title={currentWorkspace.name}>
              {currentWorkspace.name}
            </span>
            {/* Prevent Link from being triggered */}
            <div onClick={(event) => event.stopPropagation()}>
              <TeamMenu workspace={currentWorkspace} />
            </div>
          </Link>
        )}
      </aside>
      <div
        onMouseDown={handleMouseDown}
        className={cn(
          'h-full w-1 cursor-ew-resize bg-secondary opacity-0 hover:opacity-100',
          openSidebar ? 'block' : 'hidden',
        )}
      ></div>
    </>
  )
}
