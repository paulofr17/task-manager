import {
  Circle,
  FolderMinus,
  ListTodo,
  LogOut,
  Mail,
  Settings,
  UserCircle2,
  Users2,
} from 'lucide-react'

export function Sidebar() {
  return (
    <div className="flex h-screen flex-col items-center px-4 pt-8">
      <div className="flex flex-1 flex-col items-center space-y-8">
        <Circle size={34} color="rgba(106,14,255,255)" strokeWidth={3} />
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
      <div className="flex flex-col items-center space-y-8 pb-6">
        <button>
          <UserCircle2
            size={24}
            strokeWidth={2}
            className="hover:text-purple-650"
          ></UserCircle2>
        </button>
        <button>
          <Settings
            size={24}
            strokeWidth={2}
            className="hover:text-purple-650"
          ></Settings>
        </button>
        <button>
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
