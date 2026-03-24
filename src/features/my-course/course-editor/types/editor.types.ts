export type PageType = 'content' | 'quiz'
export type BlockType = 'TEXT' | 'IMAGE' | 'VIDEO'
export type EditorMode = 'edit' | 'preview'

export interface ThemeTokens {
  background?: string
  textColor?: string
  borderRadius?: number
  padding?: number
}

export interface ThemeConfig {
  global: {
    primaryColor: string
    background: string
    textColor: string
    borderRadius: number
    fontFamily: string
  }
  sectionOverrides?: Record<string, ThemeTokens>
  pageOverrides?: Record<string, ThemeTokens>
  blockOverrides?: Record<string, ThemeTokens>
}

export type Course = {
  id: string
  serverId?: number
  title: string
  description?: string
  coverImageUrl?: string
  passingScore?: number
  attemptLimit?: number
  durationMin?: number
}

export type Section = {
  id: string
  title: string
  description?: string
}

export interface BaseBlock {
  id: string
  orderIndex: number
  type: BlockType
  themeOverride?: ThemeTokens
}

export interface TextBlock extends BaseBlock {
  type: 'TEXT'
  textHtml: string
}

export interface ImageBlock extends BaseBlock {
  type: 'IMAGE'
  imageUrl: string
  caption?: string
}

export interface VideoBlock extends BaseBlock {
  type: 'VIDEO'
  embedUrl: string
}

export type Block = TextBlock | ImageBlock | VideoBlock

export type QuestionType =
  | 'MCQ_SINGLE'
  | 'MCQ_MULTIPLE'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'FILL_IN_THE_BLANK'
  | 'MATCHING'

export interface BaseQuestion {
  id: string
  title?: string
  questionType: QuestionType
  promptHtml: string
  explanationHtml?: string
  orderIndex: number
  themeOverride?: ThemeTokens
}

export interface MCQOption {
  id: string
  labelHtml: string
  isCorrect: boolean
  feedback?: string
}

export interface MCQSingleQuestion extends BaseQuestion {
  questionType: 'MCQ_SINGLE'
  options: MCQOption[]
}

export interface MCQMultipleQuestion extends BaseQuestion {
  questionType: 'MCQ_MULTIPLE'
  options: MCQOption[]
}

export interface TrueFalseQuestion extends BaseQuestion {
  questionType: 'TRUE_FALSE'
  correctAnswer: boolean
}

export interface ShortAnswerQuestion extends BaseQuestion {
  questionType: 'SHORT_ANSWER'
  acceptableAnswers?: string[]
  charLimit?: number
}

export interface FillBlankQuestion extends BaseQuestion {
  questionType: 'FILL_IN_THE_BLANK'
  sentenceHtml: string
  answers: string[]
}

export interface MatchingPair {
  id: string
  left: string
  right: string
}

export interface MatchingQuestion extends BaseQuestion {
  questionType: 'MATCHING'
  pairs: MatchingPair[]
}

export type Question =
  | MCQSingleQuestion
  | MCQMultipleQuestion
  | TrueFalseQuestion
  | ShortAnswerQuestion
  | FillBlankQuestion
  | MatchingQuestion

export type Page = {
  id: string
  title: string
  type: PageType
  layoutType?: 'SINGLE_COLUMN'
  passingScore?: number
  attemptAllowed?: number
  themeOverride?: ThemeTokens
}

export interface EditorState {
  course: Course
  theme: ThemeConfig
  mode: EditorMode
  sectionOrder: string[]
  sections: Record<string, Section>
  pageOrder: Record<string, string[]>
  pages: Record<string, Page>
  blockOrder: Record<string, string[]>
  blocks: Record<string, Block>
  questionOrder: Record<string, string[]>
  questions: Record<string, Question>
  activePageId: string | null
}
