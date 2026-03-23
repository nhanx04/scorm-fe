import React, { useState } from 'react'
import AddBlockToolbar from './AddBlockToolbar'
import { DndContext } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Block, EditorState, Page } from '../../../types/editor.types'
import { useCourseEditorStore } from '../../../store/use-course-editor-store'
import BlockItem from './BlockItem'

type BlockListProps = {
  page: Page
}

const BlockList: React.FC<BlockListProps> = ({ page }) => {
  const reorderBlocks = useCourseEditorStore((state) => state.reorderBlocks)
  const blockIds = useCourseEditorStore((state: EditorState) => state.blockOrder[page.id] ?? [])
  const blockMap = useCourseEditorStore((state: EditorState) => state.blocks)
  const blocks = blockIds.map((id: string) => blockMap[id]).filter(Boolean) as Block[]
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    reorderBlocks(page.id, String(active.id), String(over.id))
  }

  if (blocks.length === 0) {
    return (
      <div className='rounded-xl border border-dashed border-gray-300 p-2 text-sm text-gray-500'>
        <p className='mb-3'>Start building your content...</p>
        <AddBlockToolbar page={page} className='opacity-100' onBlockAdded={(blockId) => setActiveBlockId(blockId)} />
      </div>
    )
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
        <div className='space-y-2'>
          {blocks.map((block, index) => (
            <BlockItem
              key={block.id}
              block={block}
              page={page}
              index={index}
              total={blocks.length}
              activeBlockId={activeBlockId}
              onSetActiveBlock={setActiveBlockId}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

export default BlockList
