import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { useCourseStore } from '../store/useCourseStore'
import type { Block } from '../types/course'
import { TipTapEditor } from './TipTapEditor'

export function BlockView({ block, pageId, blockIndex }: { block: Block; pageId: string; blockIndex: number }) {
  const selectElement = useCourseStore((s) => s.selectElement)
  const selected = useCourseStore((s) => s.selectedElement)
  const updateElement = useCourseStore((s) => s.updateElement)
  const dragData = React.useMemo(() => ({ type: 'block', pageId, sectionId: String(blockIndex) }), [pageId, blockIndex])
  const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({
    id: block.id,
    data: dragData
  })

  return (
    <div
      ref={setNodeRef}
      onClick={() => selectElement({ kind: 'block', id: block.id, pageId })}
      className={`rounded-md border bg-white p-3 ${selected?.id === block.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.7 : 1
      }}
    >
      <div className='mb-2 flex items-center justify-between'>
        <span className='text-xs font-medium text-gray-500'>Content block</span>
        <button
          type='button'
          {...listeners}
          {...attributes}
          className='cursor-move rounded border px-2 py-1 text-xs text-gray-600 hover:bg-gray-50'
        >
          Drag
        </button>
      </div>
      <TipTapEditor value={block.textHtml} onChange={(html) => updateElement(block.id, { textHtml: html })} />
    </div>
  )
}
