import { Inbox } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function InboxPage() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-soft">
        <Inbox className="h-10 w-10" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold tracking-tight">
        Your inbox is empty
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Notifications, mentions, and assigned task updates will show up here as
        your team gets to work.
      </p>
      <div className="mt-6 flex items-center gap-2">
        <Button variant="brand" size="sm" disabled>
          Configure notifications
        </Button>
        <Button variant="ghost" size="sm" disabled>
          Learn more
        </Button>
      </div>
    </div>
  )
}
