import { Board, Column, Issue, Project, Task } from '@prisma/client'

export type IssueWithTasks = Issue & { tasks: Task[] }

export type ColumnWithIssues = Column & { issues: IssueWithTasks[] }

export type BoardWithColumns = Board & { columns: ColumnWithIssues[] }

export type ProjectWithBoards = Project & { boards: BoardWithColumns[] }
