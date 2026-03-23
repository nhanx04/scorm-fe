import React, { useState } from 'react'
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

type Props = {
  page: Page
  question: Question
  index: number
  total: number
}

const QuestionItem: React.FC<Props> = ({ page, question, index, total }) => {
  const updateQuestion = useCourseEditorStore((s) => s.updateQuestion)
  const [expanded, setExpanded] = useState(true)
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
    <div
      ref={setNodeRef}
      style={style}
      className='group space-y-4 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md'
    >
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
            <label className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Title</label>
            <input
              value={question.title ?? ''}
              onChange={(e) => onQuestionChange({ ...question, title: e.target.value })}
              placeholder='Type question title...'
              className='mt-2 w-full border-b border-gray-300 bg-transparent pb-2 text-base outline-none focus:border-blue-500'
            />
          </div>

          <div>
            <label className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Prompt</label>
            <RichTextField
              value={question.promptHtml}
              onChange={(promptHtml) => onQuestionChange({ ...question, promptHtml })}
              placeholder='Write the question prompt...'
            />
          </div>

          <div>
            <label className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Explanation</label>
            <RichTextField
              value={question.explanationHtml ?? '<p></p>'}
              onChange={(explanationHtml) => onQuestionChange({ ...question, explanationHtml })}
              placeholder='Optional explanation after answer...'
            />
          </div>

          <div className='rounded-xl border border-gray-100 bg-gray-50/70 p-4'>{renderSpecificEditor()}</div>
        </div>
      )}
    </div>
  )
}

export default QuestionItem
