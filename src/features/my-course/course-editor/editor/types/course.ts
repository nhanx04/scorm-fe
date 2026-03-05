export type PageType = 'CONTENT' | 'QUIZ'

export type QuestionType =
  | 'MCQ_SINGLE'
  | 'MCQ_MULTIPLE'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'FILL_IN_THE_BLANK'
  | 'MATCHING'
  | 'MCQ_MULTI'
  | 'FILL_BLANK'
  | 'GROUPING'

export interface QuestionOption {
  id: string
  label: string
  value: string
}

export interface MatchingPair {
  id: string
  term: string
  definition: string
}

export type QuestionTemplateData = {
  prompt: string
  explanation?: string
  options?: QuestionOption[]
  correctAnswer?: string | string[] | boolean
  charLimit?: number
  sentence?: string
  blanks?: string[]
  pairs?: MatchingPair[]
}

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

export type LayoutMode = 'flow' | 'absolute'
export type LayoutType = 'column' | 'row' | 'grid' | 'free'

export interface LayoutMeta {
  position?: 'absolute'
  x?: number
  y?: number
  width?: number
  height?: number
  rotation?: number
  zIndex?: number
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  maxWidth?: number
  objectFit?: 'cover' | 'contain' | 'fill'
  locked?: boolean
  groupId?: string | null
}

export interface Block {
  id: string
  orderIndex: number
  textHtml: string
  imageUrl?: string
  themeOverride?: ThemeOverride | null
  layoutMode?: LayoutMode
  layoutMeta?: LayoutMeta
}

export interface ContentPage {
  layoutType: string
  layoutMode?: LayoutMode
  textHtml?: string
  layoutMeta?: LayoutMeta
  grid?: { columns: number; gap: number }
  blocks: Block[]
}

export interface Question {
  id: string
  title: string
  promptHtml: string
  textHtml?: string
  questionType: QuestionType
  templateData?: QuestionTemplateData
  themeOverride?: ThemeOverride | null
  layoutMode?: LayoutMode
  layoutMeta?: LayoutMeta
  options?: { id: string; label: string; isCorrect?: boolean }[]
  correctValue?: boolean
  groups?: { id: string; title: string }[]
  items?: { id: string; label: string; groupId?: string }[]
}

export interface QuizPage {
  passingScore: number
  attemptAllowed: number
  textHtml?: string
  layoutMode?: LayoutMode
  layoutMeta?: LayoutMeta
  layoutType?: LayoutType
  questions: Question[]
}

export interface Page {
  id: string
  title: string
  textHtml?: string
  orderIndex: number
  pageType: PageType
  themeOverride: ThemeOverride
  layoutMode?: LayoutMode
  layoutType?: LayoutType
  layoutMeta?: LayoutMeta
  contentPage: ContentPage | null
  quizPage: QuizPage | null
}

export interface Section {
  id: string
  title: string
  description: string
  textHtml?: string
  orderIndex: number
  learningObjective: string
  themeOverride: ThemeOverride
  layoutMode?: LayoutMode
  layoutType?: LayoutType
  layoutMeta?: LayoutMeta
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
