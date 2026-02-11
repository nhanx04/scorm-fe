import { useState } from 'react'
import { authApi } from '@/services/api'
import type { SignUpRequest, SignInResponse, ApiError } from '../type/auth.type'

interface UseSignUpReturn {
  loading: boolean
  error: string | null
  data: SignInResponse | null
  signUp: (payload: SignUpRequest) => Promise<void>
}

export const useSignUp = (): UseSignUpReturn => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SignInResponse | null>(null)

  const signUp = async (payload: SignUpRequest) => {
    setLoading(true)
    setError(null)

    try {
      const res = await authApi.register({
        email: payload.email,
        password: payload.password,
        fname: payload.fname,
        lname: payload.lname
      })
      setData(res.data as unknown as SignInResponse)
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: ApiError; message?: string } }
      const message = apiErr.response?.data?.message || apiErr.response?.message || 'Sign up failed'
      setError(typeof message === 'string' ? message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, data, signUp }
}
