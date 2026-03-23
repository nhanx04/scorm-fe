import React from 'react'
import { ChevronDown, GripVertical } from 'lucide-react'
import type { EditorState, Page, Question, QuestionType } from '../../../types/editor.types'
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

const TYPE_BADGE: Record<QuestionType, string> = {
  TRUE_FALSE: 'bg-blue-100 text-blue-600',
  MCQ_SINGLE: 'bg-purple-100 text-purple-600',
  MCQ_MULTIPLE: 'bg-purple-100 text-purple-600',
  SHORT_ANSWER: 'bg-green-100 text-green-600',
  FILL_IN_THE_BLANK: 'bg-amber-100 text-amber-600',
  MATCHING: 'bg-pink-100 text-pink-600'
}

const typeLabel = (type: QuestionType) => type.replaceAll('_', ' ')

const QuestionHeader: React.FC<Props> = ({ page, question, index, total, expanded, onToggle, dragProps }) => {
  const deleteQuestion = useCourseEditorStore((s) => s.deleteQuestion)
  const reorderQuestions = useCourseEditorStore((s) => s.reorderQuestions)
  const questionIds = useCourseEditorStore((state: EditorState) => state.questionOrder[page.id] ?? [])

  return (
    <div className='mb-4 flex items-center justify-between gap-3'>
      <div className='flex min-w-0 items-center gap-2'>
        <button
          type='button'
          className='cursor-grab rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          {...dragProps}
        >
          <GripVertical size={16} />
        </button>
        <button type='button' onClick={onToggle} className='flex items-center gap-2 text-left'>
          <span className='text-sm font-semibold text-gray-800'>Question {index + 1}</span>
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${TYPE_BADGE[question.questionType]}`}>
            {typeLabel(question.questionType)}
          </span>
          <ChevronDown size={16} className={`text-gray-400 transition ${expanded ? 'rotate-0' : '-rotate-90'}`} />
        </button>
      </div>

      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-1 opacity-0 transition group-hover:opacity-100'>
          <button
            type='button'
            onClick={() => {
              if (index > 0) {
                const prevId = questionIds[index - 1]
                if (prevId) reorderQuestions(page.id, question.id, prevId)
              }
            }}
            className='rounded-md border bg-white px-2 py-1 text-xs text-gray-600 transition hover:bg-gray-100'
          >
            Up
          </button>
          <button
            type='button'
            onClick={() => {
              const nextId = questionIds[index + 1]
              if (nextId) reorderQuestions(page.id, question.id, nextId)
            }}
            className='rounded-md border bg-white px-2 py-1 text-xs text-gray-600 transition hover:bg-gray-100'
          >
            Down
          </button>
          <button
            type='button'
            onClick={() => deleteQuestion(page.id, question.id)}
            className='rounded-md border border-red-200 bg-white px-2 py-1 text-xs text-red-500 transition hover:bg-red-50'
          >
            Delete
          </button>
        </div>
        <span className='text-[11px] text-gray-400'>
          {index + 1}/{total}
        </span>
      </div>
    </div>
  )
}

export default QuestionHeader
