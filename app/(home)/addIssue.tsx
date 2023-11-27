'use client'

import { useRef, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'
import { Button } from '../../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { createIssue } from '@/actions/issue'
import { addIssueSchema } from '@/lib/addIssueSchema'
import { ColumnWithIssues } from '@/models/types'
import { toaster } from '@/lib/toaster'

interface AddIssueProps {
  columns: ColumnWithIssues[]
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
}

const handleNotification = (status: string) => {
  if (status === 'success') {
    toaster('success', 'Issue successfully created')
  } else if (status === 'error') {
    toaster('error', 'Error creating issue')
  }
}

export function AddIssue({ columns, dialogOpen, setDialogOpen }: AddIssueProps) {
  const form = useForm<z.infer<typeof addIssueSchema>>({
    resolver: zodResolver(addIssueSchema),
    defaultValues: {
      durationUnit: 'd',
    },
  })
  const [pending, setPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // submit form
  async function onSubmit(values: z.infer<typeof addIssueSchema>) {
    // change button to pending status
    setPending(true)
    const issueFormData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      issueFormData.append(key, value.toString())
    })
    const result = await createIssue(issueFormData)
    setTimeout(() => handleNotification(result.status), 500)
    // reset form data and close dialog
    form.reset({}, { keepDefaultValues: true })
    setPending(false)
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="w-full max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-black">Create Issue</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 text-zinc-600"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Issue description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="column"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Column</FormLabel>
                  <FormControl>
                    <Select name="column" onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {columns.map((column) => (
                          <SelectItem key={column.id} value={column.id}>
                            {column.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Select name="priority" onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select issue priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="w-[50%]">
                    <FormLabel>Time to fix</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 7"
                        {...field}
                        min={0}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationUnit"
                render={({ field }) => (
                  <FormItem className="w-[50%]">
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue="d" name="durationUnit">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select issue duration unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="d">Days</SelectItem>
                          <SelectItem value="h">Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-purple-650 hover:bg-purple-650/70"
                disabled={pending}
              >
                {pending ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
