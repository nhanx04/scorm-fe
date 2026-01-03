import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { authApi } from '../../../services/api'

const RegisterForm = () => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }
    if (!fullName.trim()) {
      setError('Vui lòng nhập họ tên')
      return
    }

    setLoading(true)
    try {
      await authApi.register({ email, password, fullName })
      navigate('/')
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (err as any).response?.data
          : null
      setError(message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className='space-y-6' onSubmit={onSubmit}>
      <div>
        <label htmlFor='fullName' className='block text-sm font-medium text-gray-700'>
          Họ tên
        </label>
        <div className='mt-1'>
          <input
            id='fullName'
            name='fullName'
            type='text'
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
          />
        </div>
      </div>
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
            autoComplete='new-password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
          />
        </div>
      </div>

      <div>
        <label htmlFor='confirm-password' className='block text-sm font-medium text-gray-700'>
          Xác nhận mật khẩu
        </label>
        <div className='mt-1'>
          <input
            id='confirm-password'
            name='confirm-password'
            type='password'
            autoComplete='new-password'
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </div>
    </form>
  )
}

export default RegisterForm
