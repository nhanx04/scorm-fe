import React from 'react'
import { FaGoogle, FaFacebookF } from 'react-icons/fa'
import { useGoogleLogin } from '@react-oauth/google'
import { useGoogleSignIn } from '../hook/useGoogleSignIn' // Import hook vừa tạo

const buttonClass =
  'flex items-center justify-center gap-2 w-full py-2 border rounded-md text-sm font-medium transition-colors'

const SocialLoginButtons: React.FC = () => {
  // 1. Sử dụng hook xử lý logic gọi API backend
  const { loginGoogle, loading } = useGoogleSignIn()

  // 2. Cấu hình Google Login
  const handleGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // Khi Google trả về accessToken thành công, gọi hàm login với backend
      console.log('Google Access Token:', tokenResponse.access_token)
      loginGoogle(tokenResponse.access_token)
    },
    onError: () => {
      console.log('Login Failed')
    },
    // flow: 'implicit' là mặc định, trả về access_token. 
    // Nếu backend bạn cần 'auth-code', hãy đổi thành flow: 'auth-code'
  })

  const handleFacebook = () => {
    // Placeholder for Facebook OAuth integration
    console.log('Facebook login not implemented yet')
  }

  return (
    <div className='flex gap-4'>
      <button 
        type='button' 
        onClick={() => handleGoogle()} 
        disabled={loading}
        className={`${buttonClass} bg-white text-gray-700 hover:bg-gray-50 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <FaGoogle className='text-red-500' />
        {loading ? 'Processing...' : 'Google'}
      </button>
      <button
        type='button'
        onClick={handleFacebook}
        className={`${buttonClass} bg-white text-gray-700 hover:bg-gray-50`}
      >
        <FaFacebookF className='text-blue-600' />
        Facebook
      </button>
    </div>
  )
}

export default SocialLoginButtons
