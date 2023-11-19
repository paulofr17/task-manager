import { Plus, MoreHorizontal } from 'lucide-react'
import { Droppable, Draggable, DroppableStateSnapshot } from '@hello-pangea/dnd'
import { Issue } from './issue'
import { useState } from 'react'
import { AddIssue } from './addIssue'
import { BoardWithColumns, ColumnWithIssues } from '@/models/types'

interface ColumnProps {
  column: ColumnWithIssues
  index: number
  board: BoardWithColumns
}

export function Column({ column, index, board }: ColumnProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const columnColor = (snapshot: DroppableStateSnapshot) => {
    return snapshot.isDraggingOver ? 'bg-zinc-200' : 'bg-zinc-100'
  }
  return (
    <Draggable key={column.id} draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`${
            snapshot.isDragging ? 'rounded-lg bg-zinc-200 opacity-80 shadow-lg' : 'opacity-100'
          }`}
        >
          <Droppable droppableId={column.id} type="issue">
            {(provided, snapshot) => (
              <div
                className={`${columnColor(
                  snapshot,
                )} mb-auto flex w-72 flex-col gap-2 rounded-lg px-2 py-2`}
                key={column.id}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-zinc-500">
                    <span className="pl-2 text-base font-medium text-black">{column.name}</span>
                    <div className="flex h-5 w-5 rounded-full bg-zinc-500 text-xs font-bold text-white">
                      <p className="m-auto">{column.issues.length}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1 text-xs text-zinc-500">
                    <button onClick={() => setDialogOpen(true)}>
                      <Plus size={18} />
                    </button>
                    <AddIssue
                      columns={board.columns}
                      dialogOpen={dialogOpen}
                      setDialogOpen={setDialogOpen}
                    />
                    <button className="text-xl">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
                {column.issues.map((issue, index) => (
                  <Issue key={issue.id} issue={issue} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}
