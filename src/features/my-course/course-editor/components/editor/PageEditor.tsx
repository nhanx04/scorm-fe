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
        className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200'
        placeholder='Page title'
      />

      {page.type === 'content' ? <ContentPageEditor page={page} /> : <QuizPageEditor page={page} />}
    </div>
  )
}

export default PageEditor
