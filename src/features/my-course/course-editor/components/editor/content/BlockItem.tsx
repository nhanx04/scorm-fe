import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import type { Block, EditorState, Page } from '../../../types/editor.types'
import { useCourseEditorStore } from '../../../store/use-course-editor-store'
import TextBlockEditor from './blocks/TextBlockEditor'
import ImageBlockEditor from './blocks/ImageBlockEditor'
import VideoBlockEditor from './blocks/VideoBlockEditor'
import AddBlockToolbar from './AddBlockToolbar'

type BlockItemProps = {
  page: Page
  block: Block
  index: number
  total: number
  activeBlockId: string | null
  onSetActiveBlock: (blockId: string | null) => void
}

const BlockItem: React.FC<BlockItemProps> = ({ page, block, index, total, activeBlockId, onSetActiveBlock }) => {
  const updateBlock = useCourseEditorStore((state) => state.updateBlock)
  const deleteBlock = useCourseEditorStore((state) => state.deleteBlock)
  const reorderBlocks = useCourseEditorStore((state) => state.reorderBlocks)
  const blockIds = useCourseEditorStore((state: EditorState) => state.blockOrder[page.id] ?? [])

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className='group relative w-full'
    >
      <div
        className={`w-full rounded-xl p-4 transition-all duration-150 ease-in-out hover:bg-gray-50 hover:shadow-sm focus-within:ring-2 focus-within:ring-blue-400 ${
          isDragging ? 'opacity-70' : ''
        } ${activeBlockId === block.id ? 'border border-blue-200 bg-blue-50/30' : 'border border-transparent'}`}
      >
        <div className='w-full'>
          {block.type === 'TEXT' && (
            <TextBlockEditor
              block={block}
              isActive={activeBlockId === block.id}
              onFocus={() => onSetActiveBlock(block.id)}
              onBlur={() => onSetActiveBlock(null)}
              onChange={(textHtml) => updateBlock(page.id, block.id, { textHtml })}
            />
          )}
          {block.type === 'IMAGE' && (
            <ImageBlockEditor block={block} onChange={(data) => updateBlock(page.id, block.id, data)} />
          )}
          {block.type === 'VIDEO' && (
            <VideoBlockEditor block={block} onChange={(data) => updateBlock(page.id, block.id, data)} />
          )}
        </div>

        <div
          className={`mt-2 flex items-center justify-between border-t border-gray-100 pt-2 transition-all duration-150 ease-in-out ${
            activeBlockId === block.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <div className='flex items-center gap-2 text-gray-400'>
            <button
              type='button'
              className='cursor-grab rounded-md p-1 active:cursor-grabbing hover:bg-gray-100 hover:text-gray-600'
              {...attributes}
              {...listeners}
              aria-label='Drag block'
            >
              <GripVertical size={16} />
            </button>
          </div>

          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() => {
                if (index > 0) {
                  const targetId = blockIds[index - 1]
                  if (targetId) reorderBlocks(page.id, block.id, targetId)
                }
              }}
              className='rounded-md border bg-white px-2 py-1 text-xs text-gray-600 transition hover:bg-gray-100'
            >
              ↑ Up
            </button>
            <button
              type='button'
              onClick={() => {
                const targetId = blockIds[index + 1]
                if (targetId) reorderBlocks(page.id, block.id, targetId)
              }}
              className='rounded-md border bg-white px-2 py-1 text-xs text-gray-600 transition hover:bg-gray-100'
            >
              ↓ Down
            </button>
            <button
              type='button'
              onClick={() => deleteBlock(page.id, block.id)}
              className='rounded-md border border-red-200 bg-white px-2 py-1 text-xs text-red-500 transition hover:bg-red-50'
            >
              Delete
            </button>
          </div>
        </div>

        <AddBlockToolbar
          page={page}
          afterBlockId={block.id}
          className={`mt-3 transition-all duration-150 ${activeBlockId === block.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          onBlockAdded={(newId) => onSetActiveBlock(newId)}
        />

        <div className='mt-2 text-right text-[11px] text-gray-400'>
          {index + 1}/{total}
        </div>
      </div>
    </div>
  )
}

export default BlockItem
