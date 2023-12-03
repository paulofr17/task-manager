import { Board, Column, Issue, Project, Task, User } from '@prisma/client'

export type IssueWithTasks = Issue & { tasks: Task[] }

export type ColumnWithIssues = Column & { issues: IssueWithTasks[] }

export type BoardWithColumns = Board & { columns: ColumnWithIssues[] } & { users: User[] }

export type ProjectWithBoards = Project & { boards: BoardWithColumns[] }
