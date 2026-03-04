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
      className={`rounded-2xl border bg-white p-4 ${selected?.id === section.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} ${isOver ? 'border-dashed border-blue-400 bg-blue-50/30' : ''}`}
    >
      <div className='mb-4'>
        <h3 className='text-base font-bold text-gray-900'>{section.title}</h3>
        <p className='text-xs text-gray-500'>{section.description || 'No description'}</p>
      </div>
      <div className='space-y-3'>
        {section.pages.map((page, idx) => (
          <PageView key={page.id} page={page} sectionId={section.id} pageIndex={idx} />
        ))}
      </div>
    </section>
  )
}
