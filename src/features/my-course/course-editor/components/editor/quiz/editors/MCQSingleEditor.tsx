import React from 'react'
import type { MCQSingleQuestion } from '../../../../types/editor.types'

type Props = {
  question: MCQSingleQuestion
  onChange: (question: MCQSingleQuestion) => void
}

const MCQSingleEditor: React.FC<Props> = ({ question, onChange }) => {
  const updateOption = (optionId: string, patch: Partial<MCQSingleQuestion['options'][number]>) => {
    onChange({
      ...question,
      options: question.options.map((opt) => (opt.id === optionId ? { ...opt, ...patch } : opt))
    })
  }

  return (
    <div className='space-y-3'>
      {question.options.map((opt) => (
        <div
          key={opt.id}
          className={`flex items-center gap-3 rounded-xl border p-3 transition hover:border-blue-300 ${
            opt.isCorrect ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'
          }`}
        >
          <input
            type='radio'
            checked={opt.isCorrect}
            onChange={() => {
              onChange({
                ...question,
                options: question.options.map((o) => ({ ...o, isCorrect: o.id === opt.id }))
              })
            }}
          />
          <div className='flex-1 space-y-2'>
            <input
              value={opt.labelHtml.replace(/<[^>]*>/g, '')}
              onChange={(e) => updateOption(opt.id, { labelHtml: `<p>${e.target.value}</p>` })}
              placeholder='Option text...'
              className='w-full border-b border-gray-300 bg-transparent pb-1 text-sm outline-none focus:border-blue-500'
            />
            <input
              placeholder='Feedback...'
              value={opt.feedback ?? ''}
              onChange={(e) => updateOption(opt.id, { feedback: e.target.value })}
              className='w-full border-b border-gray-300 bg-transparent pb-1 text-xs outline-none focus:border-blue-500'
            />
          </div>
          <button
            type='button'
            onClick={() => onChange({ ...question, options: question.options.filter((o) => o.id !== opt.id) })}
            className='text-xs text-red-500 transition hover:text-red-700'
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type='button'
        onClick={() =>
          onChange({
            ...question,
            options: [
              ...question.options,
              { id: crypto.randomUUID(), labelHtml: '<p>New option</p>', isCorrect: false }
            ]
          })
        }
        className='w-full rounded-xl border-2 border-dashed border-gray-300 p-3 text-sm text-gray-500 transition hover:border-blue-400 hover:text-blue-500'
      >
        + Add option
      </button>
      {question.options.length < 2 && <p className='text-xs text-red-500'>MCQ must have at least 2 options.</p>}
      {!question.options.some((o) => o.isCorrect) && <p className='text-xs text-red-500'>Select one correct answer.</p>}
    </div>
  )
}

export default MCQSingleEditor
