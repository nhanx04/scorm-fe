export type PageType = 'CONTENT' | 'QUIZ'

export type QuestionType =
  | 'MCQ_SINGLE'
  | 'MCQ_MULTI'
  | 'TRUE_FALSE'
  | 'FILL_BLANK'
  | 'MATCHING'
  | 'SHORT_ANSWER'
  | 'GROUPING'

export interface SpacingToken {
  top: number
  right: number
  bottom: number
  left: number
}

export interface ThemeTokens {
  background?: string
  textColor?: string
  fontFamily?: string
  fontSize?: number
  fontWeight?: number
  lineHeight?: number
  letterSpacing?: number
  padding?: SpacingToken
  margin?: SpacingToken
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  opacity?: number
  gradient?: {
    from: string
    to: string
    direction: string
  }
}

export type ThemeOverride = {
  tokens?: ThemeTokens
  [key: string]: unknown
} | null

export interface Block {
  id: string
  orderIndex: number
  textHtml: string
  themeOverride?: ThemeOverride | null
}

export interface ContentPage {
  layoutType: string
  blocks: Block[]
}

export interface Question {
  id: string
  title: string
  promptHtml: string
  questionType: QuestionType
  themeOverride?: ThemeOverride | null
  options?: { id: string; label: string; isCorrect?: boolean }[]
  correctValue?: boolean
  groups?: { id: string; title: string }[]
  items?: { id: string; label: string; groupId?: string }[]
}

export interface QuizPage {
  passingScore: number
  attemptAllowed: number
  questions: Question[]
}

export interface Page {
  id: string
  title: string
  orderIndex: number
  pageType: PageType
  themeOverride: ThemeOverride
  contentPage: ContentPage | null
  quizPage: QuizPage | null
}

export interface Section {
  id: string
  title: string
  description: string
  orderIndex: number
  learningObjective: string
  themeOverride: ThemeOverride
  pages: Page[]
}

export interface Course {
  title: string
  passingScore: number
  attemptLimit: number
  durationMin: number
  status: string
  extraInfor: Record<string, unknown>
  sections: Section[]
}

export type SelectedElement =
  | { kind: 'course'; id: 'course-root' }
  | { kind: 'section'; id: string }
  | { kind: 'page'; id: string }
  | { kind: 'block'; id: string; pageId: string }
  | { kind: 'question'; id: string; pageId: string }
  | null

export interface CourseEditorState {
  course: Course
  selectedElement: SelectedElement
  history: Course[]
  future: Course[]
}
