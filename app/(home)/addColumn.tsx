'use client'

import { createColumn } from '@/actions/column'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toaster } from '@/lib/toaster'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface AddColumnProps {
  boardId: string
}

export function AddColumn({ boardId }: AddColumnProps) {
  const [edit, setEdit] = useState(false)

  const AddColumnSchema = z.object({
    column: z.string().min(2, {
      message: 'Column name must have at least 2 characters.',
    }),
  })

  const form = useForm<z.infer<typeof AddColumnSchema>>({
    resolver: zodResolver(AddColumnSchema),
    defaultValues: {
      column: '',
    },
  })

  async function onSubmit(data: z.infer<typeof AddColumnSchema>) {
    const column = await createColumn(data.column, boardId)
    if (column.data) {
      toaster('success', `Column ${column.data?.name} successfully created`)
    } else {
      toaster('error', `Error creating column`)
    }
    form.reset()
    setEdit(false)
  }

  if (edit)
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-fit w-72 flex-shrink-0 flex-col gap-2 rounded-lg bg-gray-100 p-2"
        >
          <FormField
            control={form.control}
            name="column"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter Column Name"
                    className="h-9 border-purple-500 focus:border-purple-650 focus-visible:ring-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <div className="flex w-full gap-2">
            <Button
              type="submit"
              className="h-8 w-24 bg-purple-650 text-sm text-white hover:bg-purple-650/50"
            >
              Create
            </Button>
            <button
              className="flex h-8 w-7 items-center justify-center rounded-md hover:bg-zinc-200"
              onClick={() => {
                form.reset()
                setEdit(false)
              }}
            >
              <X size={24} />
            </button>
          </div>
        </form>
      </Form>
    )

  return (
    <button
      className="flex h-8 w-36 flex-shrink-0 items-center justify-center gap-2 rounded-lg border border-purple-650 text-sm font-semibold text-purple-650 hover:bg-purple-650 hover:text-white"
      onClick={() => {
        setEdit(true)
      }}
    >
      Add column
      <Plus size={20} />
    </button>
  )
}
