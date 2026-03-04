import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { GripVertical } from 'lucide-react'
import { useCourseStore } from '../store/useCourseStore'
import type { Block } from '../types/course'
import { buildLayoutStyle, buildThemeStyle } from './theme'

export function BlockView({ block, pageId, blockIndex }: { block: Block; pageId: string; blockIndex: number }) {
  const selectElement = useCourseStore((s) => s.selectElement)
  const selectedBlockId = useCourseStore((s) => s.selectedBlockId)
  const setSelectedBlockId = useCourseStore((s) => s.setSelectedBlockId)
  const toggleElementSelection = useCourseStore((s) => s.toggleElementSelection)
  const lockedElementIds = useCourseStore((s) => s.lockedElementIds)
  const dragData = React.useMemo(() => ({ type: 'block', pageId, sectionId: String(blockIndex) }), [pageId, blockIndex])
  const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({
    id: block.id,
    data: dragData
  })

  return (
    <div
      ref={setNodeRef}
      onClick={(event) => {
        event.stopPropagation()
        setSelectedBlockId(block.id)
        selectElement({ kind: 'block', id: block.id, pageId })
        if (event.shiftKey) toggleElementSelection(block.id)
      }}
      className={`rounded-2xl border border-transparent bg-white p-6 shadow-sm transition ${selectedBlockId === block.id ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'}`}
      style={{
        ...buildThemeStyle(block.themeOverride),
        ...buildLayoutStyle(block.layoutMode, block.layoutMeta),
        transform:
          (transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : '') +
          (typeof block.layoutMeta?.rotation === 'number' ? ` rotate(${block.layoutMeta.rotation}deg)` : ''),
        opacity: isDragging ? 0.7 : 1,
        pointerEvents: lockedElementIds.includes(block.id) ? 'none' : 'auto'
      }}
    >
      <div className='mb-3 flex items-center justify-between'>
        {/* <span className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Content block</span> */}
        <button
          type='button'
          onClick={(event) => event.stopPropagation()}
          {...listeners}
          {...attributes}
          className='cursor-move rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600'
        >
          <GripVertical className='h-4 w-4' />
        </button>
      </div>
      <div className='prose prose-sm max-w-none text-gray-700' dangerouslySetInnerHTML={{ __html: block.textHtml }} />
    </div>
  )
}
