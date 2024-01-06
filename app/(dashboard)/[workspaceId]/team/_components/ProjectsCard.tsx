'use client'

import Link from 'next/link'
import { Lock, UserCircle } from 'lucide-react'

import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ProjectWithSections } from '@/types/types'
import { CreateProject } from '@/app/(dashboard)/[workspaceId]/home/_components/CreateProject'
import { ProjectMenu } from './ProjectMenu'

interface ProjectsCardProps {
  workspaceId: string
  projects: ProjectWithSections[]
}

export function ProjectsCard({ projects, workspaceId }: ProjectsCardProps) {
  return (
    <Card className="mx-4 mt-4">
      <CardHeader>
        <div className="flex h-6 items-center justify-between">
          <CardTitle className="text-xl">{`Projects (${projects.length})`}</CardTitle>
          <CreateProject workspaceId={workspaceId} />
        </div>
      </CardHeader>
      <CardContent>
        {projects.map((project) => (
          <div key={project.id}>
            <Separator />
            <Link
              href={`/${project.workspaceId}/project/${project.id}}`}
              className="my-1 flex h-14 w-full items-center justify-between gap-1 truncate rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
            >
              <p className="flex flex-col gap-[2px] truncate text-base font-medium">
                <span className="truncate" title={project.name}>
                  {project.name}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {project.privacy === 'Private' && <Lock size={14} />} {project.privacy}
                </span>
              </p>
              <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
                {project.users.map((user) => (
                  <Avatar key={user.id} title={user.name} className="h-6 w-6">
                    <AvatarImage src={user.image || ''} className="rounded-full" />
                    <AvatarFallback>
                      <UserCircle className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                ))}
                <ProjectMenu project={project} />
              </div>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
