import { Board, Column, Issue, Task } from '@prisma/client'

export type IssueWithTasks = Issue & { tasks: Task[] }

export type ColumnWithIssues = Column & { issues: IssueWithTasks[] }

export type BoardWithColumns = Board & { columns: ColumnWithIssues[] }
