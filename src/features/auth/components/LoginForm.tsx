import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { authApi } from '../../../services/api'

const LoginForm = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await authApi.login({ email, password })
      const token = (res.data as any).accessToken || (res.data as any).token
      if (token) {
        localStorage.setItem('accessToken', token)
      }
      // Redirect to My Courses page
      navigate('/home')
    } catch (err: any) {
      setError(err?.response?.status === 401 ? 'Sai email hoặc mật khẩu' : 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className='space-y-6' onSubmit={onSubmit}>
      <div>
        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
          Email
        </label>
        <div className='mt-1'>
          <input
            id='email'
            name='email'
            type='email'
            autoComplete='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
          />
        </div>
      </div>

      <div>
        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
          Mật khẩu
        </label>
        <div className='mt-1'>
          <input
            id='password'
            name='password'
            type='password'
            autoComplete='current-password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
          />
        </div>
      </div>

      {error && <p className='text-sm text-red-600'>{error}</p>}

      <div>
        <button
          type='submit'
          disabled={loading}
          className='flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50'
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </div>
    </form>
  )
}

export default LoginForm
