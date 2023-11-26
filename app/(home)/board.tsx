'use client'

import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { useEffect, useState } from 'react'
import { Column } from './column'
import { BoardWithColumns } from '@/models/types'
import { changeColumnsOrder } from '@/actions/column'
import { changeIssuesOrder } from '@/actions/issue'
import { AddColumn } from './addColumn'

interface BoardProps {
  board: BoardWithColumns
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export function Board({ board }: BoardProps) {
  useEffect(() => setBoardState(board), [board])
  const [boardState, setBoardState] = useState(board)
  // Set Board State with board fetched from DB is different from boardState

  const handleOnDragEnd = async (dropResult: DropResult) => {
    const { destination, source, type } = dropResult

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    if (type === 'issue') onDragIssue(dropResult)
    else if (type === 'column') onDragColumn(dropResult)
  }

  const onDragIssue = async (dropResult: DropResult) => {
    const { source, destination } = dropResult

    if (!destination) return

    // Clone [object] to avoid mutating state
    const columns = [...boardState.columns]

    // Source and destination list
    const sourceColumn = columns.find((list) => list.id === source.droppableId)
    const destColumn = columns.find((list) => list.id === destination.droppableId)

    if (!sourceColumn || !destColumn) {
      return
    }

    // Move to the same column
    if (source.droppableId === destination?.droppableId) {
      // Update order
      sourceColumn.issues = reorder(sourceColumn.issues, source.index, destination.index).map(
        (issue, index) => ({
          ...issue,
          order: index,
        }),
      )
      // Set UI state and update DB
      const newBoardState = { ...boardState, columns }
      setBoardState(newBoardState)
      await changeIssuesOrder(sourceColumn.issues)
    }
    // Move to another column
    else {
      const [removed] = sourceColumn.issues.splice(source.index, 1)
      removed.columnId = destColumn.id
      destColumn.issues.splice(destination.index, 0, removed)
      // Update order
      sourceColumn.issues = sourceColumn.issues.map((issue, index) => ({ ...issue, order: index }))
      destColumn.issues = destColumn.issues.map((issue, index) => ({ ...issue, order: index }))
      // Set UI state and update DB
      const newBoardState = { ...boardState, columns }
      setBoardState(newBoardState)
      await changeIssuesOrder(destColumn.issues)
    }
  }

  const onDragColumn = async (dropResult: DropResult) => {
    const { destination, source, draggableId } = dropResult

    if (!destination) return

    const newColumnOrder = reorder(boardState.columns, source.index, destination.index).map(
      (column, index) => ({ ...column, order: index }),
    )
    // Set UI state and update DB
    setBoardState({ ...boardState, columns: newColumnOrder })
    await changeColumnsOrder(newColumnOrder)
  }
  return (
    <DragDropContext onDragEnd={(dropResult) => handleOnDragEnd(dropResult)}>
      <Droppable droppableId="column" direction="horizontal" type="column">
        {(provided) => (
          // <div className="flex h-full w-[calc(100vw_-_62px)] max-w-[1630px] overflow-auto pb-2 md:w-[calc(100vw_-_82px)] lg:w-[calc(100vw_-_296px)]">
          // <div className="flex h-[calc(100vh_-_148px)] w-[calc(100vw_-_62px)] overflow-x-auto overflow-y-hidden md:w-[calc(100vw_-_82px)] lg:w-[calc(100vw_-_296px)]">
          <ol
            className="firefoxScroll mt-4 flex flex-1 gap-1 overflow-auto sm:gap-2"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {boardState.columns.map((column, index) => (
              <Column key={column.id} column={column} index={index} board={boardState} />
            ))}
            {provided.placeholder}
            <AddColumn boardId={boardState.id} />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  )
}
