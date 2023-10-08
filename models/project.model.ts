type Columns = {
  id: string
  title: string
  issueIds: string[]
}

type IssuesOrder = {
  columns: Columns[]
  columnOrder: string[]
}

type Project = {
  id: string
  name: string
  issues: Issue[]
  issuesOrder: IssuesOrder
}
