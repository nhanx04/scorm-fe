import React from 'react'
import { ListChecks, PlusCircle } from 'lucide-react'
import type { MCQSingleQuestion } from '../../../../types/editor.types'
import OptionItem from '../OptionItem'

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
      <div className='mb-1 flex items-center gap-2 text-sm font-semibold text-blue-700'>
        <ListChecks size={16} />
        Single Choice Options
      </div>
      {question.options.map((opt) => (
        <OptionItem
          key={opt.id}
          selected={opt.isCorrect}
          type='single'
          accentClass='text-blue-600'
          optionValue={opt.labelHtml.replace(/<[^>]*>/g, '')}
          feedbackValue={opt.feedback ?? ''}
          onSelect={() => {
            onChange({
              ...question,
              options: question.options.map((o) => ({ ...o, isCorrect: o.id === opt.id }))
            })
          }}
          onOptionChange={(next) => updateOption(opt.id, { labelHtml: `<p>${next}</p>` })}
          onFeedbackChange={(next) => updateOption(opt.id, { feedback: next })}
          onRemove={() => onChange({ ...question, options: question.options.filter((o) => o.id !== opt.id) })}
        />
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
        className='flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 p-3 text-sm font-medium text-blue-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50'
      >
        <PlusCircle size={16} /> Add Option
      </button>
      {question.options.length < 2 && <p className='text-xs text-red-500'>MCQ must have at least 2 options.</p>}
      {!question.options.some((o) => o.isCorrect) && <p className='text-xs text-red-500'>Select one correct answer.</p>}
    </div>
  )
}

export default MCQSingleEditor
