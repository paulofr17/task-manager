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
  FormDescription,
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

export function AddTask({
  openDialog,
}: {
  openDialog: (open: boolean) => void
}) {
  const formSchema = z.object({
    description: z
      .string()
      .min(2, { message: 'Task description is too short' }),
    steps: z.coerce
      .number({
        required_error: 'Number of task steps is required',
      })
      .min(1, { message: 'Must have at least 1 step' }),
    priority: z.string({
      required_error: 'Please select task priority',
    }),
    duration: z.coerce
      .number({
        required_error: 'Task duration is required',
      })
      .min(1, { message: 'Must be greater than 0' }),
    durationUnit: z.enum(['d', 'h']),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      durationUnit: 'd',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    openDialog(false)
  }

  return (
    <DialogContent className="w-full max-w-sm">
      <DialogHeader>
        <DialogTitle className="text-center text-black">
          Create Task
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
                  <Textarea placeholder="Task description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="steps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Steps</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Number of steps"
                    {...field}
                  />
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
                        <SelectValue placeholder="Select task priority" />
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
                  <FormLabel>Task duration</FormLabel>
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
                          <SelectValue placeholder="Select task duration unit" />
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
