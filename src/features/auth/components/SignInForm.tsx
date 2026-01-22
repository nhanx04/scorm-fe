import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSignIn } from '../hook/useSignIn'
import type { SignInRequest } from '../type/auth.type'
import Divider from './Divider'
import SocialLoginButtons from './SocialLoginButtons'

const SignInForm: React.FC = () => {
  const { register, handleSubmit } = useForm<SignInRequest>()
  const { loading, error, data, signIn } = useSignIn()

  useEffect(() => {
    if (data) {
      // Redirect to dashboard or home after successful login
      window.location.href = '/'
    }
  }, [data])

  const onSubmit = (values: SignInRequest) => signIn(values)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      {error && (
        <p className="text-red-500 text-sm text-center" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          {...register('email', { required: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-md font-semibold transition-colors"
      >
        {loading ? 'Loading...' : 'Submit'}
      </button>

      <Divider />

      <SocialLoginButtons />

      <p className="text-center text-sm text-gray-600">
        Don’t have an account?{' '}
        <a href="/signup" className="text-blue-900 font-medium hover:underline">
          Sign Up
        </a>
      </p>
    </form>
  )
}

export default SignInForm

