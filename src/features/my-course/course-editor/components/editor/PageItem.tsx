import React, { useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { GrCircleQuestion } from 'react-icons/gr'
import { LuTableOfContents } from 'react-icons/lu'

type PageItemProps = {
  title: string
  isActive: boolean
  onClick: () => void
  onDelete?: () => void
  pageType?: 'CONTENT' | 'QUIZ'
}

const PageItem: React.FC<PageItemProps> = ({ title, isActive, onClick, onDelete, pageType = 'CONTENT' }) => {
  const [isHovering, setIsHovering] = useState(false)

  const isQuiz = pageType === 'QUIZ'
  const bgColor = isQuiz ? 'bg-purple-100 border-purple-500' : 'bg-blue-100 border-blue-500'
  const hoverBg = isQuiz ? 'hover:bg-purple-50' : 'hover:bg-gray-200'
  const textColor = isQuiz ? 'text-purple-900' : 'text-blue-900'

  return (
    <div
      className='flex items-center gap-2 group'
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <button
        type='button'
        onClick={onClick}
        className={`flex-1 min-w-0 text-left rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer ${
          isActive ? `${bgColor} border-l-4 ${textColor}` : `${hoverBg} text-gray-700`
        }`}
      >
        <div className='flex items-center justify-between gap-2 min-w-0'>
          <span className='truncate'>{title}</span>
          <span className={`text-xs font-semibold shrink-0 ${isActive ? '' : 'text-gray-500'}`}>
            {isQuiz ? <GrCircleQuestion className='text-red-700' /> : <LuTableOfContents className='text-green-700' />}
          </span>
        </div>
      </button>

      {(isHovering || isActive) && onDelete && (
        <button
          type='button'
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className='p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors shrink-0'
          title='Delete page'
        >
          <FiTrash2 className='w-4 h-4' />
        </button>
      )}
    </div>
  )
}

export default PageItem
