import type { EditorState } from '../types/editor.types'

export const transformToPayload = (state: EditorState) => {
  return {
    courseTitle: state.course.title,
    editorStateSnapshot: {
      title: state.course.title,
      description: state.course.description,
      passingScore: state.course.passingScore,
      attemptLimit: state.course.attemptLimit,
      durationMin: state.course.durationMin,
      sections: state.sectionOrder.map((sectionId) => {
        const section = state.sections[sectionId]
        return {
          id: section.id,
          title: section.title,
          description: section.description,
          pages: (state.pageOrder[sectionId] ?? []).map((pageId) => {
            const page = state.pages[pageId]
            if (page.type === 'content') {
              return {
                id: page.id,
                title: page.title,
                pageType: 'CONTENT',
                contentPage: {
                  layoutType: page.layoutType ?? 'SINGLE_COLUMN',
                  blocks: (state.blockOrder[pageId] ?? []).map((blockId) => state.blocks[blockId]).filter(Boolean)
                }
              }
            }
            return {
              id: page.id,
              title: page.title,
              pageType: 'QUIZ',
              quizPage: {
                passingScore: page.passingScore,
                attemptAllowed: page.attemptAllowed,
                questions: (state.questionOrder[pageId] ?? []).map((qid) => state.questions[qid]).filter(Boolean)
              }
            }
          })
        }
      })
    }
  }
}

