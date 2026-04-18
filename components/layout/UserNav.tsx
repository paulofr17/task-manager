'use client'

import { LogOut, Settings, UserCircle2 } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUserContext } from '@/context/UserContext'

export function UserNav() {
  const { data: session } = useSession()
  const { userList } = useUserContext()
  const user = userList.find((user) => user.email === session?.user?.email)
  const initials =
    user?.name
      ?.split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full p-0 ring-2 ring-transparent transition-all hover:ring-primary/30"
          title={user?.name}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || ''} alt={user?.name} />
            <AvatarFallback className="bg-brand-gradient text-xs font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.image || ''} alt={user?.name} />
              <AvatarFallback className="bg-brand-gradient text-xs font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-sm font-medium leading-none">
                {user?.name}
              </p>
              <p className="mt-1 truncate text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center gap-2">
            <UserCircle2 className="h-4 w-4 shrink-0" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <Settings className="h-4 w-4 shrink-0" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2 text-destructive focus:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
