'use client'

import { Droppable, Draggable, DroppableStateSnapshot } from '@hello-pangea/dnd'

import { SectionWithTasks } from '@/types/types'
import { SectionMenu } from './SectionMenu'
import { Task } from './Task'
import { AddTask } from './AddTask'
import { SectionNameForm } from './SectionNameForm'

interface ColumnProps {
  section: SectionWithTasks
  index: number
}

export function Section({ section, index }: ColumnProps) {
  const sectionColor = (snapshot: DroppableStateSnapshot) => {
    return snapshot.isDraggingOver ? 'bg-muted-foreground/10' : 'bg-primary-foreground'
  }
  return (
    <Draggable key={section.id} draggableId={section.id} index={index}>
      {(provided, snapshot) => (
        <li
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`flex h-full items-center rounded-lg border ${
            snapshot.isDragging ? 'rounded-lg opacity-80 shadow-lg' : 'opacity-100'
          }`}
        >
          <Droppable droppableId={section.id} type="task">
            {(provided, snapshot) => (
              <div
                className={`${sectionColor(
                  snapshot,
                )} mb-auto flex h-full w-72 shrink-0 flex-col gap-2 rounded-lg p-1`}
                key={section.id}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <div className="flex h-8 flex-shrink-0 items-center justify-between gap-1">
                  <div className="flex h-full items-center gap-2 overflow-hidden pl-1 text-xs">
                    <SectionNameForm section={section} />
                    <div className="flex h-5 w-5 shrink-0 rounded-full bg-zinc-300 text-xs font-bold text-primary dark:bg-gray-700">
                      <p className="m-auto">{section.tasks.length}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <AddTask section={section} />
                    <SectionMenu section={section} />
                  </div>
                </div>
                <ol className="flex flex-auto flex-col gap-1 overflow-y-auto px-1">
                  {section.tasks.map((task, index) => (
                    <Task key={task.id} task={task} index={index} />
                  ))}
                </ol>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </li>
      )}
    </Draggable>
  )
}
