import React from 'react'
import type { MCQMultipleQuestion } from '../../../../types/editor.types'

type Props = {
  question: MCQMultipleQuestion
  onChange: (question: MCQMultipleQuestion) => void
}

const MCQMultipleEditor: React.FC<Props> = ({ question, onChange }) => {
  const updateOption = (optionId: string, patch: Partial<MCQMultipleQuestion['options'][number]>) => {
    onChange({
      ...question,
      options: question.options.map((opt) => (opt.id === optionId ? { ...opt, ...patch } : opt))
    })
  }

  return (
    <div className='space-y-2'>
      {question.options.map((opt) => (
        <div key={opt.id} className='rounded-lg border border-gray-200 p-2'>
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              checked={opt.isCorrect}
              onChange={() => updateOption(opt.id, { isCorrect: !opt.isCorrect })}
            />
            <input
              value={opt.labelHtml.replace(/<[^>]*>/g, '')}
              onChange={(e) => updateOption(opt.id, { labelHtml: `<p>${e.target.value}</p>` })}
              className='flex-1 rounded border border-gray-300 px-2 py-1 text-sm'
            />
            <button
              type='button'
              onClick={() => onChange({ ...question, options: question.options.filter((o) => o.id !== opt.id) })}
              className='text-xs text-red-600'
            >
              Remove
            </button>
          </div>
          <input
            placeholder='Feedback'
            value={opt.feedback ?? ''}
            onChange={(e) => updateOption(opt.id, { feedback: e.target.value })}
            className='mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs'
          />
        </div>
      ))}
      <button
        type='button'
        onClick={() =>
          onChange({
            ...question,
            options: [...question.options, { id: crypto.randomUUID(), labelHtml: '<p>New option</p>', isCorrect: false }]
          })
        }
        className='rounded border border-gray-300 px-2 py-1 text-xs'
      >
        + Option
      </button>
      {question.options.length < 2 && <p className='text-xs text-red-500'>MCQ must have at least 2 options.</p>}
      {!question.options.some((o) => o.isCorrect) && <p className='text-xs text-red-500'>Select at least one correct answer.</p>}
    </div>
  )
}

export default MCQMultipleEditor

