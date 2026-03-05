import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { GripVertical } from 'lucide-react'
import type { Page, Question } from '../types/course'
import { useCourseStore } from '../store/useCourseStore'
import { EditableText } from './EditableText'
import { buildLayoutStyle, buildThemeStyle } from './theme'
import { QuestionFactory } from './questions/QuestionFactory'

function QuestionView({
  question,
  sectionId,
  pageId,
  questionIndex
}: {
  question: Question
  sectionId: string
  pageId: string
  questionIndex: number
}) {
  const selectElement = useCourseStore((s) => s.selectElement)
  const selectedElement = useCourseStore((s) => s.selectedElement)
  const updateQuestion = useCourseStore((s) => s.updateQuestion)
  const toggleElementSelection = useCourseStore((s) => s.toggleElementSelection)
  const lockedElementIds = useCourseStore((s) => s.lockedElementIds)
  const dragData = React.useMemo(
    () => ({ type: 'question' as const, pageId, sectionId: String(questionIndex) }),
    [pageId, questionIndex]
  )
  const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({ id: question.id, data: dragData })

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border border-transparent p-4 transition ${selectedElement?.kind === 'question' && selectedElement.id === question.id ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'}`}
      style={{
        ...buildThemeStyle(question.themeOverride),
        ...buildLayoutStyle(question.layoutMode, question.layoutMeta),
        transform:
          (transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : '') +
          (typeof question.layoutMeta?.rotation === 'number' ? ` rotate(${question.layoutMeta.rotation}deg)` : ''),
        opacity: isDragging ? 0.7 : 1,
        pointerEvents: lockedElementIds.includes(question.id) ? 'none' : 'auto'
      }}
      onClick={(event) => {
        event.stopPropagation()
        selectElement({ kind: 'question', id: question.id, pageId })
        if (event.shiftKey) toggleElementSelection(question.id)
      }}
    >
      <div className='mb-3 flex items-center justify-between'>
        <div>
          <EditableText
            value={question.title}
            onSave={(newValue) => updateQuestion(sectionId, pageId, question.id, { title: newValue })}
            className='text-sm font-semibold text-gray-800'
            inputClassName='text-sm font-semibold text-gray-800'
            placeholder='Question title'
          />
          <div className='mt-1 text-xs text-gray-500'>{question.questionType}</div>
        </div>
        <button
          type='button'
          onClick={(event) => event.stopPropagation()}
          {...listeners}
          {...attributes}
          className='cursor-move rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600'
        >
          <GripVertical className='h-4 w-4' />
        </button>
      </div>
      <QuestionFactory
        question={question}
        mode='preview'
        onChange={(nextTemplateData) =>
          updateQuestion(sectionId, pageId, question.id, {
            templateData: nextTemplateData,
            promptHtml: nextTemplateData.prompt
          })
        }
      />
    </div>
  )
}

export function QuizBuilder({ page, sectionId }: { page: Page; sectionId: string }) {
  if (!page.quizPage) return null
  return (
    <div className='space-y-2'>
      {page.quizPage.questions.map((q, idx) => (
        <QuestionView key={q.id} question={q} sectionId={sectionId} pageId={page.id} questionIndex={idx} />
      ))}
      {page.quizPage.questions.length === 0 ? (
        <p className='rounded border border-dashed p-3 text-xs text-gray-400'>Drag question type here</p>
      ) : null}
    </div>
  )
}
