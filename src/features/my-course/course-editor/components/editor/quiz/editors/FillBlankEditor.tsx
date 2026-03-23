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
    <div className='space-y-3'>
      <div>
        <p className='mb-1 text-xs text-gray-500'>Sentence / template (HTML)</p>
        <RichTextField
          value={question.sentenceHtml}
          onChange={(sentenceHtml) => onChange({ ...question, sentenceHtml })}
          placeholder='Use ___ as blank marker'
        />
      </div>

      <div className='space-y-2'>
        {answers.map((answer, idx) => (
          <div key={idx} className='flex items-center gap-2'>
            <input
              value={answer}
              onChange={(e) => {
                const next = [...answers]
                next[idx] = e.target.value
                onChange({ ...question, answers: next })
              }}
              className='flex-1 rounded border border-gray-300 px-2 py-1 text-sm'
            />
            <button
              type='button'
              className='text-xs text-red-600'
              onClick={() => onChange({ ...question, answers: answers.filter((_, i) => i !== idx) })}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button type='button' className='rounded border border-gray-300 px-2 py-1 text-xs' onClick={() => onChange({ ...question, answers: [...answers, ''] })}>
        + Blank answer
      </button>

      {answers.length === 0 && <p className='text-xs text-red-500'>Add at least one valid blank answer.</p>}
    </div>
  )
}

export default FillBlankEditor

