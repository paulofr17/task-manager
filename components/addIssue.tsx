'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { revalidatePath } from 'next/cache'
import { revalidateHome } from '@/actions/serverActions'

export function AddIssue({
  openDialog,
}: {
  openDialog: (open: boolean) => void
}) {
  const formSchema = z.object({
    description: z
      .string()
      .min(2, { message: 'Issue description is too short' }),
    status: z.string({
      required_error: 'Please select issue status',
    }),
    priority: z.string({
      required_error: 'Please select issue priority',
    }),
    duration: z.coerce
      .number({
        required_error: 'Issue duration is required',
      })
      .min(1, { message: 'Must be greater than 0' }),
    durationUnit: z.enum(['d', 'h']),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'To Do',
      durationUnit: 'd',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    openDialog(false)
    const { description, status, priority, duration, durationUnit } = values
    const issue = {
      description,
      status,
      priority,
      duration: `${duration}${durationUnit}`,
    }
    const response = await fetch('/api/issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(issue),
    })
    const data = await response.json()
    revalidateHome()
  }

  return (
    <DialogContent className="w-full max-w-sm">
      <DialogHeader>
        <DialogTitle className="text-center text-black">
          Create Issue
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select issue status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="To Do">To Do</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="In Review">In Review</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                    <Input type="number" placeholder="Ex: 7" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue="d">
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
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
