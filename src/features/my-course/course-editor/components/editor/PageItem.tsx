import React from 'react'

type PageItemProps = {
  title: string
  isActive: boolean
  onClick: () => void
}

const PageItem: React.FC<PageItemProps> = ({ title, isActive, onClick }) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer ${
        isActive
          ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-900'
          : 'hover:bg-gray-200 text-gray-700'
      }`}
    >
      {title}
    </button>
  )
}

export default PageItem

