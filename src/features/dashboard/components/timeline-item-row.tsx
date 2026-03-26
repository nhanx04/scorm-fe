import React from 'react'
import type { TimelineItem } from '../types'

type TimelineItemRowProps = {
  item: TimelineItem
  isLast?: boolean
}

const TimelineItemRow: React.FC<TimelineItemRowProps> = ({ item, isLast = false }) => {
  return (
    <div className='relative flex gap-3 pb-4 text-sm text-slate-600 dark:text-slate-300'>
      {!isLast ? <span className='absolute left-[5px] top-4 h-[calc(100%-8px)] w-px bg-slate-200 dark:bg-slate-700' /> : null}
      <span className='mt-1 h-2.5 w-2.5 rounded-full bg-indigo-400 dark:bg-indigo-300' />
      <div>
        <p className='font-medium text-slate-900 dark:text-slate-100'>{item.title}</p>
        <p className='text-xs text-slate-500 dark:text-slate-400'>{item.timestamp}</p>
      </div>
    </div>
  )
}

export default TimelineItemRow

