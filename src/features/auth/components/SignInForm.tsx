import React from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/contexts/AuthContext'
import type { SignInRequest } from '../type/auth.type'
import Divider from './Divider'
import SocialLoginButtons from './SocialLoginButtons'

const SignInForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<SignInRequest>()
  const { login } = useAuth()
  const [error, setError] = React.useState<string | null>(null)

  const onSubmit = async (values: SignInRequest) => {
    try {
      setError(null)
      await login(values.email, values.password)
      // Redirect is handled in the AuthContext
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 w-full'>
      {error && (
        <p className='text-red-500 text-sm text-center' role='alert'>
          {error}
        </p>
      )}

      <div className='space-y-4'>
        <input
          type='email'
          placeholder='Email'
          {...register('email', { required: true })}
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <input
          type='password'
          placeholder='Password'
          {...register('password', { required: true })}
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className='w-full py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-md font-semibold transition-colors'
      >
        {isSubmitting ? 'Loading...' : 'Submit'}
      </button>

      <Divider />

      <SocialLoginButtons />

      <p className='text-center text-sm text-gray-600'>
        Don’t have an account?{' '}
        <a href='/signup' className='text-blue-900 font-medium hover:underline'>
          Sign Up
        </a>
      </p>
    </form>
  )
}

export default SignInForm
