import React, { useMemo, useState } from 'react'
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

type SortKey = 'recently-modified' | 'oldest' | 'title-asc' | 'title-desc'

type Props = {
  courses: Course[]
  loading?: boolean
}

const CourseList: React.FC<Props> = ({ courses, loading }) => {
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

      {loading && <div className='text-sm text-gray-500 mb-4'>Loading...</div>}

      {!loading && visible.length === 0 && <div className='text-sm text-gray-500'>No courses yet</div>}

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
