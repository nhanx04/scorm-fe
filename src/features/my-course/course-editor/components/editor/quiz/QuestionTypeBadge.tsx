import React from 'react'
import { CheckCircle, ListChecks, Pencil, Shuffle, TextCursorInput } from 'lucide-react'
import type { QuestionType } from '../../../types/editor.types'

type Props = {
  type: QuestionType
}

const BADGE_STYLES: Record<QuestionType, { label: string; className: string; icon: React.ElementType }> = {
  MCQ_SINGLE: { label: 'MCQ Single', className: 'bg-blue-500 text-white border-blue-200', icon: ListChecks },
  MCQ_MULTIPLE: {
    label: 'MCQ Multiple',
    className: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: ListChecks
  },
  TRUE_FALSE: { label: 'True / False', className: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
  SHORT_ANSWER: { label: 'Short Answer', className: 'bg-orange-100 text-orange-700 border-orange-200', icon: Pencil },
  FILL_IN_THE_BLANK: {
    label: 'Fill in the Blank',
    className: 'bg-teal-100 text-teal-700 border-teal-200',
    icon: TextCursorInput
  },
  MATCHING: { label: 'Matching', className: 'bg-pink-100 text-pink-700 border-pink-200', icon: Shuffle }
}

const QuestionTypeBadge: React.FC<Props> = ({ type }) => {
  const { label, className, icon: Icon } = BADGE_STYLES[type]

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>
      <Icon size={14} />
      {label}
    </span>
  )
}

export default QuestionTypeBadge
