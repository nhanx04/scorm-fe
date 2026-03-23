import React from 'react'
import type { TrueFalseQuestion } from '../../../../types/editor.types'

type Props = {
  question: TrueFalseQuestion
  onChange: (question: TrueFalseQuestion) => void
}

const TrueFalseEditor: React.FC<Props> = ({ question, onChange }) => {
  return (
    <div className='flex gap-2'>
      <button
        type='button'
        className={`rounded-lg border px-3 py-2 text-sm ${question.correctAnswer ? 'bg-blue-50 border-blue-300' : 'border-gray-300'}`}
        onClick={() => onChange({ ...question, correctAnswer: true })}
      >
        True
      </button>
      <button
        type='button'
        className={`rounded-lg border px-3 py-2 text-sm ${!question.correctAnswer ? 'bg-blue-50 border-blue-300' : 'border-gray-300'}`}
        onClick={() => onChange({ ...question, correctAnswer: false })}
      >
        False
      </button>
    </div>
  )
}

export default TrueFalseEditor

