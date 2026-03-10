import React from 'react'
import { useDraggable } from '@dnd-kit/core'
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
      {...listeners}
      {...attributes}
      onClick={(event) => {
        event.stopPropagation()
        setSelectedBlockId(block.id)
        selectElement({ kind: 'block', id: block.id, pageId })
        if (event.shiftKey) toggleElementSelection(block.id)
      }}
      className={`cursor-move rounded-2xl border border-transparent bg-white p-6 shadow-sm transition ${selectedBlockId === block.id ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'}`}
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
      <div className='prose prose-sm max-w-none text-gray-700' dangerouslySetInnerHTML={{ __html: block.textHtml }} />
    </div>
  )
}
