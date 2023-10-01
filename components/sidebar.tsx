'use client'

import {
  FolderMinus,
  ListTodo,
  LogOut,
  Mail,
  Settings,
  UserCircle2,
  Users2,
} from 'lucide-react'
import tm from '@/assets/tm.png'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

export function Sidebar() {
  const { data: session, status } = useSession()

  return (
    <div className="flex h-screen flex-col items-center border-r-2 border-r-zinc-100 px-1 pt-8 min-[400px]:px-3 lg:border-none">
      <div className="flex flex-1 flex-col items-center space-y-8">
        <Image src={tm.src} width={44} height={44} alt="Task Manager icon" />
        <button>
          <ListTodo
            size={24}
            strokeWidth={2}
            className="hover:text-purple-650"
          />
        </button>
        <button>
          <Mail
            size={24}
            strokeWidth={2}
            className="hover:text-purple-650"
          ></Mail>
        </button>
        <button>
          <Users2
            size={24}
            strokeWidth={2}
            className="hover:text-purple-650"
          ></Users2>
        </button>
        <button>
          <FolderMinus
            size={24}
            strokeWidth={2}
            className="hover:text-purple-650"
          ></FolderMinus>
        </button>
      </div>
      <div className="flex flex-col items-center space-y-8 pb-12">
        <button>
          {status === 'authenticated' && session?.user?.image ? (
            <img
              src={session?.user?.image}
              alt=""
              width={28}
              height={28}
              className="rounded-2xl hover:opacity-40"
            />
          ) : (
            <UserCircle2
              size={24}
              strokeWidth={2}
              className="hover:text-purple-650"
            ></UserCircle2>
          )}
        </button>
        <button>
          <Settings
            size={24}
            strokeWidth={2}
            className="hover:text-purple-650"
          ></Settings>
        </button>
        <button onClick={() => signOut()}>
          <LogOut
            size={24}
            strokeWidth={2}
            className="text-[rgba(245,89,89,255)] hover:opacity-40"
          ></LogOut>
        </button>
      </div>
    </div>
  )
}
