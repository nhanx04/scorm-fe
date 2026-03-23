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
    <div className='rounded-2xl bg-gray-50/70 p-5'>
      {/* Header */}
      <div className='mb-4'>
        <h4 className='text-base font-semibold text-gray-800'>Quiz settings</h4>
        <p className='text-sm text-gray-500'>Configure passing score and attempt limits for this quiz</p>
      </div>

      {/* Fields */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* Passing Score */}
        <div className='space-y-1'>
          <label className='text-xs font-medium uppercase tracking-wide text-gray-500'>Passing score (%)</label>
          <input
            type='number'
            value={quizPage?.passingScore ?? 80}
            onChange={(e) => updateQuizPage({ passingScore: Number(e.target.value) })}
            className='w-full border-b border-gray-300 bg-transparent py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500'
          />
          <p className='text-xs text-gray-400'>Minimum score required to pass</p>
        </div>

        {/* Attempts */}
        <div className='space-y-1'>
          <label className='text-xs font-medium uppercase tracking-wide text-gray-500'>Attempts allowed</label>
          <input
            type='number'
            value={quizPage?.attemptAllowed ?? 1}
            onChange={(e) => updateQuizPage({ attemptAllowed: Number(e.target.value) })}
            className='w-full border-b border-gray-300 bg-transparent py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500'
          />
          <p className='text-xs text-gray-400'>Number of times learners can retry</p>
        </div>
      </div>
    </div>
  )
}

export default QuizSettings
