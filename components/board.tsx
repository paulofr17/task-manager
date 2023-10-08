'use client'

import { MoreHorizontal, Plus } from 'lucide-react'
import { BoardCard } from './boardcard'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  resetServerContext,
} from 'react-beautiful-dnd'
import { changeIssueOrder, revalidateHome } from '@/actions/serverActions'
import { useEffect, useState } from 'react'

interface BoardProps {
  project: Project
}

export function Board({ project }: BoardProps) {
  resetServerContext()

  useEffect(() => setBoard(project), [project])
  const [board, setBoard] = useState(project)

  const onDragEnd = async (dropResult: DropResult) => {
    const { destination, source, draggableId } = dropResult
    console.log(dropResult)
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    // Clone [object] to avoid mutating state
    const newColumnOrder = board.issuesOrder.columns.map((column) => {
      return {
        ...column,
        issueIds: [...column.issueIds],
      }
    })
    // Change issue order
    newColumnOrder.forEach((column) => {
      column.issueIds = column.issueIds.filter((issueId) => issueId !== draggableId)
      if (column.id === destination.droppableId) {
        column.issueIds.splice(destination.index, 0, draggableId)
      }
    })
    // Construct new state
    const newState = {
      ...board,
      issuesOrder: {
        ...board.issuesOrder,
        columns: newColumnOrder,
      },
    }
    // Set UI state and update DB
    setBoard(newState)
    await changeIssueOrder(dropResult, board.id)
  }

  return (
    <DragDropContext
      onDragStart={async () => await revalidateHome()}
      onDragEnd={(dropResult) => onDragEnd(dropResult)}
    >
      <div>
        <div className="mt-4 grid grid-cols-4 justify-start gap-1 sm:gap-2 md:gap-4">
          {board.issuesOrder.columnOrder.map((statusId) =>
            board.issuesOrder.columns
              .filter((column) => column.id === statusId)
              .map((status) => (
                <Droppable droppableId={status.id} key={status.id}>
                  {(provided) => (
                    <div
                      className="mb-auto flex w-72 flex-col gap-2 rounded-lg bg-zinc-100 px-2 py-2 xl:w-auto"
                      key={status.id}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-zinc-500">
                          <span className="pl-2 text-base font-medium text-black">
                            {status.title}
                          </span>
                          <div className="flex h-5 w-5 rounded-full bg-zinc-500 text-xs font-bold text-white">
                            <p className="m-auto">
                              {
                                project.issues.filter((issue) => issue.status === status.title)
                                  .length
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-1 text-xs text-zinc-500">
                          <button>
                            <Plus size={18} />
                          </button>
                          <button className="text-xl">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </div>
                      {status.issueIds.map((issueId, index) =>
                        board.issues
                          .filter((issue) => issue.id === issueId)
                          .map((issue) => (
                            <Draggable key={issue.id} draggableId={issue.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <BoardCard
                                    key={issue.id}
                                    id={issue.id}
                                    priority={issue.priority}
                                    description={issue.description}
                                    duration={issue.duration}
                                    tasks={issue.tasks}
                                  />
                                </div>
                              )}
                            </Draggable>
                          )),
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )),
          )}
        </div>
      </div>
    </DragDropContext>
  )
}
