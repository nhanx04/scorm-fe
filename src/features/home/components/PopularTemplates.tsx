import React from 'react'
import TemplateCard from './TemplateCard'

const popularTemplates = [
  {
    title: 'Build your course',
    description: '2 min',
    imageUrl: 'https://phuongnamvina.com/img_data/images/cach-lam-template.jpg'
  },
  {
    title: 'Authoring tool guide',
    description: 'Course template',
    imageUrl: 'https://phuongnamvina.com/img_data/images/cac-template-website-dep.jpg'
  }
]

const PopularTemplates = () => {
  return (
    <div>
      <div className='mb-5'>
        <h2 className='text-xl font-semibold text-white'>Popular templates</h2>
      </div>
      <div className='space-y-4'>
        {popularTemplates.map((template, index) => (
          <TemplateCard key={index} {...template} />
        ))}
      </div>
    </div>
  )
}

export default PopularTemplates
