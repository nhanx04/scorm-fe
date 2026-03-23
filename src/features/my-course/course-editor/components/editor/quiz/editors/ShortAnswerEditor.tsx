import React from 'react'
import type { ShortAnswerQuestion } from '../../../../types/editor.types'

type Props = {
  question: ShortAnswerQuestion
  onChange: (question: ShortAnswerQuestion) => void
}

const ShortAnswerEditor: React.FC<Props> = ({ question, onChange }) => {
  const answers = question.acceptableAnswers ?? []

  return (
    <div className='space-y-4'>
      <div>
        <label className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Character limit</label>
        <input
          type='number'
          value={question.charLimit ?? 120}
          onChange={(e) => onChange({ ...question, charLimit: Number(e.target.value) })}
          className='mt-2 w-full border-b border-gray-300 bg-transparent pb-2 text-base outline-none focus:border-blue-500'
        />
      </div>

      <div className='space-y-3'>
        {answers.map((answer, idx) => (
          <div key={idx} className='flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3'>
            <input
              value={answer}
              onChange={(e) => {
                const next = [...answers]
                next[idx] = e.target.value
                onChange({ ...question, acceptableAnswers: next })
              }}
              className='flex-1 border-b border-gray-300 bg-transparent pb-1 text-sm outline-none focus:border-blue-500'
              placeholder='Acceptable answer'
            />
            <button
              type='button'
              onClick={() => onChange({ ...question, acceptableAnswers: answers.filter((_, i) => i !== idx) })}
              className='text-xs text-red-500 transition hover:text-red-700'
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        type='button'
        className='w-full rounded-xl border-2 border-dashed border-gray-300 p-3 text-sm text-gray-500 transition hover:border-blue-400 hover:text-blue-500'
        onClick={() => onChange({ ...question, acceptableAnswers: [...answers, ''] })}
      >
        + Acceptable answer
      </button>
    </div>
  )
}

export default ShortAnswerEditor
