import React from 'react'
import CourseHeader from './CourseHeader'
import PageEditor from './PageEditor'
import { useCourseEditorStore } from '../../store/use-course-editor-store'
import PlayerLayout from '../player/PlayerLayout'

const MainEditor: React.FC = () => {
  const mode = useCourseEditorStore((state) => state.mode)
  const setMode = useCourseEditorStore((state) => state.setMode)

  return (
    <div className='min-h-screen space-y-4 bg-gray-100'>
      <div className='mx-auto max-w-6xl p-4'>
        {/* HEADER */}
        <CourseHeader />

        {/* PAGE EDITOR */}
        <div className='bg-white p-10 shadow-sm border-t-1 border-gray-200'>
          <PageEditor />
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {mode === 'preview' && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
          <div className='relative w-full max-w-6xl rounded-2xl bg-white shadow-2xl'>
            {/* Top bar */}
            <div className='flex items-center justify-between border-b p-4'>
              <span className='text-sm font-semibold text-gray-700'>Preview Mode</span>

              <button
                onClick={() => setMode('edit')}
                className='rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100'
              >
                Close
              </button>
            </div>

            {/* Content */}
            <div className='max-h-[85vh] overflow-auto p-4'>
              <PlayerLayout />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MainEditor
