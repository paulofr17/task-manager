import { User, Workspace, Project, Section, Task, SubTask } from '@prisma/client'

export type TasksWithSubTasks = Task & { subTasks: SubTask[] }

export type SectionWithTasks = Section & { tasks: TasksWithSubTasks[] }

export type ProjectWithSections = Project & { users: User[] } & { sections: SectionWithTasks[] }

export type WorkspaceWithUsers = Workspace & { users: User[] }

export type WorkspaceWithProjectsUsers = Workspace & { users: User[] } & {
  projects: ProjectWithSections[]
}
