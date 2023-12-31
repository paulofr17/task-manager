import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  // CircleIcon,
  CrossCircledIcon,
  // QuestionMarkCircledIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons'

// export const labels = [
//   {
//     value: 'bug',
//     label: 'Bug',
//   },
//   {
//     value: 'feature',
//     label: 'Feature',
//   },
//   {
//     value: 'documentation',
//     label: 'Documentation',
//   },
// ]

export const statuses = [
  // {
  //   value: 'backlog',
  //   label: 'Backlog',
  //   icon: QuestionMarkCircledIcon,
  // },
  // {
  //   value: 'todo',
  //   label: 'Todo',
  //   icon: CircleIcon,
  // },
  {
    value: 'Upcoming',
    label: 'Upcoming',
    icon: StopwatchIcon,
  },
  {
    value: 'Completed',
    label: 'Completed',
    icon: CheckCircledIcon,
  },
  {
    value: 'Overdue',
    label: 'Overdue',
    icon: CrossCircledIcon,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'Low',
    icon: ArrowDownIcon,
  },
  {
    label: 'Medium',
    value: 'Medium',
    icon: ArrowRightIcon,
  },
  {
    label: 'High',
    value: 'High',
    icon: ArrowUpIcon,
  },
]
