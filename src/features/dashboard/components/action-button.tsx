import React from 'react'
import { BookOpen, ChevronRight, GraduationCap, NotebookPen, Plus, Rocket, Sparkles } from 'lucide-react'
import type { ActionItem } from '../types'

type ActionButtonProps = {
  item: ActionItem
}

const iconMap = {
  plus: Plus,
  sparkles: Sparkles,
  import: Rocket,
  layout: NotebookPen,
  quiz: GraduationCap,
  asset: BookOpen
}

const ActionButton: React.FC<ActionButtonProps> = ({ item }) => {
  const Icon = iconMap[item.icon]

  return (
    <button className='group flex items-center justify-between gap-4 rounded-sm border-1 border-slate-200/70 px-6 py-5 text-left transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50 hover:border-indigo-200 hover:shadow-xl dark:border-slate-700/70 dark:hover:from-slate-800/60 dark:hover:to-indigo-900/40 dark:hover:border-indigo-700'>
      <div className='flex items-center gap-4'>
        <span className='inline-flex rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 p-3 text-slate-600 transition-all group-hover:from-indigo-100 group-hover:to-purple-100 group-hover:text-indigo-600 dark:from-slate-800 dark:to-slate-700 dark:text-slate-300 dark:group-hover:from-indigo-900/60 dark:group-hover:to-purple-900/60 dark:group-hover:text-indigo-300'>
          <Icon className='h-6 w-6' />
        </span>
        <div>
          <p className='text-lg font-bold text-slate-900 dark:text-slate-100'>{item.title}</p>
          <p className='text-sm text-slate-600 dark:text-slate-300 leading-relaxed'>{item.description}</p>
        </div>
      </div>
      <ChevronRight className='h-5 w-5 text-slate-400 transition-all group-hover:text-indigo-500 group-hover:translate-x-1 dark:text-slate-500 dark:group-hover:text-indigo-400' />
    </button>
  )
}

export default ActionButton
