'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/app/(dashboard)/[workspaceId]/my-tasks/_components/DataTableViewOptions'

import { priorities, statuses } from '../_data/data'
import { DataTableFacetedFilter } from './DataTableFacetedFilter'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={
              (table.getColumn('description')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('description')?.setFilterValue(event.target.value)
            }
            className="h-9 w-[180px] rounded-full pl-9 lg:w-[280px]"
          />
        </div>
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn('priority') && (
          <DataTableFacetedFilter
            column={table.getColumn('priority')}
            title="Priority"
            options={priorities}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-2 text-muted-foreground hover:text-foreground lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
