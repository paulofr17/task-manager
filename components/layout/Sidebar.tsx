'use client'

import { ElementRef, useRef, useState } from 'react'
import {
  Bell,
  CheckCircle,
  FolderKanban,
  Home,
  LayoutGrid,
  Users,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { useWorkspaceContext } from '@/context/WorkspaceContext'
import { cn } from '@/lib/utils'
import { TeamMenu } from './TeamMenu'

interface SidebarProps {
  openSidebar: boolean
}

const PROJECT_HUES = [210, 260, 330, 150, 30, 190, 290, 100]
const hashHue = (id: string) =>
  PROJECT_HUES[
    id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % PROJECT_HUES.length
  ]

export function Sidebar({ openSidebar }: SidebarProps) {
  const { currentWorkspace } = useWorkspaceContext()
  const pathname = usePathname()
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<ElementRef<'aside'>>(null)

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
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

    if (newWidth < 208) newWidth = 208
    if (newWidth > 400) newWidth = 400

    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const isActive = (path: string) => pathname.includes(path)

  const hrefLink = (path: string) =>
    currentWorkspace?.id ? `/${currentWorkspace?.id}${path}` : `${path}`

  const navRowClass = (active: boolean) =>
    cn(
      'group relative flex items-center gap-3 truncate rounded-md px-3 py-2 text-sm font-medium transition-colors',
      active
        ? 'bg-accent text-accent-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    )

  const ActiveBar = ({ active }: { active: boolean }) =>
    active ? (
      <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
    ) : null

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'z-[9] flex shrink-0 flex-col overflow-hidden border-r bg-background/60 text-sm backdrop-blur',
          openSidebar ? 'w-56' : 'w-0',
          !isResizing && 'transition-all duration-300 ease-in-out',
        )}
      >
        <div className="flex flex-col gap-1 p-3">
          <Link
            href={hrefLink('/home')}
            className={navRowClass(isActive('/home'))}
          >
            <ActiveBar active={isActive('/home')} />
            <Home className="h-4 w-4 shrink-0" strokeWidth={2} />
            Home
          </Link>
          <Link
            href={hrefLink('/my-tasks')}
            className={navRowClass(isActive('/my-tasks'))}
          >
            <ActiveBar active={isActive('/my-tasks')} />
            <CheckCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
            My Tasks
          </Link>
          <Link
            href={hrefLink('/inbox')}
            className={navRowClass(isActive('/inbox'))}
          >
            <ActiveBar active={isActive('/inbox')} />
            <Bell className="h-4 w-4 shrink-0" strokeWidth={2} />
            Inbox
          </Link>
        </div>

        <div className="mt-2 flex flex-1 flex-col gap-1 overflow-y-auto border-t px-3 py-3">
          <p className="mb-1 flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <FolderKanban className="h-3 w-3" />
            Projects
          </p>
          {currentWorkspace?.projects.length ? (
            currentWorkspace.projects.map((project) => {
              const active = isActive(`/project/${project.id}`)
              return (
                <Link
                  key={project.id}
                  href={hrefLink(`/project/${project.id}`)}
                  className={navRowClass(active)}
                >
                  <ActiveBar active={active} />
                  <span
                    className="h-2 w-2 shrink-0 rounded-sm"
                    style={{
                      backgroundColor: `hsl(${hashHue(project.id)} 70% 55%)`,
                    }}
                  />
                  <span className="truncate" title={project.name}>
                    {project.name}
                  </span>
                </Link>
              )
            })
          ) : (
            <p className="px-3 py-1 text-xs text-muted-foreground">
              No projects yet
            </p>
          )}

          <p className="mb-1 mt-4 flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Users className="h-3 w-3" />
            Team
          </p>
          {currentWorkspace && (
            <Link
              href={hrefLink(`/team`)}
              className={cn(navRowClass(isActive('/team')), 'justify-between')}
            >
              <ActiveBar active={isActive('/team')} />
              <div className="flex min-w-0 items-center gap-3">
                <LayoutGrid className="h-4 w-4 shrink-0" />
                <span className="truncate" title={currentWorkspace.name}>
                  {currentWorkspace.name}
                </span>
              </div>
              <div onClick={(event) => event.stopPropagation()}>
                <TeamMenu workspace={currentWorkspace} />
              </div>
            </Link>
          )}
        </div>
      </aside>
      <div
        onMouseDown={handleMouseDown}
        className={cn(
          'h-full w-1 cursor-ew-resize bg-border/0 transition-colors hover:bg-primary/30',
          openSidebar ? 'block' : 'hidden',
        )}
      ></div>
    </>
  )
}
