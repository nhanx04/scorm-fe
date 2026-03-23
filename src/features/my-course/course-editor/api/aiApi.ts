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
    sentenceHtml?: string
    pairs?: Array<{ left: string; right: string }>
  }>
}

export const generateContent = async (prompt: string): Promise<AIBlockResult> => {
  const { data } = await api.post('/editor/ai/content', { prompt })
  return data
}

export const generateQuiz = async (prompt: string): Promise<AIQuizResult> => {
  const { data } = await api.post('/editor/ai/quiz', { prompt })
  return data
}
