import React from 'react'
import type { QuestionType } from '../../../types/editor.types'

type Props = {
  type: QuestionType
  children: React.ReactNode
  className?: string
}

const CARD_THEME: Record<QuestionType, string> = {
  MCQ_SINGLE: 'from-blue-50 to-white border-blue-200/70',
  MCQ_MULTIPLE: 'from-purple-50 to-white border-purple-200/70',
  TRUE_FALSE: 'from-green-50 to-white border-green-200/70',
  SHORT_ANSWER: 'from-orange-50 to-white border-orange-200/70',
  FILL_IN_THE_BLANK: 'from-teal-50 to-white border-teal-200/70',
  MATCHING: 'from-pink-50 to-white border-pink-200/70'
}

const QuestionCard: React.FC<Props> = ({ type, children, className = '' }) => {
  return (
    <div
      className={`group space-y-4 rounded-2xl border bg-gradient-to-br p-6 shadow-md transition-all duration-200 hover:scale-[1.01] hover:shadow-lg ${CARD_THEME[type]} ${className}`}
    >
      {children}
    </div>
  )
}

export default QuestionCard
