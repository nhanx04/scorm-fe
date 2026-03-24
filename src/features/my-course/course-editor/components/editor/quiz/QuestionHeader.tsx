import React from 'react'
import { ChevronDown, GripVertical } from 'lucide-react'
import type { EditorState, Page, Question, QuestionType } from '../../../types/editor.types'
import { useCourseEditorStore } from '../../../store/use-course-editor-store'
import QuestionTypeBadge from './QuestionTypeBadge'

type Props = {
  page: Page
  question: Question
  index: number
  total: number
  expanded: boolean
  onToggle: () => void
  dragProps: Record<string, unknown>
}

const HEADER_THEME: Record<QuestionType, string> = {
  MCQ_SINGLE: 'from-blue-500/90 to-blue-400/80',
  MCQ_MULTIPLE: 'from-purple-500/90 to-purple-400/80',
  TRUE_FALSE: 'from-green-500/90 to-green-400/80',
  SHORT_ANSWER: 'from-orange-500/90 to-orange-400/80',
  FILL_IN_THE_BLANK: 'from-teal-500/90 to-teal-400/80',
  MATCHING: 'from-pink-500/90 to-pink-400/80'
}

const QuestionHeader: React.FC<Props> = ({ page, question, index, total, expanded, onToggle, dragProps }) => {
  const deleteQuestion = useCourseEditorStore((s) => s.deleteQuestion)
  const reorderQuestions = useCourseEditorStore((s) => s.reorderQuestions)
  const questionIds = useCourseEditorStore((state: EditorState) => state.questionOrder[page.id] ?? [])

  return (
    <div className='mb-4 overflow-hidden rounded-xl border border-white/40 bg-white/70'>
      <div
        className={`flex items-center justify-between gap-3 bg-gradient-to-r px-3 py-2 text-white ${HEADER_THEME[question.questionType]}`}
      >
        <div className='flex min-w-0 items-center gap-2'>
          <button
            type='button'
            className='cursor-grab rounded-lg p-1 text-white/80 transition hover:bg-white/20 hover:text-white'
            {...dragProps}
          >
            <GripVertical size={16} />
          </button>
          <button type='button' onClick={onToggle} className='flex items-center gap-2 text-left'>
            <span className='text-sm font-semibold'>Question {index + 1}</span>
            <QuestionTypeBadge type={question.questionType} />
            <ChevronDown size={16} className={`text-white transition ${expanded ? 'rotate-0' : '-rotate-90'}`} />
          </button>
        </div>

        <span className='text-[11px] font-semibold text-white/90'>
          {index + 1}/{total}
        </span>
      </div>

      <div className='flex items-center justify-end gap-1 p-2 opacity-0 transition-all duration-200 group-hover:opacity-100'>
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
    </div>
  )
}

export default QuestionHeader
