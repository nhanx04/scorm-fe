import type { Page, Question } from '../types/course'
import { useCourseStore } from '../store/useCourseStore'
import { EditableText } from './EditableText'
import { buildLayoutStyle, buildThemeStyle } from './theme'

function QuestionView({ question, sectionId, pageId }: { question: Question; sectionId: string; pageId: string }) {
  const selectElement = useCourseStore((s) => s.selectElement)
  const updateQuestion = useCourseStore((s) => s.updateQuestion)
  const toggleElementSelection = useCourseStore((s) => s.toggleElementSelection)

  return (
    <div
      className='rounded-md border border-gray-200 bg-white p-3'
      style={{
        ...buildThemeStyle(question.themeOverride),
        ...buildLayoutStyle(question.layoutMode, question.layoutMeta)
      }}
      onClick={(event) => {
        selectElement({ kind: 'question', id: question.id, pageId })
        if (event.shiftKey) toggleElementSelection(question.id)
      }}
    >
      <EditableText
        value={question.title}
        onSave={(newValue) => updateQuestion(sectionId, pageId, question.id, { title: newValue })}
        className='text-sm font-semibold text-gray-800'
        inputClassName='text-sm font-semibold text-gray-800'
        placeholder='Question title'
      />
      <div className='mt-1 text-xs text-gray-500'>{question.questionType}</div>
      <EditableText
        value={question.promptHtml}
        onSave={(newValue) => updateQuestion(sectionId, pageId, question.id, { promptHtml: newValue })}
        className='mt-2 text-sm text-gray-700'
        inputClassName='text-sm text-gray-700'
        multiline
        placeholder='Question instruction'
      />
    </div>
  )
}

export function QuizBuilder({ page, sectionId }: { page: Page; sectionId: string }) {
  if (!page.quizPage) return null
  return (
    <div className='space-y-2'>
      {page.quizPage.questions.map((q) => (
        <QuestionView key={q.id} question={q} sectionId={sectionId} pageId={page.id} />
      ))}
      {page.quizPage.questions.length === 0 ? (
        <p className='rounded border border-dashed p-3 text-xs text-gray-400'>Drag question type here</p>
      ) : null}
    </div>
  )
}
