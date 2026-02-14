import { useState } from 'react'
import { authApi } from '@/services/api'
import { useNavigate } from 'react-router' // Hoặc dùng hook điều hướng của react-router v7
import type { AuthResponse } from '@/services/api' // Import type từ api.ts

interface UseGoogleSignInReturn {
  loading: boolean
  error: string | null
  loginGoogle: (accessToken: string) => Promise<void>
}

export const useGoogleSignIn = (): UseGoogleSignInReturn => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const loginGoogle = async (accessToken: string) => {
    setLoading(true)
    setError(null)

    try {
      // Gọi API backend của bạn để xác thực token Google
      const res = await authApi.loginGoogle(accessToken)
      const responseData = res.data

      // Lưu token vào localStorage (giống logic trong useSignIn)
      localStorage.setItem('accessToken', responseData.token)

      // Điều hướng về trang chủ hoặc trang dashboard sau khi login thành công
      navigate('/home') // Điều chỉnh đường dẫn theo routing của bạn
    } catch (err: any) {
      console.error('Google Login Error:', err)
      const message = err.response?.data?.message || 'Google login failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, loginGoogle }
}
