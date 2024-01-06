'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NewProjectSchema, NewProjectType } from '@/actions/Project/CreateProject/schema'
import { createProject } from '@/actions/Project/CreateProject/action'

interface CreateProjectProps {
  workspaceId: string
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
}

export function CreateProjectForm({ workspaceId, dialogOpen, setDialogOpen }: CreateProjectProps) {
  const router = useRouter()

  async function handleNewProject(formData: NewProjectType) {
    const response = await createProject(formData)
    if (response.data) {
      toast.success(`Project '${response.data.name}' created`)
      router.push(`/${workspaceId}/project/${response.data.id}`)
    } else {
      toast.error(response.error || 'Error creating Project')
    }
    setDialogOpen(false)
    form.reset()
  }

  const form = useForm<NewProjectType>({
    resolver: zodResolver(NewProjectSchema),
    defaultValues: {
      privacy: 'Public',
      workspaceId,
    },
  })

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNewProject)} className="space-y-2">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>
                  <FormControl>
                    <Input id="projectName" placeholder="Project name" onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privacy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Privacy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="line-clamp-1 w-full truncate" aria-label="Privacy">
                        <SelectValue placeholder="Select privacy option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Public">
                        Public - All Workspace members can access
                      </SelectItem>
                      <SelectItem value="Private">
                        Private - Only Project members can access
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workspaceId"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>WorkspaceId</FormLabel>
                  <FormControl>
                    <Input id="workspaceId" defaultValue={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button type="reset" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
