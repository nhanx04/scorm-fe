import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type {
  Question,
  Page,
  MCQSingleQuestion,
  MCQMultipleQuestion,
  TrueFalseQuestion,
  ShortAnswerQuestion,
  FillBlankQuestion,
  MatchingQuestion
} from '../../../types/editor.types'
import { useCourseEditorStore } from '../../../store/use-course-editor-store'
import QuestionHeader from './QuestionHeader'
import RichTextField from './RichTextField'
import MCQSingleEditor from './editors/MCQSingleEditor'
import MCQMultipleEditor from './editors/MCQMultipleEditor'
import TrueFalseEditor from './editors/TrueFalseEditor'
import ShortAnswerEditor from './editors/ShortAnswerEditor'
import FillBlankEditor from './editors/FillBlankEditor'
import MatchingEditor from './editors/MatchingEditor'
import QuestionCard from './QuestionCard'

type Props = {
  page: Page
  question: Question
  index: number
  total: number
}

const QuestionItem: React.FC<Props> = ({ page, question, index, total }) => {
  const updateQuestion = useCourseEditorStore((s) => s.updateQuestion)
  const [expanded, setExpanded] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const onQuestionChange = (next: Question) => {
    updateQuestion(page.id, question.id, next)
  }

  const renderSpecificEditor = () => {
    switch (question.questionType) {
      case 'MCQ_SINGLE':
        return <MCQSingleEditor question={question as MCQSingleQuestion} onChange={onQuestionChange} />
      case 'MCQ_MULTIPLE':
        return <MCQMultipleEditor question={question as MCQMultipleQuestion} onChange={onQuestionChange} />
      case 'TRUE_FALSE':
        return <TrueFalseEditor question={question as TrueFalseQuestion} onChange={onQuestionChange} />
      case 'SHORT_ANSWER':
        return <ShortAnswerEditor question={question as ShortAnswerQuestion} onChange={onQuestionChange} />
      case 'FILL_IN_THE_BLANK':
        return <FillBlankEditor question={question as FillBlankQuestion} onChange={onQuestionChange} />
      case 'MATCHING':
      default:
        return <MatchingEditor question={question as MatchingQuestion} onChange={onQuestionChange} />
    }
  }

  return (
    <div ref={setNodeRef} style={style}>
      <QuestionCard type={question.questionType} className='space-y-6'>
        <QuestionHeader
          page={page}
          question={question}
          index={index}
          total={total}
          expanded={expanded}
          onToggle={() => setExpanded((prev) => !prev)}
          dragProps={{ ...attributes, ...listeners }}
        />

        {expanded && (
          <div className='space-y-6'>
            <div>
              <label className='text-xs font-semibold uppercase tracking-wide text-gray-600'>Title</label>
              <input
                value={question.title ?? ''}
                onChange={(e) => onQuestionChange({ ...question, title: e.target.value })}
                placeholder='Type question title...'
                className='mt-2 w-full rounded-lg border border-white/60 bg-white/80 px-3 py-2 text-base italic placeholder:text-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-200'
              />
            </div>

            <div>
              <label className='text-xs font-semibold uppercase tracking-wide text-gray-600'>Prompt</label>
              <div className='rounded-xl border border-white/70 bg-white/80 p-3'>
                <RichTextField
                  value={question.promptHtml}
                  onChange={(promptHtml) => onQuestionChange({ ...question, promptHtml })}
                  placeholder='Write the question prompt...'
                />
              </div>
            </div>

            <div>
              <button
                type='button'
                onClick={() => setShowExplanation((prev) => !prev)}
                className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-600 transition hover:text-gray-900'
              >
                <span>{showExplanation ? 'Hide explanation' : 'Show explanation'}</span>
                <ChevronDown size={14} className={`transition ${showExplanation ? 'rotate-180' : ''}`} />
              </button>
              <div
                className={`mt-3 overflow-hidden rounded-xl border border-white/70 bg-gray-50/80 p-3 transition-all duration-300 ${
                  showExplanation ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 p-0'
                }`}
              >
                <RichTextField
                  value={question.explanationHtml ?? '<p></p>'}
                  onChange={(explanationHtml) => onQuestionChange({ ...question, explanationHtml })}
                  placeholder='Optional explanation after answer...'
                />
              </div>
            </div>

            <div className='rounded-xl border border-white/80 bg-white/70 p-4'>{renderSpecificEditor()}</div>
          </div>
        )}
      </QuestionCard>
    </div>
  )
}

export default QuestionItem
