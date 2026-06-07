import React from 'react'
import { BookOpen, Calendar } from 'lucide-react'
import type { DashboardCourse } from '../types'

type CourseListItemProps = {
  course: DashboardCourse
}

const CourseListItem: React.FC<CourseListItemProps> = ({ course }) => {
  return (
    <div className='flex flex-col gap-4 rounded-2xl border border-blue-200  bg-white/80 p-4 transition duration-200 hover:bg-white dark:border-slate-800/70 dark:bg-slate-900/60 dark:hover:bg-slate-900'>
      <div className='flex flex-col gap-4 md:flex-row'>
        <img src={course.thumbnailUrl} alt={course.title} className='h-28 w-full rounded-xl object-cover md:w-40' />
        <div className='flex flex-1 flex-col gap-3'>
          <div className='flex flex-wrap items-center gap-2'>
            {/* <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusMap[course.status]}`}>{course.status}</span> */}
            <span className='text-xs text-slate-500 dark:text-slate-400'>{course.category}</span>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>{course.title}</h3>
            <p className='line-clamp-2 text-sm text-slate-500 dark:text-slate-400'>{course.description}</p>
          </div>
          <div className='flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400'>
            <span className='inline-flex items-center gap-1'>
              <BookOpen className='h-3.5 w-3.5' /> {course.progress}% completed
            </span>
            <span className='inline-flex items-center gap-1'>
              <Calendar className='h-3.5 w-3.5' /> Updated {course.lastUpdated}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseListItem
