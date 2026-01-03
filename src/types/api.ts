export type ReviewMode = 'NO_REVIEW' | 'REVIEW_WITHOUT_ANSWERS' | 'REVIEW_WITH_ANSWERS'
export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'MATCHING' | 'SHORT_ANSWER'

export interface AnswerDTO {
  id?: number
  matchValue?: string
  text: string
  correct: boolean
  answerOrder?: number
  imageUrl?: string
}

export interface QuestionDTO {
  id?: number
  text: string
  questionType: QuestionType
  imageUrl?: string
  questionOrder?: number
  answers: AnswerDTO[]
}

export interface ScormPackageDTO {
  id: number
  welcomeVideoUrl?: string
  themeJson?: string
  title: string
  description?: string
  passingScore: number
  maxAttempts: number
  reviewMode: ReviewMode
  questions: QuestionDTO[]
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  accessToken: string
  tokenType?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}
