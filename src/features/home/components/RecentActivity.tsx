import React from 'react'
import CourseCard from './CourseCard'
import { TiThSmall } from 'react-icons/ti'

const recentCourses = [
  {
    title: 'Cours sans titre',
    modifiedDate: 'Nov 5, 2025',
    imageUrl: 'https://images.pexels.com/photos/34491460/pexels-photo-34491460.jpeg'
  },
  {
    title: 'Cours sans titre',
    modifiedDate: 'Sep 15, 2025',
    imageUrl: 'https://images.pexels.com/photos/34390984/pexels-photo-34390984.jpeg'
  },
  {
    title: 'How to report a bug',
    modifiedDate: 'Sep 15, 2025',
    imageUrl: 'https://images.pexels.com/photos/3184429/pexels-photo-3184429.jpeg'
  }
]

const RecentActivity = () => {
  return (
    <div>
      <div className='mt-10 mb-5 flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Recent activity</h2>
        <a href='#' className='text-blue-600 no-underline hover:underline flex items-center'>
          <TiThSmall className='inline-block mr-1' />
          All courses
        </a>
      </div>
      <div className='flex flex-wrap gap-4'>
        {recentCourses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>
    </div>
  )
}

export default RecentActivity
