'use client'

import { DragDropContext, Droppable, DropResult, resetServerContext } from 'react-beautiful-dnd'
import { changeColumnOrder, changeIssueOrder } from '@/actions/serverActions'
import { useEffect, useState } from 'react'
import { Column } from './column'

interface BoardProps {
  project: Project
}

export function Board({ project }: BoardProps) {
  resetServerContext()

  useEffect(() => setProjectState(project), [project])
  const [projectState, setProjectState] = useState(project)

  const handleOnDragEnd = async (dropResult: DropResult) => {
    const { destination, source, type } = dropResult

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    if (type === 'issue') onDragIssue(dropResult)
    else if (type === 'column') onDragColumn(dropResult)
  }

  const onDragIssue = async (dropResult: DropResult) => {
    const { destination, draggableId } = dropResult
    // Clone [object] to avoid mutating state
    const newIssueOrder = projectState.issuesOrder.columns.map((column) => {
      return {
        ...column,
        issueIds: [...column.issueIds],
      }
    })
    // Change issue order
    newIssueOrder.forEach((column) => {
      column.issueIds = column.issueIds.filter((issueId) => issueId !== draggableId)
      if (column.id === destination?.droppableId) {
        column.issueIds.splice(destination.index, 0, draggableId)
      }
    })
    // Construct new state
    const newState = {
      ...projectState,
      issuesOrder: {
        ...projectState.issuesOrder,
        columns: newIssueOrder,
      },
    }
    // Set UI state and update DB
    setProjectState(newState)
    await changeIssueOrder(dropResult, projectState.id)
  }

  const onDragColumn = async (dropResult: DropResult) => {
    const { destination, source, draggableId } = dropResult

    if (!destination) return
    // Clone [object] to avoid mutating state
    const oldColumnOrder = [...projectState.issuesOrder.columnOrder]
    const newColumnOrder = [...projectState.issuesOrder.columnOrder]
    newColumnOrder.splice(source.index, 1)
    newColumnOrder.splice(destination.index, 0, draggableId)

    // Construct new state
    const newState = {
      ...projectState,
      issuesOrder: {
        ...projectState.issuesOrder,
        columnOrder: newColumnOrder,
      },
    }
    // Set UI state and update DB
    setProjectState(newState)
    await changeColumnOrder(dropResult, projectState.id, oldColumnOrder)
  }

  return (
    <DragDropContext onDragEnd={(dropResult) => handleOnDragEnd(dropResult)}>
      <Droppable droppableId="column" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="mt-4 grid grid-cols-4 items-start justify-start gap-1 sm:gap-2 md:gap-4"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {projectState.issuesOrder.columnOrder.map((statusId, index) =>
              projectState.issuesOrder.columns
                .filter((column) => column.id === statusId)
                .map((column) => (
                  <Column key={column.id} column={column} index={index} project={projectState} />
                )),
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
