import React from 'react'
import { useDroppable, useDraggable } from '@dnd-kit/core'
import { useCourseStore } from '../store/useCourseStore'
import type { Page } from '../types/course'
import { BlockView } from './BlockView'
import { QuizBuilder } from './QuizBuilder'

export function PageView({ page, sectionId, pageIndex }: { page: Page; sectionId: string; pageIndex: number }) {
  const selectElement = useCourseStore((s) => s.selectElement)
  const selected = useCourseStore((s) => s.selectedElement)
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `page-drop-${page.id}`,
    data: { type: 'page-drop', pageId: page.id, sectionId }
  })

  const {
    setNodeRef: setDragRef,
    listeners,
    attributes,
    transform,
    isDragging
  } = useDraggable({
    id: `page-${page.id}`,
    data: { type: 'page', pageId: String(pageIndex), sectionId }
  })

  const setRefs = (el: HTMLDivElement | null) => {
    setDropRef(el)
    setDragRef(el)
  }

  return (
    <div
      ref={setRefs}
      {...listeners}
      {...attributes}
      onClick={() => selectElement({ kind: 'page', id: page.id })}
      className={`border border-transparent bg-white p-6 transition ${selected?.id === page.id ? 'ring-2 ring-blue-500' : 'hover:border-gray-200'} ${isOver ? 'ring-2 ring-blue-400' : ''}`}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.5 : 1
      }}
    >
      <div className='mb-4 flex items-center justify-between'>
        <h4 className='text-sm font-semibold text-gray-800'>{page.title}</h4>
        <span className='rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600'>{page.pageType}</span>
      </div>

      {page.pageType === 'CONTENT' ? (
        <div className='space-y-4'>
          {page.contentPage?.blocks.map((block, idx) => (
            <BlockView key={block.id} block={block} pageId={page.id} blockIndex={idx} />
          ))}
          {page.contentPage && page.contentPage.blocks.length === 0 ? (
            <p className='rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-400'>
              Drag content block here
            </p>
          ) : null}
        </div>
      ) : (
        <QuizBuilder page={page} />
      )}
    </div>
  )
}
