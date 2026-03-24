import React from 'react'
import { PlusCircle, TextCursorInput } from 'lucide-react'
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
      <div className='flex items-center gap-2 text-sm font-semibold text-teal-700'>
        <TextCursorInput size={16} />
        Fill in the Blank
      </div>
      <div>
        <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500'>Sentence</p>
        <div className='rounded-xl border border-teal-200 bg-white/80 p-3'>
          <RichTextField
            value={question.sentenceHtml}
            onChange={(sentenceHtml) => onChange({ ...question, sentenceHtml })}
            placeholder='Use ___ as blank marker'
          />
        </div>
      </div>

      <div className='space-y-3'>
        {answers.map((answer, idx) => (
          <div key={idx} className='flex items-center gap-3 rounded-xl border border-teal-200 bg-white/80 p-3'>
            <input
              value={answer}
              onChange={(e) => {
                const next = [...answers]
                next[idx] = e.target.value
                onChange({ ...question, answers: next })
              }}
              placeholder={`Blank answer ${idx + 1}`}
              className='flex-1 border-b border-gray-300 bg-transparent pb-1 text-sm italic outline-none focus:border-teal-500'
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
        className='flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-teal-300 p-3 text-sm font-medium text-teal-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-50'
        onClick={() => onChange({ ...question, answers: [...answers, ''] })}
      >
        <PlusCircle size={16} /> Add blank answer
      </button>

      {answers.length === 0 && <p className='text-xs text-red-500'>Add at least one valid blank answer.</p>}
    </div>
  )
}

export default FillBlankEditor
