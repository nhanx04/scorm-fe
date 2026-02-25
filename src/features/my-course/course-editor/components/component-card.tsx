import React from 'react'

export type ComponentCardProps = {
  title: string
  icon: React.ReactNode
  selected?: boolean
  onClick?: () => void
}

export function ComponentCard({ title, icon, selected, onClick }: ComponentCardProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={
        'group flex flex-col items-center justify-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 ' +
        (selected
          ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500'
          : 'border-gray-200 bg-white hover:border-blue-300')
      }
    >
      <div
        className={
          'text-4xl transition-colors duration-200 ' +
          (selected ? 'text-blue-600' : 'text-blue-400 group-hover:text-blue-600')
        }
      >
        {icon}
      </div>
      <div
        className={
          'text-[10px] font-bold tracking-widest transition-colors duration-200 ' +
          (selected ? 'text-blue-700' : 'text-gray-500 group-hover:text-gray-700')
        }
      >
        {title.toUpperCase()}
      </div>
    </button>
  )
}
