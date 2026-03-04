import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import type { Section } from '../types/course'
import { useCourseStore } from '../store/useCourseStore'
import { PageView } from './PageView'

export function SectionView({ section }: { section: Section }) {
  const selectElement = useCourseStore((s) => s.selectElement)
  const selected = useCourseStore((s) => s.selectedElement)
  const droppableData = React.useMemo(() => ({ type: 'section-drop', sectionId: section.id }), [section.id])
  const { setNodeRef, isOver } = useDroppable({
    id: `section-drop-${section.id}`,
    data: droppableData
  })

  return (
    <section
      ref={setNodeRef}
      onClick={() => selectElement({ kind: 'section', id: section.id })}
      className={`border border-transparent bg-white p-6 shadow-sm transition ${selected?.id === section.id ? 'ring-2 ring-blue-500' : 'hover:border-gray-200'} ${isOver ? 'ring-2 ring-blue-400' : ''}`}
    >
      <div className='mb-5'>
        <h3 className='text-base font-semibold text-gray-900'>{section.title}</h3>
        <p className='text-sm text-gray-500'>{section.description || 'No description'}</p>
      </div>
      <div className='space-y-4'>
        {section.pages.map((page, idx) => (
          <PageView key={page.id} page={page} sectionId={section.id} pageIndex={idx} />
        ))}
      </div>
    </section>
  )
}
