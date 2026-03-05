import React from 'react'
import type { Question, QuestionTemplateData } from '../../types/course'
import { TipTapEditor } from '../TipTapEditor'
import {
  FillInTheBlankPreview,
  MatchingPreview,
  McqMultiplePreview,
  McqSinglePreview,
  ShortAnswerPreview,
  TrueFalsePreview
} from './QuestionTemplates'

function BaseEditor({
  data,
  onChange
}: {
  data: QuestionTemplateData
  onChange: (patch: Partial<QuestionTemplateData>) => void
}) {
  return (
    <div className='space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg'>
      <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Question content</p>
      <div className='space-y-1'>
        <p className='text-xs text-slate-600'>Prompt</p>
        <TipTapEditor
          value={data.prompt || '<p></p>'}
          onChange={(html) => onChange({ prompt: html })}
          minHeightClassName='min-h-[120px]'
          placeholder='Write question prompt...'
        />
      </div>
      <div className='space-y-1'>
        <p className='text-xs text-slate-600'>Explanation</p>
        <TipTapEditor
          value={data.explanation || '<p></p>'}
          onChange={(html) => onChange({ explanation: html })}
          minHeightClassName='min-h-[80px]'
          placeholder='Add explanation (optional)...'
        />
      </div>
    </div>
  )
}

function McqEditor({
  data,
  onChange,
  multiple
}: {
  data: QuestionTemplateData
  onChange: (patch: Partial<QuestionTemplateData>) => void
  multiple?: boolean
}) {
  const options = data.options ?? []
  const selected = data.correctAnswer
  return (
    <div className='space-y-3'>
      <BaseEditor data={data} onChange={onChange} />
      <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-lg'>
        <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500'>Options</p>
        <div className='space-y-2'>
          {options.map((o) => (
            <div key={o.id} className='flex gap-2'>
              <div className='flex-1'>
                <TipTapEditor
                  value={o.label || '<p></p>'}
                  onChange={(html) =>
                    onChange({ options: options.map((x) => (x.id === o.id ? { ...x, label: html } : x)) })
                  }
                  minHeightClassName='min-h-[70px]'
                  placeholder={`Option ${o.value}`}
                />
              </div>
              <button
                className='rounded-xl border px-3 text-xs font-semibold transition duration-200 hover:shadow'
                onClick={() => {
                  if (multiple) {
                    const arr = Array.isArray(selected) ? selected : []
                    onChange({
                      correctAnswer: arr.includes(o.value) ? arr.filter((v) => v !== o.value) : [...arr, o.value]
                    })
                  } else {
                    onChange({ correctAnswer: o.value })
                  }
                }}
              >
                {multiple
                  ? Array.isArray(selected) && selected.includes(o.value)
                    ? '☑'
                    : '☐'
                  : selected === o.value
                    ? '◉'
                    : '○'}
              </button>
            </div>
          ))}
        </div>
        <button
          className='mt-2 rounded border px-2 py-1 text-xs'
          onClick={() =>
            onChange({
              options: [
                ...options,
                {
                  id: crypto.randomUUID(),
                  label: `Option ${options.length + 1}`,
                  value: `option_${options.length + 1}`
                }
              ]
            })
          }
        >
          Add option
        </button>
      </div>
    </div>
  )
}

function TrueFalseEditor({
  data,
  onChange
}: {
  data: QuestionTemplateData
  onChange: (patch: Partial<QuestionTemplateData>) => void
}) {
  return (
    <div className='space-y-3'>
      <BaseEditor data={data} onChange={onChange} />
      <div className='rounded-2xl border border-slate-200 bg-white p-4'>
        <p className='mb-2 text-xs text-slate-500'>Correct answer</p>
        <div className='grid grid-cols-2 gap-2'>
          <button className='rounded-xl border px-3 py-2 text-sm' onClick={() => onChange({ correctAnswer: true })}>
            TRUE
          </button>
          <button className='rounded-xl border px-3 py-2 text-sm' onClick={() => onChange({ correctAnswer: false })}>
            FALSE
          </button>
        </div>
      </div>
    </div>
  )
}

function ShortAnswerEditor({
  data,
  onChange
}: {
  data: QuestionTemplateData
  onChange: (patch: Partial<QuestionTemplateData>) => void
}) {
  return (
    <div className='space-y-3'>
      <BaseEditor data={data} onChange={onChange} />
      <label className='block rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600'>
        Character limit
        <input
          type='number'
          className='mt-1 w-full rounded-xl border px-2 py-1 text-sm'
          value={data.charLimit ?? 120}
          onChange={(e) => onChange({ charLimit: Number(e.target.value) })}
        />
      </label>
    </div>
  )
}

function FillBlankEditor({
  data,
  onChange
}: {
  data: QuestionTemplateData
  onChange: (patch: Partial<QuestionTemplateData>) => void
}) {
  return (
    <div className='space-y-3'>
      <BaseEditor data={data} onChange={onChange} />
      <div className='rounded-2xl border border-slate-200 bg-white p-4'>
        <p className='mb-2 text-xs text-slate-600'>Sentence (use ____ for blanks)</p>
        <TipTapEditor
          value={data.sentence || '<p></p>'}
          onChange={(html) => onChange({ sentence: html })}
          minHeightClassName='min-h-[90px]'
          placeholder='Type sentence with ____ placeholders'
        />
      </div>
    </div>
  )
}

function MatchingEditor({
  data,
  onChange
}: {
  data: QuestionTemplateData
  onChange: (patch: Partial<QuestionTemplateData>) => void
}) {
  const pairs = data.pairs ?? []
  return (
    <div className='space-y-3'>
      <BaseEditor data={data} onChange={onChange} />
      <div className='rounded-2xl border border-slate-200 bg-white p-4'>
        <p className='mb-2 text-xs text-slate-500'>Pairs</p>
        {pairs.map((p) => (
          <div key={p.id} className='mb-2 grid grid-cols-2 gap-2'>
            <TipTapEditor
              value={p.term || '<p></p>'}
              onChange={(html) => onChange({ pairs: pairs.map((x) => (x.id === p.id ? { ...x, term: html } : x)) })}
              minHeightClassName='min-h-[70px]'
              placeholder='Matching term'
            />
            <TipTapEditor
              value={p.definition || '<p></p>'}
              onChange={(html) =>
                onChange({ pairs: pairs.map((x) => (x.id === p.id ? { ...x, definition: html } : x)) })
              }
              minHeightClassName='min-h-[70px]'
              placeholder='Matching definition'
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function QuestionFactory({
  question,
  mode,
  onChange
}: {
  question: Question
  mode: 'editor' | 'preview'
  onChange: (data: QuestionTemplateData) => void
}) {
  const data = question.templateData ?? { prompt: question.promptHtml || 'Question prompt...' }
  const patch = (next: Partial<QuestionTemplateData>) => onChange({ ...data, ...next })

  if (mode === 'preview') {
    if (question.questionType === 'MCQ_SINGLE') return <McqSinglePreview data={data} />
    if (question.questionType === 'MCQ_MULTIPLE' || question.questionType === 'MCQ_MULTI')
      return <McqMultiplePreview data={data} />
    if (question.questionType === 'TRUE_FALSE') return <TrueFalsePreview data={data} />
    if (question.questionType === 'SHORT_ANSWER') return <ShortAnswerPreview data={data} />
    if (question.questionType === 'FILL_IN_THE_BLANK' || question.questionType === 'FILL_BLANK')
      return <FillInTheBlankPreview data={data} />
    return <MatchingPreview data={data} />
  }

  if (question.questionType === 'MCQ_SINGLE') return <McqEditor data={data} onChange={patch} />
  if (question.questionType === 'MCQ_MULTIPLE' || question.questionType === 'MCQ_MULTI')
    return <McqEditor data={data} onChange={patch} multiple />
  if (question.questionType === 'TRUE_FALSE') return <TrueFalseEditor data={data} onChange={patch} />
  if (question.questionType === 'SHORT_ANSWER') return <ShortAnswerEditor data={data} onChange={patch} />
  if (question.questionType === 'FILL_IN_THE_BLANK' || question.questionType === 'FILL_BLANK')
    return <FillBlankEditor data={data} onChange={patch} />
  return <MatchingEditor data={data} onChange={patch} />
}
