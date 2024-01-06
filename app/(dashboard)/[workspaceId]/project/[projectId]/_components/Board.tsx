'use client'

import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'

import { changeSectionsOrder } from '@/actions/Section/ChangeSectionsOrder/action'
import { changeTasksOrder } from '@/actions/Task/ChangeTasksOrder/action'
import { ProjectWithSections } from '@/types/types'
import { AddSection } from './AddSection'
import { Section } from './Section'

interface BoardProps {
  board: ProjectWithSections
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

    if (type === 'task') onDragTask(dropResult)
    else if (type === 'section') onDragSection(dropResult)
  }

  const onDragTask = async (dropResult: DropResult) => {
    const { source, destination } = dropResult

    if (!destination) return

    // Clone [object] to avoid mutating state
    const sections = [...boardState.sections]

    // Source and destination list
    const sourceSection = sections.find((section) => section.id === source.droppableId)
    const destSection = sections.find((section) => section.id === destination.droppableId)

    if (!sourceSection || !destSection) {
      return
    }

    // Move to the same section
    if (source.droppableId === destination?.droppableId) {
      // Update order
      sourceSection.tasks = reorder(sourceSection.tasks, source.index, destination.index).map(
        (task, index) => ({
          ...task,
          order: index,
        }),
      )
      // Set UI state and update DB
      const newBoardState = { ...boardState, sections }
      setBoardState(newBoardState)
      await changeTasksOrder(sourceSection.tasks)
    }
    // Move to another section
    else {
      const [removed] = sourceSection.tasks.splice(source.index, 1)
      removed.sectionId = destSection.id
      destSection.tasks.splice(destination.index, 0, removed)
      // Update order
      sourceSection.tasks = sourceSection.tasks.map((task, index) => ({ ...task, order: index }))
      destSection.tasks = destSection.tasks.map((task, index) => ({ ...task, order: index }))
      // Set UI state and update DB
      const newBoardState = { ...boardState, sections }
      setBoardState(newBoardState)
      await changeTasksOrder(destSection.tasks)
    }
  }

  const onDragSection = async (dropResult: DropResult) => {
    const { destination, source } = dropResult

    if (!destination) return

    const newSectionOrder = reorder(boardState.sections, source.index, destination.index).map(
      (task, index) => ({ ...task, order: index }),
    )
    // Set UI state and update DB
    setBoardState({ ...boardState, sections: newSectionOrder })
    await changeSectionsOrder(newSectionOrder)
  }
  return (
    <DragDropContext onDragEnd={(dropResult) => handleOnDragEnd(dropResult)}>
      <Droppable droppableId="section" direction="horizontal" type="section">
        {(provided) => (
          <ol
            className="flex h-full gap-1 overflow-auto p-2 sm:gap-2"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {boardState.sections.map((section, index) => (
              <Section key={section.id} section={section} index={index} />
            ))}
            {provided.placeholder}
            <AddSection boardId={boardState.id} />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  )
}
