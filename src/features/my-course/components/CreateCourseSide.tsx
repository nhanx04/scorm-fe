import React, { useState } from 'react'
import { FiPlus, FiFolderPlus, FiShare2 } from 'react-icons/fi'

interface CourseItem {
  id: string
  label: string
}

const CreateCourseSide = () => {
  const [myCourses] = useState<CourseItem[]>([
    { id: '1', label: 'Course 1' },
    { id: '2', label: 'Course 2' },
    { id: '3', label: 'Course 3' }
  ])

  const [sharedCourses] = useState<CourseItem[]>([])

  const handleCreateCourse = () => {
    console.log('Create new course')
    // TODO: Implement create course logic
  }

  const handleNewFolder = () => {
    console.log('Create new folder')
    // TODO: Implement new folder logic
  }

  return (
    <aside className='h-full border-r border-gray-200 p-6'>
      {/* Create Course Button */}
      <div className='flex justify-center'>
        <button
          onClick={handleCreateCourse}
          className='w-60 flex items-center justify-center gap-2 bg-teal-500 hover:bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-full transition-colors duration-200 shadow-sm mb-8'
        >
          <FiPlus size={18} />
          <span>Create course</span>
        </button>
      </div>

      {/* My Courses Section */}
      <div className='mb-8'>
        <div className='flex items-center gap-2 mb-4'>
          <FiFolderPlus size={20} className='text-gray-600' />
          <h3 className='text-gray-900 font-semibold'>My courses</h3>
          <span className='ml-auto bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full'>
            {myCourses.length}
          </span>
        </div>

        {/* New Folder Option */}
        <button
          onClick={handleNewFolder}
          className='w-full flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors duration-150 text-sm'
        >
          <FiFolderPlus size={16} />
          <span>New folder</span>
        </button>

        {/* Course List */}
        <div className='mt-2 space-y-1'>
          {myCourses.map((course) => (
            <button
              key={course.id}
              className='w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors duration-150 text-sm'
            >
              {course.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shared Courses Section */}
      <div>
        <div className='flex items-center gap-2 mb-4'>
          <FiShare2 size={20} className='text-gray-600' />
          <h3 className='text-gray-900 font-semibold'>Shared courses</h3>
          <span className='ml-auto bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full'>
            {sharedCourses.length}
          </span>
        </div>

        {/* Empty State */}
        {sharedCourses.length === 0 && <p className='text-gray-500 text-sm px-3 py-2'>No shared courses yet</p>}

        {/* Shared Course List */}
        <div className='space-y-1'>
          {sharedCourses.map((course) => (
            <button
              key={course.id}
              className='w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors duration-150 text-sm'
            >
              {course.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default CreateCourseSide
