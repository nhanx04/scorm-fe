import React, { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import type { CreateScormPackageRequest } from '../../../services/api'
import QuestionEditor from './QuestionEditor'
import { FiPlus } from 'react-icons/fi'

type Question = CreateScormPackageRequest['questions'][0]

type QuestionListProps = {
  questions: Question[]
  onChange: (questions: Question[]) => void
}

const defaultQuestion: Question = {
  text: '',
  questionType: 'MULTIPLE_CHOICE',
  answers: [
    { text: '', correct: false, answerOrder: 0 },
    { text: '', correct: false, answerOrder: 1 }
  ],
  questionOrder: 0
}

const QuestionList: React.FC<QuestionListProps> = ({ questions = [], onChange }) => {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addQuestion = () => {
    const newQuestion = {
      ...defaultQuestion,
      questionOrder: questions.length
    }
    onChange([...questions, newQuestion])
  }

  const updateQuestion = (index: number, question: Question) => {
    const newQuestions = [...questions]
    newQuestions[index] = question
    onChange(newQuestions)
  }

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index)
    // Update question orders
    const reorderedQuestions = newQuestions.map((q, idx) => ({
      ...q,
      questionOrder: idx
    }))
    onChange(reorderedQuestions)
  }

  const moveQuestion = (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) return

    const newQuestions = arrayMove(questions, oldIndex, newIndex)
    // Update question orders
    const reorderedQuestions = newQuestions.map((q, idx) => ({
      ...q,
      questionOrder: idx
    }))
    onChange(reorderedQuestions)
  }

  const handleDragStart = (event: any) => {
    const { active } = event
    setActiveId(active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    setActiveId(null)

    // If dropped outside a valid target
    if (!over) return

    if (active.id !== over.id) {
      const oldIndex = questions.findIndex((_, i) => `question-${i}` === active.id)
      const newIndex = questions.findIndex((_, i) => `question-${i}` === over.id)
      if (oldIndex >= 0 && newIndex >= 0) {
        moveQuestion(oldIndex, newIndex)
      }
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center mb-2'>
        <h3 className='text-lg font-medium text-gray-900'>Danh sách câu hỏi</h3>
        <button
          type='button'
          onClick={addQuestion}
          className='inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          <FiPlus className='-ml-0.5 mr-1.5 h-4 w-4' />
          Thêm câu hỏi
        </button>
      </div>

      {questions.length === 0 ? (
        <div className='text-center py-12 border-2 border-dashed border-gray-300 rounded-lg'>
          <svg
            className='mx-auto h-12 w-12 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1'
              d='M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
          <h3 className='mt-2 text-sm font-medium text-gray-900'>Chưa có câu hỏi nào</h3>
          <p className='mt-1 text-sm text-gray-500'>Bắt đầu bằng cách thêm câu hỏi đầu tiên của bạn.</p>
          <div className='mt-6'>
            <button
              type='button'
              onClick={addQuestion}
              className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              <FiPlus className='-ml-1 mr-2 h-5 w-5' />
              Thêm câu hỏi
            </button>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={questions.map((_, i) => `question-${i}`)} strategy={verticalListSortingStrategy}>
            <div className='space-y-4'>
              {questions.map((question, index) => (
                <QuestionEditor
                  key={`question-${index}`}
                  question={{
                    ...question,
                    questionOrder: index
                  }}
                  onChange={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                  onRemove={() => removeQuestion(index)}
                  onMoveUp={index > 0 ? () => moveQuestion(index, index - 1) : undefined}
                  onMoveDown={index < questions.length - 1 ? () => moveQuestion(index, index + 1) : undefined}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}

export default QuestionList
