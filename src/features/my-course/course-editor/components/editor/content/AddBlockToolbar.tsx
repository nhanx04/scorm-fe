import React, { useState } from 'react'
import type { BlockType, Page } from '../../../types/editor.types'
import { useCourseEditorStore } from '../../../store/use-course-editor-store'
import { askKnowledge, generatePageContent } from '../../../api/aiApi'

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
  const course = useCourseEditorStore((state) => state.course)
  const sections = useCourseEditorStore((state) => state.sections)
  const pageOrder = useCourseEditorStore((state) => state.pageOrder)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [askPrompt, setAskPrompt] = useState('')
  const [isAsking, setIsAsking] = useState(false)
  const [askAnswer, setAskAnswer] = useState('')

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

  const sectionId = pageOrder ? Object.keys(pageOrder).find((id) => pageOrder[id]?.includes(page.id)) : undefined
  const sectionTitle = sectionId ? (sections[sectionId]?.title ?? '') : ''
  const pageTitle = page.title ?? ''
  const pageContent = (useCourseEditorStore.getState().blockOrder[page.id] ?? [])
    .map((blockId) => useCourseEditorStore.getState().blocks[blockId])
    .map((block) => {
      if (!block) return ''
      if (block.type === 'TEXT') return block.textHtml ?? ''
      if (block.type === 'IMAGE') return block.imageUrl ? `[Image: ${block.imageUrl}]` : ''
      if (block.type === 'VIDEO') return block.embedUrl ? `[Video: ${block.embedUrl}]` : ''
      return ''
    })
    .join('\n')

  const onGenerateAIContent = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const result = await generatePageContent({
        courseTopic: course.title,
        sectionTitle,
        pageTopic: prompt,
        language: 'Vietnamese',
        additionalInstructions: course.description ?? ''
      })
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
      setAskPrompt('')
      setAskAnswer('')
    } finally {
      setLoading(false)
    }
  }

  const onAskKnowledge = async () => {
    if (!askPrompt.trim()) return
    setIsAsking(true)
    try {
      const result = await askKnowledge({
        courseTitle: course.title,
        courseDescription: course.description ?? '',
        sectionTitle,
        pageTitle,
        pageContent,
        question: askPrompt,
        language: 'Vietnamese'
      })
      setAskAnswer(result.answer)
    } finally {
      setIsAsking(false)
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
            <h4 className='mb-3 text-sm font-semibold text-gray-800'>AI Assistant</h4>
            <div className='grid gap-4 md:grid-cols-1'>
              <div>
                <p className='mb-2 text-xs font-semibold text-gray-600'>Generate lesson content</p>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder='Describe the content you want...'
                  rows={6}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200'
                />
                <div className='mt-3 flex justify-end gap-2'>
                  <button
                    type='button'
                    onClick={() => setOpenAI(false)}
                    className='rounded-lg border px-3 py-2 text-sm'
                  >
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

              {/* <div>
                <p className='mb-2 text-xs font-semibold text-gray-600'>Ask course Q&A</p>
                <textarea
                  value={askPrompt}
                  onChange={(e) => setAskPrompt(e.target.value)}
                  placeholder='Ask a question about this course/page...'
                  rows={4}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200'
                />
                <div className='mt-3 flex justify-end'>
                  <button
                    type='button'
                    disabled={isAsking}
                    onClick={onAskKnowledge}
                    className='rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-700 disabled:opacity-60'
                  >
                    {isAsking ? 'Asking...' : 'Ask AI'}
                  </button>
                </div>
                {askAnswer && (
                  <div className='mt-3 rounded-lg border border-violet-100 bg-violet-50 p-3 text-sm text-gray-700'>
                    <p className='font-semibold text-violet-700'>AI Answer</p>
                    <p className='mt-1 whitespace-pre-line'>{askAnswer}</p>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddBlockToolbar
