import type { EditorState } from '../types/editor.types'

export const validateCourse = (state: EditorState) => {
  const errors: string[] = []

  if (state.sectionOrder.length < 1) {
    errors.push('Course must have at least 1 section.')
  }

  state.sectionOrder.forEach((sectionId, sectionIndex) => {
    const pages = state.pageOrder[sectionId] ?? []
    if (pages.length < 1) {
      errors.push(`Section ${sectionIndex + 1} must have at least 1 page.`)
    }

    pages.forEach((pageId, pageIndex) => {
      const page = state.pages[pageId]
      if (!page) return
      if (page.type === 'quiz') {
        const questionCount = (state.questionOrder[pageId] ?? []).length
        if (questionCount < 1) {
          errors.push(`Quiz page ${pageIndex + 1} in section ${sectionIndex + 1} must have at least 1 question.`)
        }
      }
    })
  })

  return errors
}

