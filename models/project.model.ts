type Column = {
  id: string
  title: string
  issueIds: string[]
}

type IssuesOrder = {
  columns: Column[]
  columnOrder: string[]
}

type Project = {
  id: string
  name: string
  issues: Issue[]
  issuesOrder: IssuesOrder
}
