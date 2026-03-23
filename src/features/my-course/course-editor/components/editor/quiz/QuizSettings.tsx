import React from 'react'
import type { Page, QuizPageData } from '../../../types/editor.types'
import { useCourseEditorStore } from '../../../store/use-course-editor-store'

type QuizSettingsProps = {
  page: Page
}

const QuizSettings: React.FC<QuizSettingsProps> = ({ page }) => {
  const updatePage = useCourseEditorStore((state) => state.updatePage)
  const quizPage = page.quizPage

  const updateQuizPage = (data: Partial<QuizPageData>) => {
    updatePage(page.id, {
      quizPage: {
        passingScore: 80,
        attemptAllowed: 1,
        questions: [],
        ...quizPage,
        ...data
      }
    })
  }

  return (
    <div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
      <h4 className='text-sm font-semibold text-gray-700'>Quiz settings</h4>
      <div className='mt-3 grid gap-4 md:grid-cols-2'>
        <label className='flex flex-col text-sm text-gray-600'>
          Passing score (%)
          <input
            type='number'
            value={quizPage?.passingScore ?? 80}
            onChange={(e) => updateQuizPage({ passingScore: Number(e.target.value) })}
            className='mt-2 rounded-lg border border-gray-300 px-3 py-2 text-sm'
          />
        </label>
        <label className='flex flex-col text-sm text-gray-600'>
          Attempts allowed
          <input
            type='number'
            value={quizPage?.attemptAllowed ?? 1}
            onChange={(e) => updateQuizPage({ attemptAllowed: Number(e.target.value) })}
            className='mt-2 rounded-lg border border-gray-300 px-3 py-2 text-sm'
          />
        </label>
      </div>
    </div>
  )
}

export default QuizSettings

