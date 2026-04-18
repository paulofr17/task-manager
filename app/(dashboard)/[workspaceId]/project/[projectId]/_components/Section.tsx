'use client'

import { Droppable, Draggable, DroppableStateSnapshot } from '@hello-pangea/dnd'

import { SectionWithTasks } from '@/types/types'
import { cn } from '@/lib/utils'
import { SectionMenu } from './SectionMenu'
import { Task } from './Task'
import { AddTask } from './AddTask'
import { SectionNameForm } from './SectionNameForm'

interface ColumnProps {
  section: SectionWithTasks
  index: number
}

const HUES = [210, 260, 330, 150, 30, 190, 290, 100]
const hashHue = (id: string) =>
  HUES[id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length]

export function Section({ section, index }: ColumnProps) {
  const hue = hashHue(section.id)

  const droppableBg = (snapshot: DroppableStateSnapshot) =>
    snapshot.isDraggingOver ? 'bg-accent/50' : ''

  return (
    <Draggable key={section.id} draggableId={section.id} index={index}>
      {(provided, snapshot) => (
        <li
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={cn('h-full', snapshot.isDragging && 'opacity-90')}
        >
          <div
            className={cn(
              'flex h-full w-72 shrink-0 flex-col overflow-hidden rounded-xl border bg-card shadow-soft',
              snapshot.isDragging && 'shadow-elevated',
            )}
          >
            <div
              className="h-1 w-full shrink-0"
              style={{ backgroundColor: `hsl(${hue} 75% 55%)` }}
            />
            <Droppable droppableId={section.id} type="task">
              {(provided, snapshot) => (
                <div
                  className={cn(
                    'mb-auto flex h-full flex-col gap-2 p-2 transition-colors',
                    droppableBg(snapshot),
                  )}
                  key={section.id}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div className="flex h-8 flex-shrink-0 items-center justify-between gap-1">
                    <div className="flex h-full min-w-0 flex-1 items-center gap-2 overflow-hidden">
                      <SectionNameForm section={section} />
                      <span
                        className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold"
                        style={{
                          backgroundColor: `hsl(${hue} 75% 92%)`,
                          color: `hsl(${hue} 70% 30%)`,
                        }}
                      >
                        {section.tasks.length}
                      </span>
                    </div>
                    <div className="flex shrink-0 gap-0.5">
                      <AddTask section={section} />
                      <SectionMenu section={section} />
                    </div>
                  </div>
                  <ol className="flex flex-auto flex-col gap-2 overflow-y-auto pb-1">
                    {section.tasks.map((task, index) => (
                      <Task key={task.id} task={task} index={index} />
                    ))}
                  </ol>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </li>
      )}
    </Draggable>
  )
}
