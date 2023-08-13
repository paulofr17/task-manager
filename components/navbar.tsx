import { Clock4, MessageCircle } from 'lucide-react'
import { SearchBar } from './searchbar'
import { Button } from './ui/button'

export function Navbar() {
  return (
    <div className="flex h-24 items-center justify-between border-b-2 border-b-zinc-100 pt-4">
      <SearchBar />
      <div className="flex items-center space-x-2">
        <button>
          <MessageCircle
            size={20}
            className="text-zinc-400 hover:text-purple-650"
          />
        </button>
        <button>
          <Clock4 size={20} className="text-zinc-400 hover:text-purple-650" />
        </button>
        <Button
          variant="outline"
          className="h-7 border-purple-650 text-purple-650 transition hover:bg-purple-650 hover:text-white"
        >
          <span className="text-xs">Share</span>
        </Button>
      </div>
    </div>
  )
}
