import React from 'react'

export type QuestionCardProps = {
  title: string
  description: string
  icon: React.ReactNode
  selected?: boolean
  onClick?: () => void
}

export function QuestionCard({ title, description, icon, selected, onClick }: QuestionCardProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={
        'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-[0.99] ' +
        (selected
          ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500'
          : 'border-gray-200 bg-white hover:border-blue-300')
      }
    >
      <div
        className={
          'flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-colors duration-200 ' +
          (selected ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600')
        }
      >
        {icon}
      </div>
      <div className='min-w-0'>
        <div className='truncate text-sm font-semibold text-gray-800'>{title}</div>
        <div className='truncate text-xs text-gray-500'>{description}</div>
      </div>
    </button>
  )
}
