import React from 'react'
import type { MatchingQuestion } from '../../../../types/editor.types'

type Props = {
  question: MatchingQuestion
  onChange: (question: MatchingQuestion) => void
}

const MatchingEditor: React.FC<Props> = ({ question, onChange }) => {
  const pairs = question.pairs ?? []

  return (
    <div className='space-y-2'>
      {pairs.map((pair) => (
        <div key={pair.id} className='grid grid-cols-[1fr_1fr_auto] gap-2'>
          <input
            value={pair.left}
            onChange={(e) =>
              onChange({ ...question, pairs: pairs.map((p) => (p.id === pair.id ? { ...p, left: e.target.value } : p)) })
            }
            className='rounded border border-gray-300 px-2 py-1 text-sm'
            placeholder='Left item'
          />
          <input
            value={pair.right}
            onChange={(e) =>
              onChange({ ...question, pairs: pairs.map((p) => (p.id === pair.id ? { ...p, right: e.target.value } : p)) })
            }
            className='rounded border border-gray-300 px-2 py-1 text-sm'
            placeholder='Right match'
          />
          <button
            type='button'
            className='text-xs text-red-600'
            onClick={() => onChange({ ...question, pairs: pairs.filter((p) => p.id !== pair.id) })}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type='button'
        className='rounded border border-gray-300 px-2 py-1 text-xs'
        onClick={() => onChange({ ...question, pairs: [...pairs, { id: crypto.randomUUID(), left: '', right: '' }] })}
      >
        + Pair
      </button>

      {pairs.length < 2 && <p className='text-xs text-red-500'>Matching requires at least 2 pairs.</p>}
    </div>
  )
}

export default MatchingEditor

