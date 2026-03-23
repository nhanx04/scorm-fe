import React, { useState } from 'react'
import type { BlockType, Page } from '../../../types/editor.types'
import { useCourseEditorStore } from '../../../store/use-course-editor-store'
import { generateContent } from '../../../api/aiApi'

type AddBlockToolbarProps = {
  page: Page
  afterBlockId?: string
  onBlockAdded?: (blockId: string) => void
  className?: string
}

const AddBlockToolbar: React.FC<AddBlockToolbarProps> = ({ page, afterBlockId, onBlockAdded, className }) => {
  const addBlock = useCourseEditorStore((state) => state.addBlock)
  const updateBlock = useCourseEditorStore((state) => state.updateBlock)
  const reorderBlocks = useCourseEditorStore((state) => state.reorderBlocks)
  const [openAI, setOpenAI] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const onAdd = (type: BlockType) => {
    addBlock(page.id, type)
    const ids = useCourseEditorStore.getState().blockOrder[page.id] ?? []
    const newId = ids[ids.length - 1]
    if (!newId) return
    if (afterBlockId) {
      const afterIndex = ids.indexOf(afterBlockId)
      const targetId = afterIndex >= 0 ? ids[afterIndex + 1] : undefined
      if (targetId) reorderBlocks(page.id, newId, targetId)
    }
    onBlockAdded?.(newId)
  }

  const onGenerateAIContent = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const result = await generateContent(prompt)
      const safeType: BlockType = result.type === 'IMAGE' || result.type === 'VIDEO' ? result.type : 'TEXT'
      addBlock(page.id, safeType)
      const ids = useCourseEditorStore.getState().blockOrder[page.id] ?? []
      const lastId = ids[ids.length - 1]
      if (lastId) {
        if (afterBlockId) {
          const afterIndex = ids.indexOf(afterBlockId)
          const targetId = afterIndex >= 0 ? ids[afterIndex + 1] : undefined
          if (targetId) reorderBlocks(page.id, lastId, targetId)
        }
        if (safeType === 'TEXT') updateBlock(page.id, lastId, { textHtml: result.content })
        if (safeType === 'IMAGE') updateBlock(page.id, lastId, { imageUrl: result.content })
        if (safeType === 'VIDEO') updateBlock(page.id, lastId, { embedUrl: result.content })
        onBlockAdded?.(lastId)
      }
      setOpenAI(false)
      setPrompt('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={`flex flex-wrap gap-2 ${className ?? ''}`}>
        <button
          type='button'
          onClick={() => onAdd('TEXT')}
          className='rounded-full border bg-white px-3 py-1 text-sm hover:bg-gray-100'
        >
          + Text
        </button>
        <button
          type='button'
          onClick={() => onAdd('IMAGE')}
          className='rounded-full border bg-white px-3 py-1 text-sm hover:bg-gray-100'
        >
          + Image
        </button>
        <button
          type='button'
          onClick={() => onAdd('VIDEO')}
          className='rounded-full border bg-white px-3 py-1 text-sm hover:bg-gray-100'
        >
          + Video
        </button>
        <button
          type='button'
          onClick={() => setOpenAI(true)}
          className='rounded-full border border-violet-300 bg-white px-3 py-1 text-sm text-violet-700 hover:bg-violet-50'
        >
          ✨ Generate with AI
        </button>
      </div>

      {openAI && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='w-full max-w-xl rounded-xl bg-white p-4 shadow-xl'>
            <h4 className='mb-2 text-sm font-semibold text-gray-800'>AI Content Generator</h4>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Describe what you want...'
              rows={6}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200'
            />
            <div className='mt-3 flex justify-end gap-2'>
              <button type='button' onClick={() => setOpenAI(false)} className='rounded-lg border px-3 py-2 text-sm'>
                Cancel
              </button>
              <button
                type='button'
                disabled={loading}
                onClick={onGenerateAIContent}
                className='rounded-lg bg-violet-600 px-3 py-2 text-sm text-white disabled:opacity-60'
              >
                {loading ? 'Generating...' : 'Generate Content'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddBlockToolbar
