'use client'

import { useState } from 'react'
import { ChevronDown, Lock, Share2, UserCircle2 } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ProjectShareForm } from '@/components/shared/ProjectShareForm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProjectWithSections } from '@/types/types'
import { ProjectNameForm } from './ProjectNameForm'

interface ProjectHeaderProps {
  project: ProjectWithSections
}

const HUES = [210, 260, 330, 150, 30, 190, 290, 100]
const hashHue = (id: string) =>
  HUES[id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length]

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const [showShareForm, setShowShareForm] = useState(false)
  const hue = hashHue(project.id)
  const initial = project.name?.[0]?.toUpperCase() || '?'

  return (
    <>
      <div className="flex w-full items-center justify-between border-b bg-card/60 px-4 py-3 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-semibold text-white shadow-soft"
            style={{
              backgroundImage: `linear-gradient(135deg, hsl(${hue} 75% 55%), hsl(${(hue + 30) % 360} 75% 60%))`,
            }}
          >
            {initial}
          </div>
          <div className="flex min-w-0 items-center gap-1">
            <ProjectNameForm project={project} />
            <Button variant="ghost" size="icon-sm" title="Project Actions">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <Badge
            variant={project.privacy === 'Private' ? 'soft' : 'secondary'}
            className="ml-1 gap-1"
          >
            {project.privacy === 'Private' && <Lock className="h-3 w-3" />}
            {project.privacy}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          {project.users.length > 0 && (
            <div className="flex -space-x-2">
              {project.users.slice(0, 4).map((user) => (
                <Avatar
                  key={user.id}
                  className="h-7 w-7 border-2 border-background"
                  title={user.name}
                >
                  <AvatarImage src={user.image || ''} alt={user.name} />
                  <AvatarFallback>
                    <UserCircle2 className="h-7 w-7" />
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.users.length > 4 && (
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold text-muted-foreground"
                  title={`${project.users.length - 4} more`}
                >
                  +{project.users.length - 4}
                </div>
              )}
            </div>
          )}
          <Button
            variant="brand"
            size="sm"
            onClick={() => setShowShareForm(true)}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          {showShareForm && (
            <ProjectShareForm
              dialogOpen={showShareForm}
              setDialogOpen={setShowShareForm}
              project={project}
            />
          )}
        </div>
      </div>
    </>
  )
}
