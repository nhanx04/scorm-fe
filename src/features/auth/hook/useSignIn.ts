import { useState } from 'react'
import { authApi } from '@/services/api'
import type { SignInRequest, SignInResponse, ApiError } from '../type/auth.type'

interface UseSignInReturn {
  loading: boolean
  error: string | null
  data: SignInResponse | null
  signIn: (payload: SignInRequest) => Promise<void>
}

export const useSignIn = (): UseSignInReturn => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SignInResponse | null>(null)

  const signIn = async (payload: SignInRequest) => {
    setLoading(true)
    setError(null)

    try {
      const res = await authApi.login(payload)
      const responseData = res.data as unknown as SignInResponse
      setData(responseData)

      // Store token for future authenticated requests
      localStorage.setItem('accessToken', responseData.token)
      localStorage.setItem('auth_token', responseData.token)
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: ApiError; message?: string } }
      const message =
        apiErr.response?.data?.message || apiErr.response?.data || apiErr.response?.message || 'Login failed'
      setError(typeof message === 'string' ? message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, data, signIn }
}
