import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import type { Section } from '../types/course'
import { useCourseStore } from '../store/useCourseStore'
import { EditableText } from './EditableText'
import { PageView } from './PageView'
import { buildLayoutStyle, buildThemeStyle } from './theme'

export function SectionView({ section }: { section: Section }) {
  const selectElement = useCourseStore((s) => s.selectElement)
  const selected = useCourseStore((s) => s.selectedElement)
  const updateSection = useCourseStore((s) => s.updateSection)
  const toggleElementSelection = useCourseStore((s) => s.toggleElementSelection)
  const droppableData = React.useMemo(() => ({ type: 'section-drop', sectionId: section.id }), [section.id])
  const { setNodeRef, isOver } = useDroppable({
    id: `section-drop-${section.id}`,
    data: droppableData
  })

  return (
    <section
      ref={setNodeRef}
      onClick={(event) => {
        event.stopPropagation()
        selectElement({ kind: 'section', id: section.id })
        if (event.shiftKey) toggleElementSelection(section.id)
      }}
      className={`border border-transparent bg-white p-6 shadow-sm transition ${selected?.id === section.id ? 'ring-2 ring-blue-500' : 'hover:border-gray-200'} ${isOver ? 'ring-2 ring-blue-400' : ''}`}
      style={{
        ...buildThemeStyle(section.themeOverride),
        ...buildLayoutStyle(section.layoutMode, section.layoutMeta),
        minHeight: section.layoutMeta?.height ? `${section.layoutMeta.height}px` : 'auto',
        maxWidth: section.layoutMeta?.maxWidth ? `${section.layoutMeta.maxWidth}px` : undefined
      }}
    >
      <div className='mb-5 space-y-1'>
        <EditableText
          value={section.title}
          onSave={(newValue) => updateSection(section.id, { title: newValue })}
          className='text-base font-semibold text-gray-900'
          inputClassName='text-base font-semibold text-gray-900'
          placeholder='Section title'
        />
        <EditableText
          value={section.description || ''}
          onSave={(newValue) => updateSection(section.id, { description: newValue })}
          className='text-sm text-gray-500'
          inputClassName='text-sm text-gray-600'
          multiline
          placeholder='Section description'
        />
      </div>
      <div className='space-y-4'>
        {section.pages.map((page, idx) => (
          <PageView key={page.id} page={page} sectionId={section.id} pageIndex={idx} />
        ))}
      </div>
    </section>
  )
}
