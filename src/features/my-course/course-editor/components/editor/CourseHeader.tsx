import React from 'react'
import { useCourseEditorStore } from '../../store/use-course-editor-store'
import ExportActions from './ExportActions'
import ThemePanel from './theme/ThemePanel'

const CourseHeader: React.FC = () => {
  const course = useCourseEditorStore((state) => state.course)
  const updateCourse = useCourseEditorStore((state) => state.updateCourse)

  return (
    <div className='space-y-5'>
      {/* Theme Panel */}
      <div className='bg-white p-1  rounded-sm shadow-sm'>
        <ThemePanel />
      </div>

      {/* Header */}
      <div className='flex flex-col gap-1 bg-white p-8 shadow-sm'>
        <div className='flex items-center justify-between gap-4'>
          <input
            value={course.title}
            onChange={(e) => updateCourse({ title: e.target.value })}
            placeholder='Untitled Course'
            className='w-full bg-transparent text-2xl font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none'
          />

          <div className='flex items-center gap-2'>
            <ExportActions courseId={course.id} />
          </div>
        </div>

        <textarea
          value={course.description ?? ''}
          onChange={(e) => updateCourse({ description: e.target.value })}
          rows={2}
          placeholder='Write a short description about this course...'
          className='w-full resize-none bg-transparent text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none'
        />
      </div>
    </div>
  )
}

export default CourseHeader
