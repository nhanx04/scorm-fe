import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { CheckCircle2, CircleDot, HelpCircle, Link2, PenSquare, Sparkles, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Page, QuestionType } from '../../../types/editor.types'
import { useCourseEditorStore } from '../../../store/use-course-editor-store'
import { generateQuiz } from '../../../api/aiApi'

const TYPES: { type: QuestionType; label: string; description: string; icon: LucideIcon }[] = [
  { type: 'MCQ_SINGLE', label: 'MCQ Single', description: 'One correct answer', icon: CircleDot },
  { type: 'MCQ_MULTIPLE', label: 'MCQ Multiple', description: 'Multiple correct answers', icon: CheckCircle2 },
  { type: 'TRUE_FALSE', label: 'True / False', description: 'Binary answer question', icon: HelpCircle },
  { type: 'FILL_IN_THE_BLANK', label: 'Fill in blank', description: 'Complete missing words', icon: PenSquare },
  { type: 'MATCHING', label: 'Matching', description: 'Match two related columns', icon: Link2 },
  { type: 'SHORT_ANSWER', label: 'Short answer', description: 'Free text response', icon: Sparkles }
]

type Props = { page: Page }

const AddQuestionModal: React.FC<Props> = ({ page }) => {
  const addQuestion = useCourseEditorStore((s) => s.addQuestion)
  const updateQuestion = useCourseEditorStore((s) => s.updateQuestion)
  const questionOrder = useCourseEditorStore((s) => s.questionOrder[page.id] ?? [])
  const course = useCourseEditorStore((s) => s.course)
  const { courseId: routeCourseId } = useParams<{ courseId: string }>()
  // courseId thật của backend: ưu tiên serverId trong store, fallback route param
  const resolvedCourseId =
    course.serverId ?? (routeCourseId && routeCourseId !== 'new' ? Number(routeCourseId) : undefined)
  const [open, setOpen] = useState(false)
  // Topic to base the quiz on; defaults to the page title so one click works,
  // and the user can refine it. The course document is the source of facts.
  const [aiPrompt, setAiPrompt] = useState(page.title ?? '')
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Mixed'>('Medium')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [generatedQuestions, setGeneratedQuestions] = useState<
    Array<{
      type: QuestionType
      prompt: string
      options?: string[]
      correctAnswer?: boolean | string | string[]
      explanation?: string
      sentenceHtml?: string
      pairs?: Array<{ left: string; right: string }>
    }>
  >([])

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

  const addGeneratedQuestionsToCourse = () => {
    for (const generated of generatedQuestions) {
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
        updateQuestion(page.id, createdId, {
          promptHtml: `<p>${generated.prompt}</p>`,
          options,
          explanationHtml: generated.explanation ? `<p>${generated.explanation}</p>` : undefined
        } as never)
      } else if (mappedType === 'TRUE_FALSE') {
        updateQuestion(page.id, createdId, {
          promptHtml: `<p>${generated.prompt}</p>`,
          correctAnswer: String(generated.correctAnswer).toLowerCase() === 'true',
          explanationHtml: generated.explanation ? `<p>${generated.explanation}</p>` : undefined
        } as never)
      } else if (mappedType === 'SHORT_ANSWER') {
        updateQuestion(page.id, createdId, {
          promptHtml: `<p>${generated.prompt}</p>`,
          acceptableAnswers: Array.isArray(generated.correctAnswer)
            ? generated.correctAnswer.map(String)
            : generated.correctAnswer
              ? [String(generated.correctAnswer)]
              : [],
          explanationHtml: generated.explanation ? `<p>${generated.explanation}</p>` : undefined
        } as never)
      } else if (mappedType === 'FILL_IN_THE_BLANK') {
        updateQuestion(page.id, createdId, {
          promptHtml: `<p>${generated.prompt}</p>`,
          sentenceHtml: generated.sentenceHtml ?? `<p>${generated.prompt}</p>`,
          answers: Array.isArray(generated.correctAnswer)
            ? generated.correctAnswer.map(String)
            : generated.correctAnswer
              ? [String(generated.correctAnswer)]
              : [''],
          explanationHtml: generated.explanation ? `<p>${generated.explanation}</p>` : undefined
        } as never)
      } else if (mappedType === 'MATCHING') {
        updateQuestion(page.id, createdId, {
          promptHtml: `<p>${generated.prompt}</p>`,
          pairs: (generated.pairs ?? []).map((pair) => ({
            id: crypto.randomUUID(),
            left: pair.left,
            right: pair.right
          })),
          explanationHtml: generated.explanation ? `<p>${generated.explanation}</p>` : undefined
        } as never)
      }
    }
    setGeneratedQuestions([])
  }

  const handleGenerateQuiz = async () => {
    if (!aiPrompt.trim()) return
    setGenerateError(null)
    setIsGenerating(true)
    try {
      const result = await generateQuiz({
        courseId: resolvedCourseId,
        // Ô người dùng nhập = chủ đề trọng tâm; backend tự lấy tài liệu gốc làm nguồn
        focusTopic: aiPrompt,
        numberOfQuestions: 6,
        language: 'auto', // ngôn ngữ theo tài liệu/nội dung nhập, không ép cứng
        difficulty
      })
      setGeneratedQuestions(
        (result.questions ?? []).map((generated) => ({
          ...generated,
          type: questionTypeMap[generated.type] ?? 'SHORT_ANSWER'
        }))
      )
    } catch {
      setGenerateError('AI chưa thể tạo câu hỏi lúc này. Vui lòng thử lại.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <div className='flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm'>
        <div>
          <p className='text-sm font-semibold text-gray-800'>Questions</p>
          <p className='text-xs text-gray-500'>{questionOrder.length} created</p>
        </div>
        <button
          type='button'
          onClick={() => setOpen(true)}
          className='rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:scale-[1.02] hover:bg-blue-100'
        >
          + Add question
        </button>
      </div>

      <div className='rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 p-4'>
        <p className='mb-2 text-sm font-semibold text-gray-700'>Generate with AI</p>
        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          rows={3}
          className='w-full resize-none bg-transparent text-sm text-gray-700 outline-none'
          placeholder='Enter the topic to base the quiz on (defaults to the page title)…'
        />
        <div className='mt-3 flex flex-wrap items-center gap-2'>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard' | 'Mixed')}
            aria-label='Difficulty'
            className='rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-700'
          >
            <option value='Easy'>Easy</option>
            <option value='Medium'>Medium</option>
            <option value='Hard'>Hard</option>
            <option value='Mixed'>Mixed</option>
          </select>
          <button
            type='button'
            onClick={handleGenerateQuiz}
            disabled={isGenerating}
            className='rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm text-white transition hover:scale-[1.02] disabled:opacity-60'
          >
            {isGenerating ? 'Generating...' : 'Generate questions'}
          </button>
          <button
            type='button'
            onClick={addGeneratedQuestionsToCourse}
            disabled={generatedQuestions.length === 0}
            className='rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-blue-700 disabled:opacity-50'
          >
            Add to course ({generatedQuestions.length})
          </button>
        </div>

        {generateError ? <p className='mt-2 text-xs text-red-600'>{generateError}</p> : null}

        {isGenerating ? (
          <div className='mt-3 space-y-2'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-12 animate-pulse rounded-lg bg-white/70' />
            ))}
          </div>
        ) : generatedQuestions.length > 0 ? (
          <div className='mt-3 space-y-2'>
            {generatedQuestions.map((q, index) => (
              <div key={`${q.type}-${index}`} className='rounded-lg border border-blue-100 bg-white p-3'>
                <p className='text-xs font-semibold text-blue-700'>{q.type}</p>
                <p className='text-sm text-gray-800'>{q.prompt}</p>
                {q.explanation ? <p className='mt-1 text-xs text-gray-500'>Giải thích: {q.explanation}</p> : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {open && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4'>
          <div className='w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200'>
            <div className='mb-5 flex items-start justify-between'>
              <div>
                <h3 className='text-xl font-semibold text-gray-900'>Add Question</h3>
                <p className='text-sm text-gray-500'>Choose question type</p>
              </div>
              <button
                type='button'
                onClick={() => setOpen(false)}
                className='rounded-lg p-1 text-gray-500 hover:bg-gray-100'
              >
                <X size={18} />
              </button>
            </div>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {TYPES.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.type}
                    type='button'
                    onClick={() => {
                      addQuestion(page.id, item.type)
                      setOpen(false)
                    }}
                    className='cursor-pointer rounded-xl border border-gray-200 p-4 text-left transition hover:border-blue-400 hover:shadow-md'
                  >
                    <Icon size={18} className='mb-2 text-blue-600' />
                    <p className='text-sm font-semibold text-gray-800'>{item.label}</p>
                    <p className='text-xs text-gray-500'>{item.description}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddQuestionModal
