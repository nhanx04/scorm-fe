import React from 'react'
import { DndContext } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { EditorState, Page, Question } from '../../../types/editor.types'
import { useCourseEditorStore } from '../../../store/use-course-editor-store'
import QuestionItem from './QuestionItem'

type Props = { page: Page }

const QuestionList: React.FC<Props> = ({ page }) => {
  const reorderQuestions = useCourseEditorStore((s) => s.reorderQuestions)
  const questionIds = useCourseEditorStore((state: EditorState) => state.questionOrder[page.id] ?? [])
  const questionMap = useCourseEditorStore((state: EditorState) => state.questions)
  const questions = questionIds.map((qid) => questionMap[qid]).filter(Boolean) as Question[]

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    reorderQuestions(page.id, String(active.id), String(over.id))
  }

  if (questions.length === 0) {
    return (
      <div className='rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-500'>
        Add your first question to get started.
      </div>
    )
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
        <div className='space-y-4'>
          {questions.map((question, index) => (
            <QuestionItem key={question.id} question={question} page={page} index={index} total={questions.length} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

export default QuestionList
