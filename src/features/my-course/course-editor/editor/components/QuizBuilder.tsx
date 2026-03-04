import React from 'react'
import type { Page, Question } from '../types/course'
import { useCourseStore } from '../store/useCourseStore'

function QuestionView({ question, pageId }: { question: Question; pageId: string }) {
  const selectElement = useCourseStore((s) => s.selectElement)
  return (
    <div
      className='rounded-md border border-gray-200 bg-white p-3'
      onClick={() => selectElement({ kind: 'question', id: question.id, pageId })}
    >
      <div className='text-sm font-semibold text-gray-800'>{question.title}</div>
      <div className='mt-1 text-xs text-gray-500'>{question.questionType}</div>
      <div className='mt-2 text-sm' dangerouslySetInnerHTML={{ __html: question.promptHtml }} />
    </div>
  )
}

export function QuizBuilder({ page }: { page: Page }) {
  if (!page.quizPage) return null
  return (
    <div className='space-y-2'>
      {page.quizPage.questions.map((q) => (
        <QuestionView key={q.id} question={q} pageId={page.id} />
      ))}
      {page.quizPage.questions.length === 0 ? (
        <p className='rounded border border-dashed p-3 text-xs text-gray-400'>Drag question type here</p>
      ) : null}
    </div>
  )
}

