import React from 'react'
import type { FillBlankQuestion } from '../../../../types/editor.types'
import RichTextField from '../RichTextField'

type Props = {
  question: FillBlankQuestion
  onChange: (question: FillBlankQuestion) => void
}

const FillBlankEditor: React.FC<Props> = ({ question, onChange }) => {
  const answers = question.answers ?? []

  return (
    <div className='space-y-4'>
      <div>
        <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500'>Sentence</p>
        <RichTextField
          value={question.sentenceHtml}
          onChange={(sentenceHtml) => onChange({ ...question, sentenceHtml })}
          placeholder='Use ___ as blank marker'
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
                onChange({ ...question, answers: next })
              }}
              placeholder={`Blank answer ${idx + 1}`}
              className='flex-1 border-b border-gray-300 bg-transparent pb-1 text-sm outline-none focus:border-blue-500'
            />
            <button
              type='button'
              className='text-xs text-red-500 transition hover:text-red-700'
              onClick={() => onChange({ ...question, answers: answers.filter((_, i) => i !== idx) })}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        type='button'
        className='w-full rounded-xl border-2 border-dashed border-gray-300 p-3 text-sm text-gray-500 transition hover:border-blue-400 hover:text-blue-500'
        onClick={() => onChange({ ...question, answers: [...answers, ''] })}
      >
        + Add blank answer
      </button>

      {answers.length === 0 && <p className='text-xs text-red-500'>Add at least one valid blank answer.</p>}
    </div>
  )
}

export default FillBlankEditor
