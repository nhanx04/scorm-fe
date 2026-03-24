import React from 'react'
import { Pencil, PlusCircle } from 'lucide-react'
import type { ShortAnswerQuestion } from '../../../../types/editor.types'

type Props = {
  question: ShortAnswerQuestion
  onChange: (question: ShortAnswerQuestion) => void
}

const ShortAnswerEditor: React.FC<Props> = ({ question, onChange }) => {
  const answers = question.acceptableAnswers ?? []

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2 text-sm font-semibold text-orange-700'>
        <Pencil size={16} />
        Short Answer Settings
      </div>
      <div>
        <label className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Character limit</label>
        <input
          type='number'
          value={question.charLimit ?? 120}
          onChange={(e) => onChange({ ...question, charLimit: Number(e.target.value) })}
          className='mt-2 w-full rounded-lg border border-orange-200 bg-white/80 px-3 py-2 text-base outline-none transition focus:ring-2 focus:ring-orange-200'
        />
      </div>

      <div className='space-y-3'>
        {answers.map((answer, idx) => (
          <div key={idx} className='flex items-center gap-3 rounded-xl border border-orange-200 bg-white/80 p-3'>
            <input
              value={answer}
              onChange={(e) => {
                const next = [...answers]
                next[idx] = e.target.value
                onChange({ ...question, acceptableAnswers: next })
              }}
              className='flex-1 border-b border-gray-300 bg-transparent pb-1 text-sm italic outline-none focus:border-orange-500'
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
        className='flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-orange-300 p-3 text-sm font-medium text-orange-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-50'
        onClick={() => onChange({ ...question, acceptableAnswers: [...answers, ''] })}
      >
        <PlusCircle size={16} /> Acceptable answer
      </button>
    </div>
  )
}

export default ShortAnswerEditor
