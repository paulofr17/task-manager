import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons'

export const statuses = [
  {
    value: 'Upcoming',
    label: 'Upcoming',
    icon: StopwatchIcon,
    variant: 'status-progress' as const,
  },
  {
    value: 'Completed',
    label: 'Completed',
    icon: CheckCircledIcon,
    variant: 'status-done' as const,
  },
  {
    value: 'Overdue',
    label: 'Overdue',
    icon: CrossCircledIcon,
    variant: 'status-blocked' as const,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'Low',
    icon: ArrowDownIcon,
    variant: 'priority-low' as const,
  },
  {
    label: 'Medium',
    value: 'Medium',
    icon: ArrowRightIcon,
    variant: 'priority-medium' as const,
  },
  {
    label: 'High',
    value: 'High',
    icon: ArrowUpIcon,
    variant: 'priority-high' as const,
  },
]
