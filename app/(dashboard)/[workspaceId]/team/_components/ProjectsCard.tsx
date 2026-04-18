'use client'

import Link from 'next/link'
import { FolderKanban, Globe, Lock, UserCircle2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ProjectWithSections } from '@/types/types'
import { CreateProject } from '@/app/(dashboard)/[workspaceId]/home/_components/CreateProject'
import { ProjectMenu } from './ProjectMenu'

interface ProjectsCardProps {
  workspaceId: string
  projects: ProjectWithSections[]
}

const HUES = [210, 260, 330, 150, 30, 190, 290, 100]

function hueFromId(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return HUES[h % HUES.length]
}

export function ProjectsCard({ projects, workspaceId }: ProjectsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg">Projects</CardTitle>
          <p className="text-xs text-muted-foreground">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}{' '}
            in this workspace
          </p>
        </div>
        <CreateProject workspaceId={workspaceId} />
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center">
            <FolderKanban className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm font-medium">No projects yet</p>
            <p className="text-xs text-muted-foreground">
              Create a project to start organising your work.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {projects.map((project) => {
              const hue = hueFromId(project.id)
              const bg = `linear-gradient(135deg, hsl(${hue} 80% 55%), hsl(${(hue + 40) % 360} 80% 60%))`
              return (
                <Link
                  key={project.id}
                  href={`/${project.workspaceId}/project/${project.id}`}
                  className="group flex items-center justify-between gap-3 py-3 transition-colors"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white shadow-soft"
                      style={{ background: bg }}
                    >
                      <FolderKanban className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="truncate text-sm font-medium group-hover:text-primary"
                        title={project.name}
                      >
                        {project.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {project.privacy === 'Private' ? (
                          <Lock className="h-3 w-3" />
                        ) : (
                          <Globe className="h-3 w-3" />
                        )}
                        <span>{project.privacy}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    onClick={(event) => event.preventDefault()}
                  >
                    <div className="hidden items-center -space-x-2 sm:flex">
                      {project.users.slice(0, 4).map((user) => (
                        <Avatar
                          key={user.id}
                          title={user.name}
                          className="h-6 w-6 ring-2 ring-background"
                        >
                          <AvatarImage src={user.image || ''} />
                          <AvatarFallback>
                            <UserCircle2 className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.users.length > 4 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium ring-2 ring-background">
                          +{project.users.length - 4}
                        </div>
                      )}
                    </div>
                    <ProjectMenu project={project} />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
