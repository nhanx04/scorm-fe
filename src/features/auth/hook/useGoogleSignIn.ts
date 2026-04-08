import { useState } from 'react'
import { authApi } from '@/services/api'
import { useNavigate } from 'react-router'

interface UseGoogleSignInReturn {
  loading: boolean
  error: string | null
  loginGoogle: (accessToken: string) => Promise<void> // Đổi tên tham số
}

export const useGoogleSignIn = (): UseGoogleSignInReturn => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const loginGoogle = async (accessToken: string) => {
    setLoading(true)
    setError(null)

    // Xóa token cũ để đảm bảo sạch sẽ
    localStorage.removeItem('accessToken')
    localStorage.removeItem('auth_token')

    try {
      // Gửi access token lên backend
      const res = await authApi.loginGoogle(accessToken)
      const responseData = res.data

      // Lưu token của hệ thống mình cấp
      localStorage.setItem('accessToken', responseData.token)
      localStorage.setItem('auth_token', responseData.token)

      // Lưu user info vào localStorage (nếu cần thiết cho UI hiển thị ngay)
      localStorage.setItem('user', JSON.stringify(responseData.user))

      navigate('/dashboard') // Hoặc điều hướng về trang dashboard
    } catch (err: any) {
      console.error('Google Login Error:', err)
      // Lấy message lỗi chi tiết từ backend
      const message = err.response?.data?.message || 'Đăng nhập Google thất bại'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, loginGoogle }
}
