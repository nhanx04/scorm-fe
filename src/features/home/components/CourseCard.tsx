import React from 'react'

interface CourseCardProps {
  title: string
  modifiedDate: string
  imageUrl: string
}

const CourseCard: React.FC<CourseCardProps> = ({ title, modifiedDate, imageUrl }) => {
  return (
    <div className='w-64 overflow-hidden rounded-lg border border-gray-300 border-b-2 cursor-pointer'>
      <img src={imageUrl} alt={title} className='h-[150px] w-full object-cover' />
      <div className='p-4'>
        <h3 className='mb-2.5 text-lg font-bold'>{title}</h3>
        <p className='text-xs text-gray-500'>Modified: {modifiedDate}</p>
      </div>
    </div>
  )
}

export default CourseCard
