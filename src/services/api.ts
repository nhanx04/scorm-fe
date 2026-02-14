import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

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
  token: string
  user: {
    userId: number
    fname: string
    minit: string
    lname: string
    email: string
    avatarUrl: string | null
  }
}

export const authApi = {
  login: (payload: { email: string; password: string }) => api.post<AuthResponse>('/auth/login', payload),
  register: (payload: { email: string; password: string; fname: string; lname: string }) =>
    api.post<AuthResponse>('/auth/register', payload),

  // THÊM DÒNG NÀY: API login bằng Google
  // Backend cần endpoint này để nhận googleToken, verify với Google và trả về JWT
  loginGoogle: (googleToken: string) => api.post<AuthResponse>('/auth/google', { token: googleToken })
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
// --- Media APIs ---
export const mediaApi = {
  // Upload image -> trả về thông tin ảnh đã lưu DB
  uploadFile: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<{
      id: number
      name: string
      url: string
      size: number
      width?: number
      height?: number
      createdAt: string
    }>('/media/upload', form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Danh sách ảnh
  getImages: () =>
    api.get<
      Array<{
        id: number
        name: string
        url: string
        size: number
        width?: number
        height?: number
        createdAt: string
      }>
    >('/media/images'),

  // Tạo link nhúng video
  createVideoEmbed: (payload: { url: string; title: string }) =>
    api.post<{
      id: number
      embedUrl: string
      title: string
      thumbnailUrl?: string
      createdAt: string
      updatedAt: string
    }>('/media/video-embed', payload),

  // Danh sách video nhúng
  getVideoEmbeds: () =>
    api.get<Array<{ id: number; embedUrl: string; originalUrl: string; createdAt: string; updatedAt: string }>>(
      '/media/video-embeds'
    ),

  getVideoEmbed: (id: number | string) =>
    api.get<{ id: number; embedUrl: string; createdAt: string; updatedAt: string }>(`/media/video-embed/${id}`),

  deleteVideoEmbed: (id: number | string) => api.delete(`/media/video-embed/${id}`)
}
