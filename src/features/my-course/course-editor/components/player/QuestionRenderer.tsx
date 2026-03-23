import React from 'react'
import type { Question } from '../../types/editor.types'
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
}

const QuestionRenderer: React.FC<Props> = ({ question, value, checked, isCorrect, onChange, sectionId }) => {
  const theme = useCourseEditorStore((state) => state.theme)
  const questionTheme = resolveTheme(
    theme.global,
    sectionId ? theme.sectionOverrides?.[sectionId] : undefined,
    question.themeOverride
  )

  return (
    <fieldset
      className='space-y-4 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md'
      aria-label='Quiz question'
      style={{
        background: questionTheme.background,
        color: questionTheme.color,
        borderRadius: questionTheme.borderRadius
      }}
    >
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
            return (
              <label
                key={option.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                  selected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
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
                />
                <span className='text-sm text-gray-700' dangerouslySetInnerHTML={{ __html: option.labelHtml }} />
              </label>
            )
          })}
        </div>
      )}

      {question.questionType === 'TRUE_FALSE' && (
        <div className='flex gap-3'>
          <label
            className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium transition ${
              value === true
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-gray-200 text-gray-700 hover:border-blue-300'
            }`}
          >
            <input
              type='radio'
              name={question.id}
              checked={value === true}
              onChange={() => onChange(true)}
              className='sr-only'
            />
            True
          </label>
          <label
            className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium transition ${
              value === false
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-gray-200 text-gray-700 hover:border-blue-300'
            }`}
          >
            <input
              type='radio'
              name={question.id}
              checked={value === false}
              onChange={() => onChange(false)}
              className='sr-only'
            />
            False
          </label>
        </div>
      )}

      {question.questionType === 'SHORT_ANSWER' && (
        <input
          className='w-full border-b border-gray-300 bg-transparent pb-2 text-sm outline-none focus:border-blue-500'
          placeholder='Your answer'
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {question.questionType === 'FILL_IN_THE_BLANK' && (
        <div className='space-y-2'>
          <div className='text-sm text-gray-700' dangerouslySetInnerHTML={{ __html: question.sentenceHtml }} />
          <input
            className='w-full border-b border-gray-300 bg-transparent pb-2 text-sm outline-none focus:border-blue-500'
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
              className='grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-3 text-sm sm:grid-cols-2'
            >
              <span className='font-medium text-gray-700'>{pair.left}</span>
              <input
                className='border-b border-gray-300 bg-transparent pb-1 outline-none focus:border-blue-500'
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
