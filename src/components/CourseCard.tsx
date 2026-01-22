import React from 'react'
import { FiMoreHorizontal } from 'react-icons/fi'

export interface CourseCardProps {
  title: string
  description: string
  image: string
}

const CourseCard: React.FC<CourseCardProps> = ({ title, description, image }) => (
  <div className='relative bg-white border p-2 border-blue-800 rounded-sm shadow-sm shadow-blue-300 hover:shadow-md transition-shadow w-68 h-83 overflow-hidden'>
    <img src={image} alt={title} className='w-full h-40 object-cover' />
    <div className='p-2 space-y-2'>
      <h3 className='font-semibold text-blue-800 h-13 line-clamp-1'>{title}</h3>
      <p className='text-sm text-gray-600 bg-gray-100 p-2 line-clamp-2 min-h-[40px]'>{description}</p>
    </div>
    <button className='absolute bottom-2 right-2 text-gray-500 hover:text-gray-700'>
      <FiMoreHorizontal />
    </button>
  </div>
)

export default CourseCard
