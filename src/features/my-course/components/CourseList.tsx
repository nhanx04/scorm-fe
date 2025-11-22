import React, { useState, useMemo } from 'react'
import { FiSearch } from 'react-icons/fi'
import CourseCard from './CourseCard'

export type Course = {
  id: string
  title: string
  description: string
  imageUrl: string
  modifiedAt: string
  badge?: string
  tags?: string[]
}

const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'Cours sans titre',
    description: 'Modified: Nov 5, 2025',
    imageUrl: 'https://images.pexels.com/photos/34491460/pexels-photo-34491460.jpeg',
    modifiedAt: '2025-11-05'
  },
  {
    id: 'c2',
    title: 'How to report a bug',
    description: 'Modified: Sep 15, 2025',
    imageUrl: 'https://images.pexels.com/photos/3184429/pexels-photo-3184429.jpeg',
    modifiedAt: '2025-09-15'
  },
  {
    id: 'c3',
    title: 'Authoring tool guide',
    description: 'Course template',
    imageUrl: 'https://images.pexels.com/photos/34390984/pexels-photo-34390984.jpeg',
    modifiedAt: '2025-11-01'
  }
]

type SortKey = 'recently-modified' | 'oldest' | 'title-asc' | 'title-desc'

type Props = {
  courses?: Course[]
}

const CourseList: React.FC<Props> = ({ courses = mockCourses }) => {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<SortKey>('recently-modified')

  const visible = useMemo(() => {
    let arr = courses.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()))
    arr = arr.slice().sort((a, b) => {
      const aTime = new Date(a.modifiedAt).getTime()
      const bTime = new Date(b.modifiedAt).getTime()
      switch (sort) {
        case 'recently-modified':
          return bTime - aTime
        case 'oldest':
          return aTime - bTime
        case 'title-asc':
          return a.title.localeCompare(b.title)
        case 'title-desc':
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })
    return arr
  }, [courses, q, sort])

  return (
    <div>
      {/* Page heading */}
      <div className='mb-5 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-900'>My courses</h2>
        {/* Search */}
        <div className='relative'>
          <FiSearch className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Search'
            className='w-56 rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-green-500'
          />
        </div>
      </div>

      {/* Sub header */}
      <div className='mb-4 flex items-center justify-between text-sm'>
        <div className='text-gray-500'>All my courses</div>
        <label className='flex items-center gap-2 text-gray-500'>
          <span className='hidden sm:inline'>Sort</span>
          <select
            className='cursor-pointer rounded-md border border-gray-200 bg-white px-2 py-1 text-gray-700 focus:outline-none'
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value='recently-modified'>Recently modified first</option>
            <option value='oldest'>Oldest</option>
            <option value='title-asc'>Title A-Z</option>
            <option value='title-desc'>Title Z-A</option>
          </select>
        </label>
      </div>

      {/* List view */}
      <div className='space-y-4'>
        {visible.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  )
}

export default CourseList
