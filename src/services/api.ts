import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach Bearer token if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Basic 401 handler
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('accessToken')
    }
    return Promise.reject(error)
  }
)

export type AuthResponse = {
  accessToken: string
  tokenType?: string
}

export const authApi = {
  login: (payload: { email: string; password: string }) => api.post<AuthResponse>('/auth/login', payload),
  register: (payload: { email: string; password: string; fullName: string }) =>
    api.post<AuthResponse>('/auth/register', payload)
}

export type ReviewMode = 'NO_REVIEW' | 'REVIEW_WITHOUT_ANSWERS' | 'REVIEW_WITH_ANSWERS'
export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'MATCHING' | 'SHORT_ANSWER'

export type CreateScormPackageRequest = {
  welcomeVideoUrl?: string
  themeJson?: string
  title: string
  description?: string
  passingScore?: number
  maxAttempts?: number
  reviewMode?: ReviewMode
  questions?: Array<{
    id?: number
    text: string
    questionType: QuestionType
    imageUrl?: string
    questionOrder?: number
    points?: number
    answers: Array<{
      id?: number
      matchValue?: string
      text: string
      correct: boolean
      answerOrder?: number
      imageUrl?: string
    }>
  }>
}

export const scormApi = {
  createPackage: (payload: CreateScormPackageRequest) => api.post('/scorm-packages', payload),
  listPackages: () => api.get('/scorm-packages'),
  getPackage: (id: number | string) => api.get(`/scorm-packages/${id}`),
  deletePackage: (id: number | string) => api.delete(`/scorm-packages/${id}`)
}
