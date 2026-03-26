import React from 'react'
import type { TemplateItem } from '../types'

type PathCardProps = {
  item: TemplateItem
}

const PathCard: React.FC<PathCardProps> = ({ item }) => {
  return (
    <button className='rounded-xl border border-slate-200/70 bg-white/60 px-4 py-3 text-left transition duration-200 hover:bg-slate-100/70 dark:border-slate-800/70 dark:bg-slate-900/60 dark:hover:bg-slate-800/70'>
      <p className='text-sm font-semibold text-slate-900 dark:text-slate-100'>{item.title}</p>
      <p className='text-xs text-slate-500 dark:text-slate-400'>{item.description}</p>
    </button>
  )
}

export default PathCard

