import React from 'react'
import { FiTrash2 } from 'react-icons/fi'

export interface CourseCardProps {
  title: string
  description: string
  image: string
  onClick?: () => void
  onDelete?: () => void
  isDeleting?: boolean
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  image,
  onClick,
  onDelete,
  isDeleting = false
}) => (
  <div
    role='button'
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick?.()
      }
    }}
    className='relative text-left bg-white border p-2 border-blue-800 rounded-sm shadow-sm shadow-blue-300 hover:shadow-md transition-shadow w-68 h-83 overflow-hidden cursor-pointer'
  >
    <img src={image} alt={title} className='w-full h-40 object-cover' />
    <div className='p-2 space-y-2'>
      <h3 className='font-semibold text-blue-800 h-13 line-clamp-1'>{title}</h3>
      <p className='text-sm text-gray-600 bg-gray-100 p-2 line-clamp-2 min-h-[40px]'>{description}</p>
    </div>
    <button
      className='absolute bottom-2 right-2 text-red-500 cursor-pointer hover:text-red-700 disabled:opacity-50'
      type='button'
      disabled={isDeleting}
      onClick={(e) => {
        e.stopPropagation()
        onDelete?.()
      }}
      title='Delete course'
    >
      <FiTrash2 />
    </button>
  </div>
)

export default CourseCard
