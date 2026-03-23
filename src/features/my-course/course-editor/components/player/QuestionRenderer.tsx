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
      className='rounded-lg border border-gray-200 p-4'
      aria-label='Quiz question'
      style={{
        background: questionTheme.background,
        color: questionTheme.color,
        borderRadius: questionTheme.borderRadius
      }}
    >
      <legend
        className='mb-3 text-sm font-semibold text-gray-800'
        dangerouslySetInnerHTML={{ __html: question.promptHtml }}
      />

      {(question.questionType === 'MCQ_SINGLE' || question.questionType === 'MCQ_MULTIPLE') && (
        <div className='space-y-2'>
          {question.options.map((option) => {
            const selected = Array.isArray(value)
              ? value.includes(option.id)
              : typeof value === 'string'
                ? value === option.id
                : false
            return (
              <label key={option.id} className='flex items-start gap-2 text-sm text-gray-700'>
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
                <span dangerouslySetInnerHTML={{ __html: option.labelHtml }} />
              </label>
            )
          })}
        </div>
      )}

      {question.questionType === 'TRUE_FALSE' && (
        <div className='flex gap-3 text-sm'>
          <label className='flex items-center gap-2'>
            <input type='radio' name={question.id} checked={value === true} onChange={() => onChange(true)} /> True
          </label>
          <label className='flex items-center gap-2'>
            <input type='radio' name={question.id} checked={value === false} onChange={() => onChange(false)} /> False
          </label>
        </div>
      )}

      {question.questionType === 'SHORT_ANSWER' && (
        <input
          className='w-full rounded border border-gray-300 px-3 py-2 text-sm'
          placeholder='Your answer'
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {question.questionType === 'FILL_IN_THE_BLANK' && (
        <div>
          <div className='mb-2 text-sm text-gray-700' dangerouslySetInnerHTML={{ __html: question.sentenceHtml }} />
          <input
            className='w-full rounded border border-gray-300 px-3 py-2 text-sm'
            placeholder='Fill blank'
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}

      {question.questionType === 'MATCHING' && (
        <div className='space-y-2'>
          {question.pairs.map((pair) => (
            <div
              key={pair.id}
              className='grid grid-cols-1 gap-2 rounded border border-gray-200 p-2 text-sm sm:grid-cols-2'
            >
              <span>{pair.left}</span>
              <input
                className='rounded border border-gray-300 px-2 py-1'
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
        <p className={`mt-3 text-sm font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? 'Correct' : 'Incorrect'}
        </p>
      )}
    </fieldset>
  )
}

export default QuestionRenderer
