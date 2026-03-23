import React from 'react'
import type { ShortAnswerQuestion } from '../../../../types/editor.types'

type Props = {
  question: ShortAnswerQuestion
  onChange: (question: ShortAnswerQuestion) => void
}

const ShortAnswerEditor: React.FC<Props> = ({ question, onChange }) => {
  const answers = question.acceptableAnswers ?? []

  return (
    <div className='space-y-3'>
      <label className='block text-sm text-gray-600'>
        Character limit
        <input
          type='number'
          value={question.charLimit ?? 120}
          onChange={(e) => onChange({ ...question, charLimit: Number(e.target.value) })}
          className='mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm'
        />
      </label>

      <div className='space-y-2'>
        {answers.map((answer, idx) => (
          <div key={idx} className='flex items-center gap-2'>
            <input
              value={answer}
              onChange={(e) => {
                const next = [...answers]
                next[idx] = e.target.value
                onChange({ ...question, acceptableAnswers: next })
              }}
              className='flex-1 rounded border border-gray-300 px-2 py-1 text-sm'
              placeholder='Acceptable answer'
            />
            <button
              type='button'
              onClick={() => onChange({ ...question, acceptableAnswers: answers.filter((_, i) => i !== idx) })}
              className='text-xs text-red-600'
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        type='button'
        className='rounded border border-gray-300 px-2 py-1 text-xs'
        onClick={() => onChange({ ...question, acceptableAnswers: [...answers, ''] })}
      >
        + Acceptable answer
      </button>
    </div>
  )
}

export default ShortAnswerEditor

