import React, { useEffect, useRef, useState } from 'react'
import { FiSearch, FiChevronDown, FiFileText, FiLayers } from 'react-icons/fi'
import { CourseCard } from '@/components'
import CourseFilter from './components/CourseFilter'
import { coursesMock } from './mock/courses.mock'
import MainLayout from '@/layouts/main-layout'

import { useNavigate } from 'react-router'

const MyCourseContent: React.FC = () => {
  const navigate = useNavigate()
  const [newCourseOpen, setNewCourseOpen] = useState<boolean>(false)
  const newCourseBtnRef = useRef<HTMLButtonElement | null>(null)
  const newCourseMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!newCourseOpen) return

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null
      if (!target) return

      const btn = newCourseBtnRef.current
      const menu = newCourseMenuRef.current

      if (btn?.contains(target)) return
      if (menu?.contains(target)) return

      setNewCourseOpen(false)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNewCourseOpen(false)
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [newCourseOpen])

  return (
    <div className='px-20 bg-gray-100 min-h-screen'>
      {/* 2. LỚP ĐỆM TRẮNG (White Container): Đây là phần bạn đang thiếu */}
      <div className='bg-white h-full shadow-lg px-6 py-4'>
        {/* --- Nội dung chính bắt đầu từ đây --- */}

        {/* Top actions */}
        <div className='flex items-center gap-4 mb-6 h-5'>
          {' '}
          {/* Thêm mb-6 để tách với filter */}
          <div className='relative flex-1'>
            <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-blue-800' />
            <input
              type='text'
              placeholder='Type here to search...'
              className='w-full pl-10 pr-4 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 transition-colors'
            />
          </div>
          <div className='relative'>
            <button
              className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors'
              onClick={() => setNewCourseOpen((v: boolean) => !v)}
              ref={newCourseBtnRef}
              type='button'
            >
              New Course <FiChevronDown />
            </button>

            {newCourseOpen && (
              <div
                ref={newCourseMenuRef}
                className='absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50'
              >
                <div className='p-1'>
                  <button
                    className='group flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-900 hover:bg-green-50 hover:text-green-800'
                    onClick={() => {
                      setNewCourseOpen(false)
                      navigate('/my-course/editor')
                    }}
                    type='button'
                  >
                    <FiFileText className='h-4 w-4' />
                    Create from scratch
                  </button>

                  <button
                    className='group flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-900 hover:bg-green-50 hover:text-green-800'
                    onClick={() => {
                      setNewCourseOpen(false)
                      console.log('Create from theme')
                    }}
                    type='button'
                  >
                    <FiLayers className='h-4 w-4' />
                    Create from theme
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className='mb-6 h-7'>
          {' '}
          {/* Bọc Filter để chỉnh khoảng cách nếu cần */}
          <CourseFilter />
        </div>

        {/* Course grid */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
          {coursesMock.map((c) => (
            <CourseCard key={c.title} {...c} />
          ))}
        </div>

        {/* --- Kết thúc nội dung chính --- */}
      </div>
    </div>
  )
}

const MyCoursePage: React.FC = () => (
  <MainLayout>
    <MyCourseContent />
  </MainLayout>
)

export default MyCoursePage
