import React from 'react'
import AuthLayout from '../components/AuthLayout'
import LoginForm from '../components/LoginForm'

const LoginPage = () => {
  return (
    <AuthLayout title="Welcome Back!">
      <LoginForm />
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign up
        </a>
      </p>
    </AuthLayout>
  )
}

export default LoginPage

