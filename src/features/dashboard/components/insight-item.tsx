import React from 'react'
import { BookOpen, NotebookPen, Rocket, Sparkles } from 'lucide-react'
import type { StatItem } from '../types'

type InsightItemProps = {
  item: StatItem
}

const iconMap = {
  book: BookOpen,
  sparkles: Sparkles,
  package: Rocket,
  activity: NotebookPen
}

const InsightItem: React.FC<InsightItemProps> = ({ item }) => {
  const Icon = iconMap[item.icon]

  return (
    <div className='flex items-center gap-4 rounded-xl border-2 border-slate-200/70 bg-gradient-to-br from-white to-slate-50/50 px-6 py-5 shadow-lg hover:shadow-xl transition-all duration-300 dark:border-slate-700/70 dark:from-slate-900/80 dark:to-slate-800/60'>
      <span className='inline-flex rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 p-3 text-indigo-600 dark:from-indigo-900/60 dark:to-purple-900/60 dark:text-indigo-300'>
        <Icon className='h-6 w-6' />
      </span>
      <div>
        <p className='text-sm font-medium text-slate-600 dark:text-slate-300'>{item.title}</p>
        <p className='text-2xl font-bold text-slate-900 dark:text-slate-100'>{item.value}</p>
      </div>
    </div>
  )
}

export default InsightItem
