import React from 'react'
import { ListChecks, PlusCircle } from 'lucide-react'
import type { MCQMultipleQuestion } from '../../../../types/editor.types'
import OptionItem from '../OptionItem'

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
    <div className='space-y-3'>
      <div className='mb-1 flex items-center gap-2 text-sm font-semibold text-purple-700'>
        <ListChecks size={16} />
        Multiple Choice Options
      </div>
      {question.options.map((opt) => (
        <OptionItem
          key={opt.id}
          selected={opt.isCorrect}
          type='multiple'
          accentClass='text-purple-600'
          optionValue={opt.labelHtml.replace(/<[^>]*>/g, '')}
          feedbackValue={opt.feedback ?? ''}
          onSelect={() => updateOption(opt.id, { isCorrect: !opt.isCorrect })}
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
        className='flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-purple-300 p-3 text-sm font-medium text-purple-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-purple-50'
      >
        <PlusCircle size={16} /> Add Option
      </button>
      {question.options.length < 2 && <p className='text-xs text-red-500'>MCQ must have at least 2 options.</p>}
      {!question.options.some((o) => o.isCorrect) && (
        <p className='text-xs text-red-500'>Select at least one correct answer.</p>
      )}
    </div>
  )
}

export default MCQMultipleEditor
