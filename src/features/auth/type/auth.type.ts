/* Types related to authentication */

export interface SignInRequest {
  email: string
  password: string
}

export interface User {
  userId: number
  fname: string
  minit?: string | null
  lname: string
  email: string
  avatarUrl?: string | null
}

export interface SignUpRequest {
  fname: string
  minit?: string
  lname: string
  email: string
  password: string
  confirmPassword: string
}

export interface SignInResponse {
  token: string
  user: User
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
