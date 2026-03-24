import React from 'react'
import {
  Check,
  CheckCircle,
  CheckCircle2,
  Circle,
  ListChecks,
  Pencil,
  Shuffle,
  Square,
  TextCursorInput,
  XCircle
} from 'lucide-react'
import type { Question, QuestionType } from '../../types/editor.types'
import { useCourseEditorStore } from '../../store/use-course-editor-store'
import { resolveTheme } from '../../utils/resolveTheme'

type QuestionAnswer = string | string[] | boolean | Record<string, string>

type Props = {
  question: Question
  value: QuestionAnswer | undefined
  checked: boolean
  isCorrect: boolean | null
  onChange: (value: QuestionAnswer) => void
  sectionId: string | null
  index?: number
  total?: number
}

const TYPE_STYLE: Record<
  QuestionType,
  { card: string; header: string; badge: string; accent: string; icon: React.ElementType }
> = {
  MCQ_SINGLE: {
    card: 'from-blue-50 to-white border-blue-200/70',
    header: 'from-blue-500/90 to-blue-400/80',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    accent: 'blue',
    icon: ListChecks
  },
  MCQ_MULTIPLE: {
    card: 'from-purple-50 to-white border-purple-200/70',
    header: 'from-purple-500/90 to-purple-400/80',
    badge: 'bg-purple-100 text-purple-700 border-purple-200',
    accent: 'purple',
    icon: ListChecks
  },
  TRUE_FALSE: {
    card: 'from-green-50 to-white border-green-200/70',
    header: 'from-green-500/90 to-green-400/80',
    badge: 'bg-green-100 text-green-700 border-green-200',
    accent: 'green',
    icon: CheckCircle
  },
  SHORT_ANSWER: {
    card: 'from-orange-50 to-white border-orange-200/70',
    header: 'from-orange-500/90 to-orange-400/80',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
    accent: 'orange',
    icon: Pencil
  },
  FILL_IN_THE_BLANK: {
    card: 'from-teal-50 to-white border-teal-200/70',
    header: 'from-teal-500/90 to-teal-400/80',
    badge: 'bg-teal-100 text-teal-700 border-teal-200',
    accent: 'teal',
    icon: TextCursorInput
  },
  MATCHING: {
    card: 'from-pink-50 to-white border-pink-200/70',
    header: 'from-pink-500/90 to-pink-400/80',
    badge: 'bg-pink-100 text-pink-700 border-pink-200',
    accent: 'pink',
    icon: Shuffle
  }
}

const typeLabel = (type: QuestionType) => type.replaceAll('_', ' ')

const QuestionRenderer: React.FC<Props> = ({
  question,
  value,
  checked,
  isCorrect,
  onChange,
  sectionId,
  index,
  total
}) => {
  const theme = useCourseEditorStore((state) => state.theme)
  const questionTheme = resolveTheme(
    theme.global,
    sectionId ? theme.sectionOverrides?.[sectionId] : undefined,
    question.themeOverride
  )
  const style = TYPE_STYLE[question.questionType]
  const TypeIcon = style.icon

  return (
    <fieldset
      className={`space-y-4 rounded-2xl border bg-gradient-to-br p-6 shadow-md transition hover:shadow-lg ${style.card}`}
      aria-label='Quiz question'
      style={{ color: questionTheme.color, borderRadius: questionTheme.borderRadius }}
    >
      <div className={`-m-2 mb-2 rounded-xl bg-gradient-to-r px-3 py-2 text-white ${style.header}`}>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <TypeIcon size={15} />
            <span className='text-xs font-semibold'>Question {typeof index === 'number' ? index + 1 : ''}</span>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${style.badge}`}
            >
              {typeLabel(question.questionType)}
            </span>
          </div>
          {typeof index === 'number' && typeof total === 'number' ? (
            <span className='text-[11px] font-semibold text-white/90'>
              {index + 1}/{total}
            </span>
          ) : null}
        </div>
      </div>

      <legend className='mb-2 text-base font-semibold text-gray-800'>
        <span dangerouslySetInnerHTML={{ __html: question.promptHtml }} />
      </legend>

      {(question.questionType === 'MCQ_SINGLE' || question.questionType === 'MCQ_MULTIPLE') && (
        <div className='space-y-3'>
          {question.options.map((option) => {
            const selected = Array.isArray(value)
              ? value.includes(option.id)
              : typeof value === 'string'
                ? value === option.id
                : false
            const activeClass =
              style.accent === 'blue'
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-purple-400 bg-purple-50 text-purple-700'
            const hoverClass = style.accent === 'blue' ? 'hover:border-blue-300' : 'hover:border-purple-300'

            return (
              <label
                key={option.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                  selected ? activeClass : `border-gray-200 bg-white hover:bg-white ${hoverClass}`
                }`}
              >
                <span className='relative mt-0.5 grid h-5 w-5 place-items-center'>
                  {question.questionType === 'MCQ_SINGLE' ? (
                    <Circle size={18} className={selected ? 'text-current' : 'text-gray-400'} />
                  ) : (
                    <Square size={18} className={selected ? 'text-current' : 'text-gray-400'} />
                  )}
                  {selected && <Check size={12} className='absolute text-current' />}
                </span>
                <input
                  type={question.questionType === 'MCQ_SINGLE' ? 'radio' : 'checkbox'}
                  name={question.id}
                  checked={selected}
                  onChange={(e) => {
                    if (question.questionType === 'MCQ_SINGLE') {
                      onChange(option.id)
                    } else {
                      const prev = Array.isArray(value) ? value : []
                      onChange(e.target.checked ? [...prev, option.id] : prev.filter((id) => id !== option.id))
                    }
                  }}
                  className='sr-only'
                />
                <span className='text-sm' dangerouslySetInnerHTML={{ __html: option.labelHtml }} />
              </label>
            )
          })}
        </div>
      )}

      {question.questionType === 'TRUE_FALSE' && (
        <div className='grid gap-3 sm:grid-cols-2'>
          <label
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-sm font-semibold transition ${
              value === true
                ? 'border-green-400 bg-green-50 text-green-700 shadow-sm'
                : 'border-gray-200 bg-white/70 text-gray-700 hover:border-green-300'
            }`}
          >
            <input
              type='radio'
              name={question.id}
              checked={value === true}
              onChange={() => onChange(true)}
              className='sr-only'
            />
            <CheckCircle2 size={18} /> True
          </label>
          <label
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-sm font-semibold transition ${
              value === false
                ? 'border-green-400 bg-green-50 text-green-700 shadow-sm'
                : 'border-gray-200 bg-white/70 text-gray-700 hover:border-green-300'
            }`}
          >
            <input
              type='radio'
              name={question.id}
              checked={value === false}
              onChange={() => onChange(false)}
              className='sr-only'
            />
            <XCircle size={18} /> False
          </label>
        </div>
      )}

      {question.questionType === 'SHORT_ANSWER' && (
        <input
          className='w-full rounded-lg border border-orange-200 bg-white/80 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-orange-200'
          placeholder='Your answer'
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {question.questionType === 'FILL_IN_THE_BLANK' && (
        <div className='space-y-2'>
          <div
            className='rounded-xl border border-teal-200 bg-white/80 p-3 text-sm text-gray-700'
            dangerouslySetInnerHTML={{ __html: question.sentenceHtml }}
          />
          <input
            className='w-full rounded-lg border border-teal-200 bg-white/80 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-teal-200'
            placeholder='Fill blank'
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}

      {question.questionType === 'MATCHING' && (
        <div className='space-y-3'>
          {question.pairs.map((pair) => (
            <div
              key={pair.id}
              className='grid grid-cols-1 gap-3 rounded-xl border border-pink-200 bg-white/80 p-3 text-sm sm:grid-cols-2'
            >
              <span className='font-medium text-gray-700'>{pair.left}</span>
              <input
                className='border-b border-gray-300 bg-transparent pb-1 italic outline-none focus:border-pink-500'
                placeholder='Type matching right value'
                value={
                  typeof value === 'object' && !Array.isArray(value) && value !== null ? (value[pair.id] ?? '') : ''
                }
                onChange={(e) => {
                  const prev = typeof value === 'object' && !Array.isArray(value) && value !== null ? value : {}
                  onChange({ ...prev, [pair.id]: e.target.value })
                }}
              />
            </div>
          ))}
        </div>
      )}

      {checked && (
        <p
          className={`rounded-lg px-3 py-2 text-sm font-medium ${isCorrect ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
        >
          {isCorrect ? 'Correct' : 'Incorrect'}
        </p>
      )}
    </fieldset>
  )
}

export default QuestionRenderer
