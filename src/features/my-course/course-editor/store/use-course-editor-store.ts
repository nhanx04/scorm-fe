import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type {
  BaseQuestion,
  Block,
  BlockType,
  EditorState,
  FillBlankQuestion,
  ImageBlock,
  MatchingQuestion,
  MCQMultipleQuestion,
  MCQSingleQuestion,
  Page,
  Question,
  QuestionType,
  Section,
  ShortAnswerQuestion,
  TextBlock,
  TrueFalseQuestion,
  VideoBlock
} from '../types/editor.types'

type EditorActions = {
  hydrateStore: (state: EditorState) => void
  resetStore: () => void
  updateCourse: (data: Partial<EditorState['course']>) => void
  updateThemeGlobal: (data: Partial<EditorState['theme']['global']>) => void
  setMode: (mode: EditorState['mode']) => void
  addSection: () => void
  updateSection: (sectionId: string, data: Partial<Section>) => void
  reorderSections: (activeId: string, overId: string) => void
  removeSection: (sectionId: string) => void
  addPage: (sectionId: string, type?: Page['type']) => void
  updatePage: (pageId: string, data: Partial<Page>) => void
  reorderPages: (sectionId: string, activeId: string, overId: string) => void
  removePage: (pageId: string) => void
  setActivePage: (pageId: string | null) => void
  addBlock: (pageId: string, type: BlockType) => void
  updateBlock: (pageId: string, blockId: string, data: Partial<Block>) => void
  deleteBlock: (pageId: string, blockId: string) => void
  reorderBlocks: (pageId: string, activeId: string, overId: string) => void
  addQuestion: (pageId: string, type: QuestionType) => void
  updateQuestion: (pageId: string, questionId: string, data: Partial<Question>) => void
  deleteQuestion: (pageId: string, questionId: string) => void
  reorderQuestions: (pageId: string, activeId: string, overId: string) => void
}

type EditorStore = EditorState & EditorActions

const createId = () => crypto.randomUUID()

const moveInArray = <T>(arr: T[], oldIndex: number, newIndex: number) => {
  const next = [...arr]
  const [moved] = next.splice(oldIndex, 1)
  next.splice(newIndex, 0, moved)
  return next
}

const createBlockByType = (type: BlockType, orderIndex: number): Block => {
  if (type === 'TEXT') return { id: createId(), type: 'TEXT', orderIndex, textHtml: '<p>New text...</p>' } as TextBlock
  if (type === 'IMAGE') return { id: createId(), type: 'IMAGE', orderIndex, imageUrl: '' } as ImageBlock
  return { id: createId(), type: 'VIDEO', orderIndex, embedUrl: '' } as VideoBlock
}

const baseQuestion = (type: QuestionType, orderIndex: number): BaseQuestion => ({
  id: createId(),
  questionType: type,
  promptHtml: '<p>New question...</p>',
  orderIndex
})

const createQuestionByType = (type: QuestionType, orderIndex: number): Question => {
  const base = baseQuestion(type, orderIndex)
  if (type === 'MCQ_SINGLE')
    return {
      ...base,
      questionType: 'MCQ_SINGLE',
      options: [
        { id: createId(), labelHtml: '<p>Option 1</p>', isCorrect: false },
        { id: createId(), labelHtml: '<p>Option 2</p>', isCorrect: false }
      ]
    } as MCQSingleQuestion
  if (type === 'MCQ_MULTIPLE')
    return {
      ...base,
      questionType: 'MCQ_MULTIPLE',
      options: [
        { id: createId(), labelHtml: '<p>Option 1</p>', isCorrect: false },
        { id: createId(), labelHtml: '<p>Option 2</p>', isCorrect: false }
      ]
    } as MCQMultipleQuestion
  if (type === 'TRUE_FALSE') return { ...base, questionType: 'TRUE_FALSE', correctAnswer: true } as TrueFalseQuestion
  if (type === 'SHORT_ANSWER')
    return { ...base, questionType: 'SHORT_ANSWER', acceptableAnswers: [], charLimit: 120 } as ShortAnswerQuestion
  if (type === 'FILL_IN_THE_BLANK')
    return {
      ...base,
      questionType: 'FILL_IN_THE_BLANK',
      sentenceHtml: '<p>Fill in the blank: ___</p>',
      answers: ['']
    } as FillBlankQuestion
  return {
    ...base,
    questionType: 'MATCHING',
    pairs: [
      { id: createId(), left: 'Item A', right: 'Match 1' },
      { id: createId(), left: 'Item B', right: 'Match 2' }
    ]
  } as MatchingQuestion
}

const createInitialState = (): EditorState => {
  const initialSectionId = createId()
  const initialPageId = createId()
  const initialBlockId = createId()

  return {
    course: { id: createId(), title: 'Untitled Course', description: 'Start building your SCORM course here.' },
    theme: {
      global: {
        primaryColor: '#2563eb',
        background: '#ffffff',
        textColor: '#111827',
        borderRadius: 12,
        fontFamily: 'Inter, sans-serif'
      },
      sectionOverrides: {},
      pageOverrides: {},
      blockOverrides: {}
    },
    mode: 'edit',
    sectionOrder: [initialSectionId],
    sections: { [initialSectionId]: { id: initialSectionId, title: 'Section 1', description: 'Introduction section' } },
    pageOrder: { [initialSectionId]: [initialPageId] },
    pages: { [initialPageId]: { id: initialPageId, title: 'Page 1', type: 'content', layoutType: 'SINGLE_COLUMN' } },
    blockOrder: { [initialPageId]: [initialBlockId] },
    blocks: {
      [initialBlockId]: {
        id: initialBlockId,
        type: 'TEXT',
        orderIndex: 1,
        textHtml: '<p>Start building your content...</p>'
      }
    },
    questionOrder: { [initialPageId]: [] },
    questions: {},
    activePageId: initialPageId
  }
}

export const useCourseEditorStore = create<EditorStore>()(
  immer((set) => ({
    ...createInitialState(),
    hydrateStore: (state) => set(() => state),
    resetStore: () => set(() => createInitialState()),
    updateCourse: (data) => set((s) => void Object.assign(s.course, data)),
    updateThemeGlobal: (data) => set((s) => void Object.assign(s.theme.global, data)),
    setMode: (mode) => set((s) => void (s.mode = mode)),
    addSection: () =>
      set((s) => {
        const sectionId = createId()
        const pageId = createId()
        s.sectionOrder.push(sectionId)
        s.sections[sectionId] = { id: sectionId, title: `Section ${s.sectionOrder.length}` }
        s.pageOrder[sectionId] = [pageId]
        s.pages[pageId] = { id: pageId, title: 'New Page', type: 'content', layoutType: 'SINGLE_COLUMN' }
        s.blockOrder[pageId] = []
        s.questionOrder[pageId] = []
        s.activePageId = pageId
      }),
    updateSection: (sectionId, data) =>
      set((s) => {
        if (!s.sections[sectionId]) return
        Object.assign(s.sections[sectionId], data)
      }),
    reorderSections: (activeId, overId) =>
      set((s) => {
        const oldIndex = s.sectionOrder.indexOf(activeId)
        const newIndex = s.sectionOrder.indexOf(overId)
        if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return
        s.sectionOrder = moveInArray(s.sectionOrder, oldIndex, newIndex)
      }),
    removeSection: (sectionId) =>
      set((s) => {
        if (!s.sections[sectionId]) return

        const pageIds = s.pageOrder[sectionId] ?? []
        pageIds.forEach((pageId) => {
          const blockIds = s.blockOrder[pageId] ?? []
          const questionIds = s.questionOrder[pageId] ?? []

          blockIds.forEach((blockId) => {
            delete s.blocks[blockId]
          })
          questionIds.forEach((questionId) => {
            delete s.questions[questionId]
          })

          delete s.blockOrder[pageId]
          delete s.questionOrder[pageId]
          delete s.pages[pageId]
        })

        delete s.pageOrder[sectionId]
        delete s.sections[sectionId]
        s.sectionOrder = s.sectionOrder.filter((id) => id !== sectionId)

        if (s.sectionOrder.length === 0) {
          const newSectionId = createId()
          const newPageId = createId()
          s.sectionOrder = [newSectionId]
          s.sections[newSectionId] = { id: newSectionId, title: 'Section 1', description: 'Introduction section' }
          s.pageOrder[newSectionId] = [newPageId]
          s.pages[newPageId] = { id: newPageId, title: 'Page 1', type: 'content', layoutType: 'SINGLE_COLUMN' }
          s.blockOrder[newPageId] = []
          s.questionOrder[newPageId] = []
          s.activePageId = newPageId
          return
        }

        const stillValidActivePage = s.activePageId && s.pages[s.activePageId]
        if (!stillValidActivePage) {
          const firstSectionId = s.sectionOrder[0]
          const firstPageId = (firstSectionId && s.pageOrder[firstSectionId]?.[0]) || null
          s.activePageId = firstPageId
        }
      }),
    addPage: (sectionId, type = 'content') =>
      set((s) => {
        if (!s.sections[sectionId]) return
        const pageId = createId()
        s.pageOrder[sectionId] = [...(s.pageOrder[sectionId] ?? []), pageId]
        s.pages[pageId] = {
          id: pageId,
          title: `Page ${(s.pageOrder[sectionId] ?? []).length}`,
          type,
          layoutType: 'SINGLE_COLUMN',
          passingScore: 80,
          attemptAllowed: 1
        }
        s.blockOrder[pageId] = []
        s.questionOrder[pageId] = []
        s.activePageId = pageId
      }),
    updatePage: (pageId, data) =>
      set((s) => {
        if (!s.pages[pageId]) return
        Object.assign(s.pages[pageId], data)
      }),
    reorderPages: (sectionId, activeId, overId) =>
      set((s) => {
        const ids = s.pageOrder[sectionId] ?? []
        const oldIndex = ids.indexOf(activeId)
        const newIndex = ids.indexOf(overId)
        if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return
        s.pageOrder[sectionId] = moveInArray(ids, oldIndex, newIndex)
      }),
    removePage: (pageId) =>
      set((s) => {
        const sectionId = s.sectionOrder.find((sid) => (s.pageOrder[sid] ?? []).includes(pageId))
        if (!sectionId) return

        s.pageOrder[sectionId] = (s.pageOrder[sectionId] ?? []).filter((id) => id !== pageId)
        delete s.pages[pageId]
        delete s.blockOrder[pageId]
        delete s.questionOrder[pageId]

        if (s.activePageId === pageId) {
          const nextPage = s.pageOrder[sectionId]?.[0] || null
          s.activePageId = nextPage
        }
      }),
    setActivePage: (pageId) => set((s) => void (s.activePageId = pageId)),
    addBlock: (pageId, type) =>
      set((s) => {
        const page = s.pages[pageId]
        if (!page || page.type !== 'content') return
        const ids = s.blockOrder[pageId] ?? []
        const block = createBlockByType(type, ids.length + 1)
        s.blocks[block.id] = block
        s.blockOrder[pageId] = [...ids, block.id]
      }),
    updateBlock: (_pageId, blockId, data) =>
      set((s) => {
        if (!s.blocks[blockId]) return
        s.blocks[blockId] = { ...s.blocks[blockId], ...data } as Block
      }),
    deleteBlock: (pageId, blockId) =>
      set((s) => {
        s.blockOrder[pageId] = (s.blockOrder[pageId] ?? []).filter((id) => id !== blockId)
        delete s.blocks[blockId]
        ;(s.blockOrder[pageId] ?? []).forEach((id, index) => {
          if (s.blocks[id]) s.blocks[id].orderIndex = index + 1
        })
      }),
    reorderBlocks: (pageId, activeId, overId) =>
      set((s) => {
        const ids = s.blockOrder[pageId] ?? []
        const oldIndex = ids.indexOf(activeId)
        const newIndex = ids.indexOf(overId)
        if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return
        s.blockOrder[pageId] = moveInArray(ids, oldIndex, newIndex)
        s.blockOrder[pageId].forEach((id, index) => {
          if (s.blocks[id]) s.blocks[id].orderIndex = index + 1
        })
      }),
    addQuestion: (pageId, type) =>
      set((s) => {
        const page = s.pages[pageId]
        if (!page || page.type !== 'quiz') return
        const ids = s.questionOrder[pageId] ?? []
        const question = createQuestionByType(type, ids.length + 1)
        s.questions[question.id] = question
        s.questionOrder[pageId] = [...ids, question.id]
      }),
    updateQuestion: (_pageId, questionId, data) =>
      set((s) => {
        if (!s.questions[questionId]) return
        s.questions[questionId] = { ...s.questions[questionId], ...data } as Question
      }),
    deleteQuestion: (pageId, questionId) =>
      set((s) => {
        s.questionOrder[pageId] = (s.questionOrder[pageId] ?? []).filter((id) => id !== questionId)
        delete s.questions[questionId]
        ;(s.questionOrder[pageId] ?? []).forEach((id, index) => {
          if (s.questions[id]) s.questions[id].orderIndex = index + 1
        })
      }),
    reorderQuestions: (pageId, activeId, overId) =>
      set((s) => {
        const ids = s.questionOrder[pageId] ?? []
        const oldIndex = ids.indexOf(activeId)
        const newIndex = ids.indexOf(overId)
        if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return
        s.questionOrder[pageId] = moveInArray(ids, oldIndex, newIndex)
        s.questionOrder[pageId].forEach((id, index) => {
          if (s.questions[id]) s.questions[id].orderIndex = index + 1
        })
      })
  }))
)
