import React, { useMemo, useState } from 'react'
import { useCourseEditorStore } from '../../store/use-course-editor-store'
import PageRenderer from './PageRenderer'
import type { Question } from '../../types/editor.types'
import { resolveTheme } from '../../utils/resolveTheme'

type QuestionAnswer = string | string[] | boolean | Record<string, string>

const PlayerLayout: React.FC = () => {
  const sectionOrder = useCourseEditorStore((s) => s.sectionOrder)
  const pageOrder = useCourseEditorStore((s) => s.pageOrder)
  const sections = useCourseEditorStore((s) => s.sections)
  const pages = useCourseEditorStore((s) => s.pages)
  const questions = useCourseEditorStore((s) => s.questions)
  const questionOrder = useCourseEditorStore((s) => s.questionOrder)
  const theme = useCourseEditorStore((s) => s.theme)

  const orderedPageIds = useMemo(() => sectionOrder.flatMap((sid) => pageOrder[sid] ?? []), [sectionOrder, pageOrder])
  const pageToSection = useMemo(() => {
    const map: Record<string, string> = {}
    sectionOrder.forEach((sid) => (pageOrder[sid] ?? []).forEach((pid) => (map[pid] = sid)))
    return map
  }, [sectionOrder, pageOrder])

  const [cursor, setCursor] = useState(0)
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({})
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const currentPageId = orderedPageIds[cursor]
  const currentPage = currentPageId ? pages[currentPageId] : null
  const currentSectionId = currentPageId ? (pageToSection[currentPageId] ?? null) : null

  const checkAnswer = (question: Question, value: QuestionAnswer | undefined): boolean => {
    if (question.questionType === 'MCQ_SINGLE')
      return typeof value === 'string' && question.options.some((o) => o.id === value && o.isCorrect)
    if (question.questionType === 'MCQ_MULTIPLE') {
      const selected = Array.isArray(value) ? value : []
      const correct = question.options
        .filter((o) => o.isCorrect)
        .map((o) => o.id)
        .sort()
      return selected.slice().sort().join('|') === correct.join('|')
    }
    if (question.questionType === 'TRUE_FALSE') return typeof value === 'boolean' && value === question.correctAnswer
    if (question.questionType === 'SHORT_ANSWER') {
      const val = String(value ?? '')
        .trim()
        .toLowerCase()
      return (question.acceptableAnswers ?? []).map((a) => a.trim().toLowerCase()).includes(val)
    }
    if (question.questionType === 'FILL_IN_THE_BLANK') {
      const val = String(value ?? '')
        .trim()
        .toLowerCase()
      return question.answers.map((a) => a.trim().toLowerCase()).includes(val)
    }
    if (question.questionType === 'MATCHING') {
      const val = typeof value === 'object' && !Array.isArray(value) && value !== null ? value : {}
      return question.pairs.every(
        (pair) =>
          String(val[pair.id] ?? '')
            .trim()
            .toLowerCase() === pair.right.trim().toLowerCase()
      )
    }
    return false
  }

  const currentQuestionIds = currentPageId ? (questionOrder[currentPageId] ?? []) : []
  const correctness: Record<string, boolean | null> = {}
  currentQuestionIds.forEach((qid) => {
    const question = questions[qid]
    if (!question || !checked[qid]) {
      correctness[qid] = null
      return
    }
    correctness[qid] = checkAnswer(question, answers[qid])
  })

  const checkedIds = currentQuestionIds.filter((id) => checked[id])
  const score = checkedIds.filter((id) => correctness[id] === true).length
  const completion =
    currentQuestionIds.length === 0 ? 0 : Math.round((checkedIds.length / currentQuestionIds.length) * 100)

  const playerTheme = resolveTheme(theme.global)

  return (
    <main
      className='mx-auto w-full max-w-4xl rounded-2xl border border-gray-200 p-3 sm:p-5'
      style={{
        background: playerTheme.background,
        color: playerTheme.color,
        borderRadius: playerTheme.borderRadius,
        fontFamily: playerTheme.fontFamily
      }}
    >
      <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-xs text-gray-500'>Learner Preview</p>
          <h2 className='text-lg font-bold sm:text-xl'>{currentPage?.title ?? 'No page'}</h2>
        </div>
        <span className='text-sm text-gray-500'>
          {orderedPageIds.length === 0 ? 0 : cursor + 1}/{orderedPageIds.length}
        </span>
      </div>

      <div className='mb-4 text-sm text-gray-500'>
        {Object.values(sections).length > 0 ? `Sections: ${Object.values(sections).length}` : 'No sections'}
      </div>

      {currentPageId && (
        <PageRenderer
          pageId={currentPageId}
          sectionId={currentSectionId}
          answers={answers}
          checked={checked}
          correctness={correctness}
          onAnswerChange={(questionId, value) => setAnswers((prev) => ({ ...prev, [questionId]: value }))}
        />
      )}

      {currentPage?.type === 'quiz' && (
        <section className='mt-4 rounded-lg border border-gray-200 p-3 text-sm'>
          <p className='font-medium'>Progress: {completion}%</p>
          <p>
            Score: {score}/{currentQuestionIds.length}
          </p>
          <button
            type='button'
            onClick={() =>
              setChecked((prev) => ({ ...prev, ...Object.fromEntries(currentQuestionIds.map((id) => [id, true])) }))
            }
            className='mt-2 rounded-lg border border-gray-300 px-3 py-2'
            aria-label='Check quiz answers'
          >
            Check Answers
          </button>
        </section>
      )}

      <div className='mt-6 flex items-center justify-between gap-2'>
        <button
          type='button'
          disabled={cursor <= 0}
          onClick={() => setCursor((v) => Math.max(0, v - 1))}
          className='min-h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50'
          aria-label='Previous page'
        >
          Previous
        </button>
        <button
          type='button'
          disabled={cursor >= orderedPageIds.length - 1}
          onClick={() => setCursor((v) => Math.min(orderedPageIds.length - 1, v + 1))}
          className='min-h-10 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50'
          style={{ background: theme.global.primaryColor }}
          aria-label='Next page'
        >
          Next
        </button>
      </div>
    </main>
  )
}

export default PlayerLayout
