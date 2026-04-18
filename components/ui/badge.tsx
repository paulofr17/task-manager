import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'text-foreground',
        soft: 'border-transparent bg-accent text-accent-foreground',

        'status-todo':
          "border-transparent bg-status-todo-soft text-status-todo-foreground before:content-[''] before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-status-todo",
        'status-progress':
          "border-transparent bg-status-progress-soft text-status-progress-foreground before:content-[''] before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-status-progress",
        'status-done':
          "border-transparent bg-status-done-soft text-status-done-foreground before:content-[''] before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-status-done",
        'status-blocked':
          "border-transparent bg-status-blocked-soft text-status-blocked-foreground before:content-[''] before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-status-blocked",

        'priority-low':
          "border-transparent bg-priority-low-soft text-priority-low-foreground before:content-[''] before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-priority-low",
        'priority-medium':
          "border-transparent bg-priority-medium-soft text-priority-medium-foreground before:content-[''] before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-priority-medium",
        'priority-high':
          "border-transparent bg-priority-high-soft text-priority-high-foreground before:content-[''] before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-priority-high",
        'priority-urgent':
          "border-transparent bg-priority-urgent-soft text-priority-urgent-foreground before:content-[''] before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-priority-urgent",
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
