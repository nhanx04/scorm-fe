import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { useCourseStore } from '../store/useCourseStore'
import { SectionView } from './SectionView'

export function Canvas() {
  const course = useCourseStore((s) => s.course)
  const selectElement = useCourseStore((s) => s.selectElement)

  const droppableData = React.useMemo(() => ({ type: 'canvas' }), [])
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-root', data: droppableData })

  return (
    <main className='flex-1 overflow-y-auto bg-gray-50 p-8'>
      <div className='mx-auto max-w-5xl'>
        <div
          ref={setNodeRef}
          onClick={() => selectElement({ kind: 'course', id: 'course-root' })}
          className={`min-h-[600px] bg-white p-6 shadow-sm transition ${isOver ? 'ring-2 ring-blue-400' : ''}`}
        >
          {course.sections.length === 0 ? (
            <div className='flex h-[520px] items-center justify-center text-lg font-medium text-gray-300'>
              Course Content Canvas Area
            </div>
          ) : (
            <div className='space-y-8'>
              {course.sections.map((section) => (
                <SectionView key={section.id} section={section} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
