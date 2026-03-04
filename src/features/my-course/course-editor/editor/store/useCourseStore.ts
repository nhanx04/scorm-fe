import { create } from 'zustand'
import type {
  Block,
  Course,
  CourseEditorState,
  Page,
  Question,
  QuestionType,
  Section,
  SelectedElement,
  ThemeTokens
} from '../types/course'

interface CourseStore extends CourseEditorState {
  selectedBlockId: string | null
  selectedElementIds: string[]
  lockedElementIds: string[]
  canvasZoom: number
  setSelectedBlockId: (id: string | null) => void
  toggleElementSelection: (id: string) => void
  clearSelection: () => void
  groupSelectedElements: () => void
  toggleElementLock: (id: string) => void
  setCanvasZoom: (zoom: number) => void
  addSection: () => void
  addPage: (sectionId: string, pageType?: 'CONTENT' | 'QUIZ') => void
  addBlock: (pageId: string) => void
  addQuestion: (pageId: string, questionType: QuestionType) => void
  updateElement: (id: string, data: Record<string, unknown>) => void
  updateSection: (sectionId: string, data: Partial<Section>) => void
  updatePage: (sectionId: string, pageId: string, data: Partial<Page>) => void
  updateQuestion: (sectionId: string, pageId: string, questionId: string, data: Partial<Question>) => void
  updateElementThemeTokens: (selectedElement: SelectedElement, patch: Partial<ThemeTokens>) => void
  updateElementLayoutMeta: (selectedElement: SelectedElement, patch: Record<string, unknown>) => void
  deleteElement: (id: string) => void
  reorder: (payload: {
    type: 'sections' | 'pages' | 'blocks'
    sectionId?: string
    pageId?: string
    fromIndex: number
    toIndex: number
  }) => void
  moveBlockToPage: (blockId: string, sourcePageId: string, targetPageId: string, targetIndex: number) => void
  selectElement: (selectedElement: SelectedElement) => void
  undo: () => void
  redo: () => void
  exportCourse: () => Course
}

const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`

const recalcOrder = <T extends { orderIndex: number }>(items: T[]) =>
  items.map((it, idx) => ({ ...it, orderIndex: idx + 1 }))

const initialCourse: Course = {
  title: 'Vietnamese Safety Training - SCORM 2004',
  passingScore: 80.5,
  attemptLimit: 3,
  durationMin: 120,
  status: 'DRAFT',
  extraInfor: { category: 'Compliance', language: 'vi', level: 'Beginner' },
  sections: [
    {
      id: uid('section'),
      title: 'Giới thiệu & mục tiêu',
      description: 'Tổng quan khóa học',
      orderIndex: 1,
      learningObjective: 'Nắm quy định cơ bản',
      themeOverride: null,
      pages: [
        {
          id: uid('page'),
          title: 'Chào mừng',
          orderIndex: 1,
          pageType: 'CONTENT',
          themeOverride: null,
          contentPage: {
            layoutType: 'SINGLE_COLUMN',
            blocks: [{ id: uid('block'), orderIndex: 1, textHtml: '<h2>Chào mừng</h2><p>Start editing...</p>' }]
          },
          quizPage: null
        }
      ]
    }
  ]
}

const pushHistory = (state: CourseStore): Pick<CourseStore, 'history' | 'future'> => ({
  history: [...state.history, structuredClone(state.course)],
  future: []
})

export const useCourseStore = create<CourseStore>((set, get) => ({
  course: initialCourse,
  selectedElement: null,
  selectedBlockId: null,
  selectedElementIds: [],
  lockedElementIds: [],
  canvasZoom: 1,
  history: [],
  future: [],

  setSelectedBlockId: (id) =>
    set({
      selectedBlockId: id
    }),

  toggleElementSelection: (id) =>
    set((state) => ({
      selectedElementIds: state.selectedElementIds.includes(id)
        ? state.selectedElementIds.filter((item) => item !== id)
        : [...state.selectedElementIds, id]
    })),

  clearSelection: () => set({ selectedElementIds: [] }),

  groupSelectedElements: () =>
    set((state) => {
      if (state.selectedElementIds.length < 2) return state
      const next = structuredClone(state.course)
      const groupId = uid('group')
      next.sections.forEach((section) => {
        if (state.selectedElementIds.includes(section.id)) {
          section.layoutMeta = { ...(section.layoutMeta ?? {}), groupId }
        }
        section.pages.forEach((page) => {
          if (state.selectedElementIds.includes(page.id)) {
            page.layoutMeta = { ...(page.layoutMeta ?? {}), groupId }
          }
          page.contentPage?.blocks.forEach((block) => {
            if (state.selectedElementIds.includes(block.id)) {
              block.layoutMeta = { ...(block.layoutMeta ?? {}), groupId }
            }
          })
          page.quizPage?.questions.forEach((question) => {
            if (state.selectedElementIds.includes(question.id)) {
              question.layoutMeta = { ...(question.layoutMeta ?? {}), groupId }
            }
          })
        })
      })
      return { ...pushHistory(state), course: next }
    }),

  toggleElementLock: (id) =>
    set((state) => ({
      lockedElementIds: state.lockedElementIds.includes(id)
        ? state.lockedElementIds.filter((item) => item !== id)
        : [...state.lockedElementIds, id]
    })),

  setCanvasZoom: (zoom) => set({ canvasZoom: Math.max(0.25, Math.min(2, zoom)) }),

  addSection: () =>
    set((state) => {
      const section: Section = {
        id: uid('section'),
        title: `Section ${state.course.sections.length + 1}`,
        description: '',
        orderIndex: state.course.sections.length + 1,
        learningObjective: '',
        themeOverride: null,
        pages: []
      }
      return { ...pushHistory(state), course: { ...state.course, sections: [...state.course.sections, section] } }
    }),

  addPage: (sectionId, pageType = 'CONTENT') =>
    set((state) => {
      const sections = state.course.sections.map((section) => {
        if (section.id !== sectionId) return section
        const page: Page = {
          id: uid('page'),
          title: `${pageType} Page ${section.pages.length + 1}`,
          orderIndex: section.pages.length + 1,
          pageType,
          themeOverride: null,
          contentPage: pageType === 'CONTENT' ? { layoutType: 'SINGLE_COLUMN', blocks: [] } : null,
          quizPage: pageType === 'QUIZ' ? { passingScore: 80, attemptAllowed: 1, questions: [] } : null
        }
        return { ...section, pages: [...section.pages, page] }
      })
      return { ...pushHistory(state), course: { ...state.course, sections } }
    }),

  addBlock: (pageId) =>
    set((state) => {
      const sections = state.course.sections.map((section) => ({
        ...section,
        pages: section.pages.map((page) => {
          if (page.id !== pageId || !page.contentPage) return page
          const block: Block = {
            id: uid('block'),
            orderIndex: page.contentPage.blocks.length + 1,
            textHtml: '<p>New content block</p>',
            themeOverride: null
          }
          return { ...page, contentPage: { ...page.contentPage, blocks: [...page.contentPage.blocks, block] } }
        })
      }))
      return { ...pushHistory(state), course: { ...state.course, sections } }
    }),

  addQuestion: (pageId, questionType) =>
    set((state) => {
      const sections = state.course.sections.map((section) => ({
        ...section,
        pages: section.pages.map((page) => {
          if (page.id !== pageId || !page.quizPage) return page
          const question: Question = {
            id: uid('question'),
            title: `${questionType} Question`,
            questionType,
            promptHtml: '<p>Question prompt...</p>',
            options:
              questionType === 'MCQ_SINGLE' || questionType === 'MCQ_MULTI'
                ? [
                    { id: uid('op'), label: 'Option 1', isCorrect: true },
                    { id: uid('op'), label: 'Option 2', isCorrect: false }
                  ]
                : undefined,
            correctValue: questionType === 'TRUE_FALSE' ? true : undefined
          }
          return { ...page, quizPage: { ...page.quizPage, questions: [...page.quizPage.questions, question] } }
        })
      }))
      return { ...pushHistory(state), course: { ...state.course, sections } }
    }),

  updateElement: (id, data) =>
    set((state) => {
      const next = structuredClone(state.course)
      if (id === 'course-root') Object.assign(next, data)
      next.sections.forEach((section) => {
        if (section.id === id) Object.assign(section, data)
        section.pages.forEach((page) => {
          if (page.id === id) Object.assign(page, data)
          page.contentPage?.blocks.forEach((block) => {
            if (block.id === id) Object.assign(block, data)
          })
          page.quizPage?.questions.forEach((question) => {
            if (question.id === id) Object.assign(question, data)
          })
        })
      })
      return { ...pushHistory(state), course: next }
    }),

  updateSection: (sectionId, data) =>
    set((state) => {
      const next = structuredClone(state.course)
      const section = next.sections.find((s) => s.id === sectionId)
      if (!section) return state
      Object.assign(section, data)
      return { ...pushHistory(state), course: next }
    }),

  updatePage: (sectionId, pageId, data) =>
    set((state) => {
      const next = structuredClone(state.course)
      const section = next.sections.find((s) => s.id === sectionId)
      const page = section?.pages.find((p) => p.id === pageId)
      if (!page) return state
      Object.assign(page, data)
      return { ...pushHistory(state), course: next }
    }),

  updateQuestion: (sectionId, pageId, questionId, data) =>
    set((state) => {
      const next = structuredClone(state.course)
      const section = next.sections.find((s) => s.id === sectionId)
      const page = section?.pages.find((p) => p.id === pageId)
      const question = page?.quizPage?.questions.find((q) => q.id === questionId)
      if (!question) return state
      Object.assign(question, data)
      return { ...pushHistory(state), course: next }
    }),

  updateElementThemeTokens: (selectedElement, patch) =>
    set((state) => {
      if (!selectedElement) return state

      const next = structuredClone(state.course)
      const mergeTokens = (current?: { tokens?: ThemeTokens } | null) => ({
        ...(current ?? {}),
        tokens: {
          ...(current?.tokens ?? {}),
          ...patch
        }
      })

      if (selectedElement.kind === 'course' && selectedElement.id === 'course-root') {
        return state
      }

      if (selectedElement.kind === 'section') {
        const section = next.sections.find((s) => s.id === selectedElement.id)
        if (!section) return state
        section.themeOverride = mergeTokens(section.themeOverride)
        return { ...pushHistory(state), course: next }
      }

      if (selectedElement.kind === 'page') {
        for (const section of next.sections) {
          const page = section.pages.find((p) => p.id === selectedElement.id)
          if (page) {
            page.themeOverride = mergeTokens(page.themeOverride)
            return { ...pushHistory(state), course: next }
          }
        }
        return state
      }

      if (selectedElement.kind === 'block') {
        for (const section of next.sections) {
          for (const page of section.pages) {
            const block = page.contentPage?.blocks.find((b) => b.id === selectedElement.id)
            if (block) {
              block.themeOverride = mergeTokens(block.themeOverride)
              return { ...pushHistory(state), course: next }
            }
          }
        }
        return state
      }

      if (selectedElement.kind === 'question') {
        for (const section of next.sections) {
          for (const page of section.pages) {
            const question = page.quizPage?.questions.find((q) => q.id === selectedElement.id)
            if (question) {
              question.themeOverride = mergeTokens(question.themeOverride)
              return { ...pushHistory(state), course: next }
            }
          }
        }
      }

      return state
    }),

  updateElementLayoutMeta: (selectedElement, patch) =>
    set((state) => {
      if (!selectedElement || selectedElement.kind === 'course') return state
      const next = structuredClone(state.course)
      const mergeLayout = (current?: unknown) => ({ ...((current as object | undefined) ?? {}), ...patch })

      if (selectedElement.kind === 'section') {
        const section = next.sections.find((s) => s.id === selectedElement.id)
        if (!section) return state
        section.layoutMeta = mergeLayout(section.layoutMeta)
        return { ...pushHistory(state), course: next }
      }

      if (selectedElement.kind === 'page') {
        for (const section of next.sections) {
          const page = section.pages.find((p) => p.id === selectedElement.id)
          if (page) {
            page.layoutMeta = mergeLayout(page.layoutMeta)
            return { ...pushHistory(state), course: next }
          }
        }
        return state
      }

      if (selectedElement.kind === 'block') {
        for (const section of next.sections) {
          for (const page of section.pages) {
            const block = page.contentPage?.blocks.find((b) => b.id === selectedElement.id)
            if (block) {
              block.layoutMeta = mergeLayout(block.layoutMeta)
              return { ...pushHistory(state), course: next }
            }
          }
        }
        return state
      }

      for (const section of next.sections) {
        for (const page of section.pages) {
          const question = page.quizPage?.questions.find((q) => q.id === selectedElement.id)
          if (question) {
            question.layoutMeta = mergeLayout(question.layoutMeta)
            return { ...pushHistory(state), course: next }
          }
        }
      }

      return state
    }),

  deleteElement: (id) =>
    set((state) => {
      const sections = state.course.sections
        .filter((section) => section.id !== id)
        .map((section) => ({
          ...section,
          pages: section.pages
            .filter((page) => page.id !== id)
            .map((page) => ({
              ...page,
              contentPage: page.contentPage
                ? {
                    ...page.contentPage,
                    blocks: recalcOrder(page.contentPage.blocks.filter((block) => block.id !== id))
                  }
                : null,
              quizPage: page.quizPage
                ? { ...page.quizPage, questions: page.quizPage.questions.filter((question) => question.id !== id) }
                : null
            }))
        }))
      return {
        ...pushHistory(state),
        course: { ...state.course, sections },
        selectedElement: null,
        selectedBlockId: null
      }
    }),

  reorder: ({ type, sectionId, pageId, fromIndex, toIndex }) =>
    set((state) => {
      const next = structuredClone(state.course)
      if (type === 'sections') {
        const [moved] = next.sections.splice(fromIndex, 1)
        next.sections.splice(toIndex, 0, moved)
        next.sections = recalcOrder(next.sections)
      }
      if (type === 'pages' && sectionId) {
        const section = next.sections.find((s) => s.id === sectionId)
        if (section) {
          const [moved] = section.pages.splice(fromIndex, 1)
          section.pages.splice(toIndex, 0, moved)
          section.pages = recalcOrder(section.pages)
        }
      }
      if (type === 'blocks' && pageId) {
        next.sections.forEach((s) => {
          const page = s.pages.find((p) => p.id === pageId)
          if (page?.contentPage) {
            const [moved] = page.contentPage.blocks.splice(fromIndex, 1)
            page.contentPage.blocks.splice(toIndex, 0, moved)
            page.contentPage.blocks = recalcOrder(page.contentPage.blocks)
          }
        })
      }
      return { ...pushHistory(state), course: next }
    }),

  moveBlockToPage: (blockId, sourcePageId, targetPageId, targetIndex) =>
    set((state) => {
      const next = structuredClone(state.course)
      let moving: Block | undefined
      next.sections.forEach((section) => {
        section.pages.forEach((page) => {
          if (page.id === sourcePageId && page.contentPage) {
            const idx = page.contentPage.blocks.findIndex((b) => b.id === blockId)
            if (idx >= 0) moving = page.contentPage.blocks.splice(idx, 1)[0]
            page.contentPage.blocks = recalcOrder(page.contentPage.blocks)
          }
        })
      })
      if (moving) {
        next.sections.forEach((section) => {
          section.pages.forEach((page) => {
            if (page.id === targetPageId && page.contentPage) {
              page.contentPage.blocks.splice(targetIndex, 0, moving!)
              page.contentPage.blocks = recalcOrder(page.contentPage.blocks)
            }
          })
        })
      }
      return { ...pushHistory(state), course: next }
    }),

  selectElement: (selectedElement) =>
    set({
      selectedElement,
      selectedBlockId: selectedElement?.kind === 'block' ? selectedElement.id : null
    }),

  undo: () =>
    set((state) => {
      if (!state.history.length) return state
      const previous = state.history[state.history.length - 1]
      return {
        course: previous,
        selectedElement: null,
        selectedBlockId: null,
        history: state.history.slice(0, -1),
        future: [structuredClone(state.course), ...state.future]
      }
    }),

  redo: () =>
    set((state) => {
      if (!state.future.length) return state
      const [next, ...rest] = state.future
      return {
        course: next,
        selectedElement: null,
        selectedBlockId: null,
        history: [...state.history, structuredClone(state.course)],
        future: rest
      }
    }),

  exportCourse: () => structuredClone(get().course)
}))
