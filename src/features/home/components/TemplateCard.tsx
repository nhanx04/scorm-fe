import React from 'react'

interface TemplateCardProps {
  title: string
  description: string
  imageUrl: string
}

const TemplateCard: React.FC<TemplateCardProps> = ({ title, description, imageUrl }) => {
  return (
    <div className='flex items-center bg-white p-4 shadow-md cursor-pointer'>
      <img src={imageUrl} alt={title} className='mr-4 h-[60px] w-[60px] rounded-lg' />
      <div>
        <h4 className='mb-1 font-semibold'>{title}</h4>
        <p className='m-0 text-sm text-gray-500'>{description}</p>
      </div>
    </div>
  )
}

export default TemplateCard
