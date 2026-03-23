import React from 'react'
import type { MatchingQuestion } from '../../../../types/editor.types'

type Props = {
  question: MatchingQuestion
  onChange: (question: MatchingQuestion) => void
}

const MatchingEditor: React.FC<Props> = ({ question, onChange }) => {
  const pairs = question.pairs ?? []

  return (
    <div className='space-y-3'>
      {pairs.map((pair) => (
        <div
          key={pair.id}
          className='grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-3 md:grid-cols-[1fr_1fr_auto]'
        >
          <input
            value={pair.left}
            onChange={(e) =>
              onChange({
                ...question,
                pairs: pairs.map((p) => (p.id === pair.id ? { ...p, left: e.target.value } : p))
              })
            }
            className='border-b border-gray-300 bg-transparent pb-1 text-sm outline-none focus:border-blue-500'
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
            className='border-b border-gray-300 bg-transparent pb-1 text-sm outline-none focus:border-blue-500'
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
        className='w-full rounded-xl border-2 border-dashed border-gray-300 p-3 text-sm text-gray-500 transition hover:border-blue-400 hover:text-blue-500'
        onClick={() => onChange({ ...question, pairs: [...pairs, { id: crypto.randomUUID(), left: '', right: '' }] })}
      >
        + Add pair
      </button>

      {pairs.length < 2 && <p className='text-xs text-red-500'>Matching requires at least 2 pairs.</p>}
    </div>
  )
}

export default MatchingEditor
