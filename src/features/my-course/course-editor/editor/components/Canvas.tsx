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
    <main className='flex-1 overflow-y-auto bg-gray-100 p-6'>
      <div className='mx-auto max-w-5xl'>
        <div
          ref={setNodeRef}
          onClick={() => selectElement({ kind: 'course', id: 'course-root' })}
          className={`min-h-[600px] rounded-2xl border-2 border-dashed p-6 transition ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'}`}
        >
          {course.sections.length === 0 ? (
            <div className='flex h-[520px] items-center justify-center text-lg font-medium text-gray-300'>
              Course Content Canvas Area
            </div>
          ) : (
            <div className='space-y-4'>
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
