'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CalendarIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import { priorities, statuses } from '../_data/data'
import { Task } from '../_data/schema'
import { DataTableColumnHeader } from './DataTableColumnHeader'

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span
            className="max-w-[500px] truncate text-sm font-medium"
            title={row.getValue('description')}
          >
            {row.getValue('description')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status'),
      )

      if (!status) {
        return null
      }

      return (
        <Badge variant={status.variant} className="font-medium">
          {status.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue('priority'),
      )

      if (!priority) {
        return null
      }

      return (
        <Badge variant={priority.variant} className="font-medium">
          {priority.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const raw = row.getValue('dueDate') as string
      if (!raw) {
        return (
          <span className="text-sm text-muted-foreground">No due date</span>
        )
      }
      const date = new Date(raw)
      const isOverdue = date < new Date()
      return (
        <div
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium',
            isOverdue
              ? 'border-status-blocked/30 bg-status-blocked-soft text-status-blocked-foreground'
              : 'border-border bg-muted/50 text-muted-foreground',
          )}
          title={raw}
        >
          <CalendarIcon className="h-3 w-3" />
          {date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          })}
        </div>
      )
    },
  },
]
