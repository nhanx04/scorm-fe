import React from 'react'
import { PlusCircle, Shuffle } from 'lucide-react'
import type { MatchingQuestion } from '../../../../types/editor.types'

type Props = {
  question: MatchingQuestion
  onChange: (question: MatchingQuestion) => void
}

const MatchingEditor: React.FC<Props> = ({ question, onChange }) => {
  const pairs = question.pairs ?? []

  return (
    <div className='space-y-3'>
      <div className='mb-1 flex items-center gap-2 text-sm font-semibold text-pink-700'>
        <Shuffle size={16} />
        Matching Pairs
      </div>
      {pairs.map((pair) => (
        <div
          key={pair.id}
          className='grid grid-cols-1 gap-3 rounded-xl border border-pink-200 bg-white/80 p-3 md:grid-cols-[1fr_1fr_auto]'
        >
          <input
            value={pair.left}
            onChange={(e) =>
              onChange({
                ...question,
                pairs: pairs.map((p) => (p.id === pair.id ? { ...p, left: e.target.value } : p))
              })
            }
            className='border-b border-gray-300 bg-transparent pb-1 text-sm italic outline-none focus:border-pink-500'
            placeholder='Left item'
          />
          <input
            value={pair.right}
            onChange={(e) =>
              onChange({
                ...question,
                pairs: pairs.map((p) => (p.id === pair.id ? { ...p, right: e.target.value } : p))
              })
            }
            className='border-b border-gray-300 bg-transparent pb-1 text-sm italic outline-none focus:border-pink-500'
            placeholder='Right match'
          />
          <button
            type='button'
            className='text-xs text-red-500 transition hover:text-red-700'
            onClick={() => onChange({ ...question, pairs: pairs.filter((p) => p.id !== pair.id) })}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type='button'
        className='flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-pink-300 p-3 text-sm font-medium text-pink-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-pink-50'
        onClick={() => onChange({ ...question, pairs: [...pairs, { id: crypto.randomUUID(), left: '', right: '' }] })}
      >
        <PlusCircle size={16} /> Add pair
      </button>

      {pairs.length < 2 && <p className='text-xs text-red-500'>Matching requires at least 2 pairs.</p>}
    </div>
  )
}

export default MatchingEditor
