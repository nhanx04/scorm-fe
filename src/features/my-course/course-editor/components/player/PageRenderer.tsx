import React from 'react'
import { useCourseEditorStore } from '../../store/use-course-editor-store'
import BlockRenderer from './BlockRenderer'
import QuestionRenderer from './QuestionRenderer'
import { resolveTheme } from '../../utils/resolveTheme'

type QuestionAnswer = string | string[] | boolean | Record<string, string>

type Props = {
  pageId: string
  sectionId: string | null
  answers: Record<string, QuestionAnswer>
  checked: Record<string, boolean>
  correctness: Record<string, boolean | null>
  onAnswerChange: (questionId: string, value: QuestionAnswer) => void
}

const PageRenderer: React.FC<Props> = ({ pageId, sectionId, answers, checked, correctness, onAnswerChange }) => {
  const page = useCourseEditorStore((state) => state.pages[pageId])
  const blockIds = useCourseEditorStore((state) => state.blockOrder[pageId] ?? [])
  const blocks = useCourseEditorStore((state) => state.blocks)
  const questionIds = useCourseEditorStore((state) => state.questionOrder[pageId] ?? [])
  const questions = useCourseEditorStore((state) => state.questions)
  const theme = useCourseEditorStore((state) => state.theme)

  if (!page) return null

  const pageTheme = resolveTheme(
    theme.global,
    sectionId ? theme.sectionOverrides?.[sectionId] : undefined,
    theme.pageOverrides?.[page.id],
    page.themeOverride
  )

  if (page.type === 'content') {
    return (
      <div className='space-y-4' style={{ background: pageTheme.background, color: pageTheme.color }}>
        {blockIds.map((id) => {
          const block = blocks[id]
          if (!block) return null
          return <BlockRenderer key={id} block={block} pageTheme={pageTheme} sectionId={sectionId} />
        })}
      </div>
    )
  }

  return (
    <div className='space-y-4' style={{ background: pageTheme.background, color: pageTheme.color }}>
      {questionIds.map((id) => {
        const question = questions[id]
        if (!question) return null
        return (
          <QuestionRenderer
            key={id}
            question={question}
            value={answers[id]}
            checked={checked[id] ?? false}
            isCorrect={correctness[id] ?? null}
            sectionId={sectionId}
            onChange={(value) => onAnswerChange(id, value)}
          />
        )
      })}
    </div>
  )
}

export default PageRenderer
