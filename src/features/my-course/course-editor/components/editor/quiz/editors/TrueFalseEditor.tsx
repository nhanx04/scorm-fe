import React from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { TrueFalseQuestion } from '../../../../types/editor.types'

type Props = {
  question: TrueFalseQuestion
  onChange: (question: TrueFalseQuestion) => void
}

const TrueFalseEditor: React.FC<Props> = ({ question, onChange }) => {
  return (
    <div className='grid gap-3 sm:grid-cols-2'>
      <button
        type='button'
        onClick={() => onChange({ ...question, correctAnswer: true })}
        className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
          question.correctAnswer
            ? 'border-green-400 bg-green-50 text-green-700 shadow-sm'
            : 'border-gray-200 bg-white/70 text-gray-600 hover:border-green-300'
        }`}
      >
        <CheckCircle2 size={18} /> True
      </button>
      <button
        type='button'
        onClick={() => onChange({ ...question, correctAnswer: false })}
        className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
          !question.correctAnswer
            ? 'border-green-400 bg-green-50 text-green-700 shadow-sm'
            : 'border-gray-200 bg-white/70 text-gray-600 hover:border-green-300'
        }`}
      >
        <XCircle size={18} /> False
      </button>
    </div>
  )
}

export default TrueFalseEditor
