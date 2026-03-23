import React from 'react'
import { GripVertical } from 'lucide-react'
import type { EditorState, Page, Question } from '../../../types/editor.types'
import { useCourseEditorStore } from '../../../store/use-course-editor-store'

type Props = {
  page: Page
  question: Question
  index: number
  total: number
  expanded: boolean
  onToggle: () => void
  dragProps: Record<string, unknown>
}

const QuestionHeader: React.FC<Props> = ({ page, question, index, total, expanded, onToggle, dragProps }) => {
  const deleteQuestion = useCourseEditorStore((s) => s.deleteQuestion)
  const reorderQuestions = useCourseEditorStore((s) => s.reorderQuestions)
  const questionIds = useCourseEditorStore((state: EditorState) => state.questionOrder[page.id] ?? [])

  return (
    <div className='mb-3 flex items-center justify-between gap-2'>
      <div className='flex items-center gap-2'>
        <button type='button' className='cursor-grab rounded p-1 hover:bg-gray-100' {...dragProps}>
          <GripVertical size={16} />
        </button>
        <button type='button' onClick={onToggle} className='text-left text-sm font-medium text-gray-700'>
          Q{index + 1}: {question.questionType} {expanded ? '▾' : '▸'}
        </button>
      </div>

      <div className='flex items-center gap-1'>
        <button
          type='button'
          onClick={() => {
            if (index > 0) {
              const prevId = questionIds[index - 1]
              if (prevId) reorderQuestions(page.id, question.id, prevId)
            }
          }}
          className='rounded px-2 py-1 text-xs hover:bg-gray-100'
        >
          Up
        </button>
        <button
          type='button'
          onClick={() => {
            const nextId = questionIds[index + 1]
            if (nextId) reorderQuestions(page.id, question.id, nextId)
          }}
          className='rounded px-2 py-1 text-xs hover:bg-gray-100'
        >
          Down
        </button>
        <button
          type='button'
          onClick={() => deleteQuestion(page.id, question.id)}
          className='rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50'
        >
          Delete
        </button>
      </div>

      <span className='text-[11px] text-gray-400'>
        {index + 1}/{total}
      </span>
    </div>
  )
}

export default QuestionHeader
