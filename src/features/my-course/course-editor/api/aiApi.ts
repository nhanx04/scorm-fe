import { api } from '@/services/api'

export type AIBlockResult = {
  type: 'TEXT' | 'IMAGE' | 'VIDEO'
  content: string
}

export type AIQuizResult = {
  questions: Array<{
    type: 'MCQ_SINGLE' | 'MCQ_MULTIPLE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'FILL_IN_THE_BLANK' | 'MATCHING'
    prompt: string
    options?: string[]
    correctAnswer?: boolean | string | string[]
    explanation?: string
    sentenceHtml?: string
    pairs?: Array<{ left: string; right: string }>
  }>
}

export type AICourseOutlineRequest = {
  courseTitle: string
  courseDescription: string
  targetAudience: string
  audienceProficiencyLevel: string
  duration: string
  language: string
  learningOutcomes: string
  prerequisites: string
  additionalInstructions?: string
}

export type AICourseOutlineResponse = {
  title: string
  description: string
  sections: Array<{
    title: string
    topics: string[]
  }>
  // Văn bản gốc trích từ file (chỉ có khi tạo outline từ file). Cần round-trip
  // xuống createCourse để backend lưu làm nguồn cho việc tạo quiz sau này.
  sourceDocumentText?: string
}

export type AIGeneratePageContentRequest = {
  courseId?: number // Để backend nạp tài liệu gốc làm nguồn, giúp nội dung bám sát tài liệu
  courseTopic: string
  sectionTitle: string
  pageTopic: string
  language: string
  additionalInstructions?: string
}

export type AIGenerateCourseQuizRequest = {
  courseId?: number // Để backend nạp tài liệu gốc của khóa học làm nguồn dữ kiện
  focusTopic: string // Nội dung/chủ đề người dùng nhập muốn ra đề
  courseTitle?: string
  courseDescription?: string
  sectionTitle?: string
  pageTitle?: string
  numberOfQuestions: number
  language: string
  difficulty?: string
}

export const generatePageContent = async (payload: AIGeneratePageContentRequest): Promise<AIBlockResult> => {
  const { data } = await api.post('/ai/generate-page-content', payload)
  return {
    type: 'TEXT',
    content: data?.htmlContent ?? ''
  }
}

export const generateQuiz = async (payload: AIGenerateCourseQuizRequest): Promise<AIQuizResult> => {
  const { data } = await api.post('/ai/generate-course-quiz', payload)
  return data
}

export const generateCourseOutline = async (payload: AICourseOutlineRequest): Promise<AICourseOutlineResponse> => {
  const { data } = await api.post('/ai/generate-outline', payload)
  return data
}

export const generateCourseOutlineFromFile = async (
  file: File,
  payload?: Partial<AICourseOutlineRequest>
): Promise<AICourseOutlineResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  if (payload) {
    formData.append('request', JSON.stringify(payload))
  }

  // Đã thêm header multipart/form-data để backend có thể đọc được file
  const { data } = await api.post('/ai/generate-outline-from-file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return data
}
