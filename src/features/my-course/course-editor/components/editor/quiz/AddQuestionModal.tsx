import React, { useMemo, useState } from 'react'
import type { Page, QuestionType } from '../../../types/editor.types'
import { useCourseEditorStore } from '../../../store/use-course-editor-store'
import { generateQuiz } from '../../../api/aiApi'

const TYPES: { type: QuestionType; label: string }[] = [
  { type: 'MCQ_SINGLE', label: 'Single choice' },
  { type: 'MCQ_MULTIPLE', label: 'Multiple choice' },
  { type: 'TRUE_FALSE', label: 'True/False' },
  { type: 'FILL_IN_THE_BLANK', label: 'Fill blank' },
  { type: 'MATCHING', label: 'Matching' },
  { type: 'SHORT_ANSWER', label: 'Short answer' }
]

type Props = { page: Page }

const AddQuestionModal: React.FC<Props> = ({ page }) => {
  const addQuestion = useCourseEditorStore((s) => s.addQuestion)
  const updateQuestion = useCourseEditorStore((s) => s.updateQuestion)
  const questionOrder = useCourseEditorStore((s) => s.questionOrder[page.id] ?? [])
  const [aiPrompt, setAiPrompt] = useState('Generate a beginner-level quiz for this page topic')
  const [isGenerating, setIsGenerating] = useState(false)

  const questionTypeMap = useMemo<Record<string, QuestionType>>(
    () => ({
      MCQ_SINGLE: 'MCQ_SINGLE',
      MCQ_MULTIPLE: 'MCQ_MULTIPLE',
      TRUE_FALSE: 'TRUE_FALSE',
      SHORT_ANSWER: 'SHORT_ANSWER',
      FILL_IN_THE_BLANK: 'FILL_IN_THE_BLANK',
      MATCHING: 'MATCHING'
    }),
    []
  )

  const handleGenerateQuiz = async () => {
    if (!aiPrompt.trim()) return
    setIsGenerating(true)
    try {
      const result = await generateQuiz(aiPrompt)
      for (const generated of result.questions ?? []) {
        const mappedType = questionTypeMap[generated.type] ?? 'SHORT_ANSWER'
        const prevLength = (useCourseEditorStore.getState().questionOrder[page.id] ?? []).length
        addQuestion(page.id, mappedType)
        const createdId = useCourseEditorStore.getState().questionOrder[page.id]?.[prevLength]
        if (!createdId) continue

        if (mappedType === 'MCQ_SINGLE' || mappedType === 'MCQ_MULTIPLE') {
          const options = (generated.options ?? ['Option 1', 'Option 2']).map((label, index) => ({
            id: crypto.randomUUID(),
            labelHtml: `<p>${label}</p>`,
            isCorrect: Array.isArray(generated.correctAnswer)
              ? generated.correctAnswer.includes(label)
              : String(generated.correctAnswer ?? '') === label || index === 0
          }))
          updateQuestion(page.id, createdId, { promptHtml: `<p>${generated.prompt}</p>`, options } as never)
        } else if (mappedType === 'TRUE_FALSE') {
          updateQuestion(page.id, createdId, {
            promptHtml: `<p>${generated.prompt}</p>`,
            correctAnswer: String(generated.correctAnswer).toLowerCase() === 'true'
          } as never)
        } else if (mappedType === 'SHORT_ANSWER') {
          updateQuestion(page.id, createdId, {
            promptHtml: `<p>${generated.prompt}</p>`,
            acceptableAnswers: Array.isArray(generated.correctAnswer)
              ? generated.correctAnswer.map(String)
              : generated.correctAnswer
                ? [String(generated.correctAnswer)]
                : []
          } as never)
        } else if (mappedType === 'FILL_IN_THE_BLANK') {
          updateQuestion(page.id, createdId, {
            promptHtml: `<p>${generated.prompt}</p>`,
            sentenceHtml: generated.sentenceHtml ?? `<p>${generated.prompt}</p>`,
            answers: Array.isArray(generated.correctAnswer)
              ? generated.correctAnswer.map(String)
              : generated.correctAnswer
                ? [String(generated.correctAnswer)]
                : ['']
          } as never)
        } else if (mappedType === 'MATCHING') {
          updateQuestion(page.id, createdId, {
            promptHtml: `<p>${generated.prompt}</p>`,
            pairs: (generated.pairs ?? []).map((pair) => ({
              id: crypto.randomUUID(),
              left: pair.left,
              right: pair.right
            }))
          } as never)
        }
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className='space-y-3 rounded-xl border border-gray-200 bg-white p-3'>
      <div className='flex items-center justify-between'>
        <p className='text-sm font-semibold text-gray-700'>Add questions</p>
        <span className='text-xs text-gray-500'>{questionOrder.length} questions</span>
      </div>

      <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
        {TYPES.map((item) => (
          <button
            key={item.type}
            type='button'
            className='rounded-lg border border-gray-300 px-3 py-2 text-left text-sm hover:bg-gray-50'
            onClick={() => addQuestion(page.id, item.type)}
          >
            + {item.label}
          </button>
        ))}
      </div>

      <div className='rounded-lg border border-gray-200 p-3'>
        <p className='mb-2 text-xs font-semibold text-gray-600'>Generate Quiz with AI</p>
        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          rows={3}
          className='w-full rounded-lg border border-gray-300 p-2 text-sm'
          placeholder='Describe what quiz to generate...'
        />
        <button
          type='button'
          onClick={handleGenerateQuiz}
          disabled={isGenerating}
          className='mt-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-60'
        >
          {isGenerating ? 'Generating...' : 'Generate questions'}
        </button>
      </div>
    </div>
  )
}

export default AddQuestionModal
