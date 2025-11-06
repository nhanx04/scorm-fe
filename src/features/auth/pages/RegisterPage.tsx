import React from 'react'
import AuthLayout from '../components/AuthLayout'
import RegisterForm from '../components/RegisterForm'

const RegisterPage = () => {
  return (
    <AuthLayout title='Create Your Account'>
      <RegisterForm />
      <p className='mt-4 text-center text-sm text-gray-600'>
        Already have an account?{' '}
        <a href='/' className='font-medium text-indigo-600 hover:text-indigo-500'>
          Sign in
        </a>
      </p>
    </AuthLayout>
  )
}

export default RegisterPage
