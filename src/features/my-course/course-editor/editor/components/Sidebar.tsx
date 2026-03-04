import React from 'react'
import { useDraggable } from '@dnd-kit/core'

function DraggableItem({ id, label, data }: { id: string; label: string; data: Record<string, unknown> }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id, data })

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className='w-full rounded-lg border bg-white px-3 py-2 text-left text-sm text-gray-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50'
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      {label}
    </button>
  )
}

export function Sidebar() {
  return (
    <aside className='w-[280px] border-r bg-gray-50 p-4'>
      <h3 className='mb-3 text-xs font-semibold uppercase text-gray-500'>Components</h3>
      <div className='space-y-2'>
        <DraggableItem id='drag-section' label='Section' data={{ type: 'sidebar-section' }} />
        <DraggableItem id='drag-content-page' label='Content Page' data={{ type: 'sidebar-content-page' }} />
        <DraggableItem id='drag-quiz-page' label='Quiz Page' data={{ type: 'sidebar-quiz-page' }} />
        <DraggableItem id='drag-content-block' label='Content Block' data={{ type: 'sidebar-content-block' }} />
      </div>

      <h3 className='mb-3 mt-8 text-xs font-semibold uppercase text-gray-500'>Question Types</h3>
      <div className='space-y-2'>
        <DraggableItem
          id='drag-mcq-single'
          label='MCQ Single'
          data={{ type: 'sidebar-question', questionType: 'MCQ_SINGLE' }}
        />
        <DraggableItem
          id='drag-mcq-multi'
          label='MCQ Multiple'
          data={{ type: 'sidebar-question', questionType: 'MCQ_MULTI' }}
        />
        <DraggableItem
          id='drag-true-false'
          label='True / False'
          data={{ type: 'sidebar-question', questionType: 'TRUE_FALSE' }}
        />
      </div>
    </aside>
  )
}

