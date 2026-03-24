import type { EditorState, Page } from '../types/editor.types'

type Payload = {
  editorStateSnapshot?: {
    title?: string
    description?: string
    coverImageUrl?: string
    passingScore?: number
    attemptLimit?: number
    durationMin?: number
    sections?: Array<{
      id: string
      title: string
      description?: string
      pages?: Array<any>
    }>
  }
}

export const hydrateFromPayload = (payload: Payload): EditorState => {
  const snapshot = payload.editorStateSnapshot
  const sectionOrder: string[] = []
  const sections: EditorState['sections'] = {}
  const pageOrder: EditorState['pageOrder'] = {}
  const pages: EditorState['pages'] = {}
  const blockOrder: EditorState['blockOrder'] = {}
  const blocks: EditorState['blocks'] = {}
  const questionOrder: EditorState['questionOrder'] = {}
  const questions: EditorState['questions'] = {}

  ;(snapshot?.sections ?? []).forEach((section) => {
    sectionOrder.push(section.id)
    sections[section.id] = { id: section.id, title: section.title, description: section.description }
    pageOrder[section.id] = []
    ;(section.pages ?? []).forEach((page: any) => {
      pageOrder[section.id].push(page.id)
      const type: Page['type'] = page.pageType === 'QUIZ' ? 'quiz' : 'content'
      pages[page.id] = {
        id: page.id,
        title: page.title ?? 'Untitled Page',
        type,
        layoutType: page.contentPage?.layoutType,
        passingScore: page.quizPage?.passingScore,
        attemptAllowed: page.quizPage?.attemptAllowed
      }

      blockOrder[page.id] = []
      questionOrder[page.id] = []
      ;(page.contentPage?.blocks ?? []).forEach((block: any) => {
        blocks[block.id] = block
        blockOrder[page.id].push(block.id)
      })
      ;(page.quizPage?.questions ?? []).forEach((q: any) => {
        questions[q.id] = q
        questionOrder[page.id].push(q.id)
      })
    })
  })

  const firstSection = sectionOrder[0]
  const firstPage = firstSection ? pageOrder[firstSection]?.[0] : null

  return {
    course: {
      id: crypto.randomUUID(),
      title: snapshot?.title ?? 'Untitled Course',
      description: snapshot?.description,
      coverImageUrl: snapshot?.coverImageUrl,
      passingScore: snapshot?.passingScore,
      attemptLimit: snapshot?.attemptLimit,
      durationMin: snapshot?.durationMin
    },
    sectionOrder,
    sections,
    pageOrder,
    pages,
    blockOrder,
    blocks,
    questionOrder,
    questions,
    activePageId: firstPage ?? null
  }
}
