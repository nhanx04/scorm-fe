import React from 'react'
import { useCourseEditorStore } from '../../store/use-course-editor-store'
import ContentPageEditor from './content/ContentPageEditor'
import QuizPageEditor from './quiz/QuizPageEditor'

const PageEditor: React.FC = () => {
  const activePageId = useCourseEditorStore((state) => state.activePageId)
  const page = useCourseEditorStore((state) => (state.activePageId ? state.pages[state.activePageId] : null))
  const updatePage = useCourseEditorStore((state) => state.updatePage)

  if (!activePageId || !page) {
    return (
      <div className='rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-500'>
        Select or create a page
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <input
        value={page.title}
        onChange={(e) => updatePage(page.id, { title: e.target.value })}
        className='w-full border-b border-gray-300 bg-transparent p-2 text-sm text-gray-800 outline-none transition focus:border-blue-500'
        placeholder='Page title'
      />

      {page.type === 'content' ? <ContentPageEditor page={page} /> : <QuizPageEditor page={page} />}
    </div>
  )
}

export default PageEditor
