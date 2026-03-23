import React from 'react'
import type { TrueFalseQuestion } from '../../../../types/editor.types'

type Props = {
  question: TrueFalseQuestion
  onChange: (question: TrueFalseQuestion) => void
}

const TrueFalseEditor: React.FC<Props> = ({ question, onChange }) => {
  return (
    <div className='flex gap-3'>
      <button
        type='button'
        className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition hover:border-blue-400 hover:bg-blue-50 ${
          question.correctAnswer ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'
        }`}
        onClick={() => onChange({ ...question, correctAnswer: true })}
      >
        True
      </button>
      <button
        type='button'
        className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition hover:border-blue-400 hover:bg-blue-50 ${
          !question.correctAnswer ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'
        }`}
        onClick={() => onChange({ ...question, correctAnswer: false })}
      >
        False
      </button>
    </div>
  )
}

export default TrueFalseEditor
