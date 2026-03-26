import React from 'react'
import type { SuggestionItem } from '../types'

type AssistantItemProps = {
  item: SuggestionItem
}

const AssistantItem: React.FC<AssistantItemProps> = ({ item }) => {
  return (
    <div className='flex items-start justify-between gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-sky-50/70 px-4 py-3 dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-slate-900/50'>
      <div>
        <p className='text-sm font-semibold text-slate-900 dark:text-slate-100'>{item.title}</p>
        <p className='text-xs text-slate-600 dark:text-slate-300'>{item.description}</p>
      </div>
      <button className='rounded-full border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-700 transition hover:bg-white/80 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-slate-900/80'>
        {item.cta}
      </button>
    </div>
  )
}

export default AssistantItem

