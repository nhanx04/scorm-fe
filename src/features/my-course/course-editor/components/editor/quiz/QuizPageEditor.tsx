import React from 'react'
import type { Page } from '../../../types/editor.types'
import QuizSettings from './QuizSettings'
import AddQuestionModal from './AddQuestionModal'
import QuestionList from './QuestionList'

type QuizPageEditorProps = {
  page: Page
}

const QuizPageEditor: React.FC<QuizPageEditorProps> = ({ page }) => {
  if (page.type !== 'quiz') return null

  return (
    <div className='space-y-6 rounded-xl border border-gray-200 p-4'>
      <QuizSettings page={page} />
      <AddQuestionModal page={page} />
      <QuestionList page={page} />
    </div>
  )
}

export default QuizPageEditor

