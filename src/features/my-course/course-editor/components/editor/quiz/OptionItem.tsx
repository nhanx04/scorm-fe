import React from 'react'
import { Check, Circle, Square, Trash2 } from 'lucide-react'

type Props = {
  selected: boolean
  type: 'single' | 'multiple'
  accentClass: string
  optionValue: string
  feedbackValue: string
  onSelect: () => void
  onOptionChange: (value: string) => void
  onFeedbackChange: (value: string) => void
  onRemove: () => void
}

const OptionItem: React.FC<Props> = ({
  selected,
  type,
  accentClass,
  optionValue,
  feedbackValue,
  onSelect,
  onOptionChange,
  onFeedbackChange,
  onRemove
}) => {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
        selected ? `${accentClass} border-current/50 bg-white/90 shadow-sm` : 'border-gray-200 bg-white/70 hover:border-gray-300'
      }`}
    >
      <button
        type='button'
        onClick={onSelect}
        className={`relative grid h-6 w-6 place-items-center rounded-full transition ${selected ? 'scale-105' : 'scale-100'}`}
      >
        {type === 'single' ? <Circle size={18} className={selected ? accentClass : 'text-gray-400'} /> : <Square size={18} className={selected ? accentClass : 'text-gray-400'} />}
        {selected && <Check size={12} className={`absolute ${accentClass}`} />}
      </button>

      <div className='flex-1 space-y-2'>
        <input
          value={optionValue}
          onChange={(e) => onOptionChange(e.target.value)}
          placeholder='Option text...'
          className='w-full border-b border-gray-300 bg-transparent pb-1 text-sm italic placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-current focus:ring-0'
        />
        <input
          value={feedbackValue}
          onChange={(e) => onFeedbackChange(e.target.value)}
          placeholder='Feedback...'
          className='w-full border-b border-gray-300 bg-transparent pb-1 text-xs italic placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-current focus:ring-0'
        />
      </div>

      <button type='button' onClick={onRemove} className='rounded-lg p-1 text-red-500 transition hover:bg-red-50 hover:text-red-700'>
        <Trash2 size={14} />
      </button>
    </div>
  )
}

export default OptionItem

