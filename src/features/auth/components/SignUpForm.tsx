import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import TextInput from './TextInput'
import PasswordInput from './PasswordInput'
import { useSignUp } from '../hook/useSignUp'
import type { SignUpRequest } from '../type/auth.type'

const SignUpForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<SignUpRequest>()

  const { loading, error, data, signUp } = useSignUp()

  useEffect(() => {
    if (data) {
      window.location.href = '/'
    }
  }, [data])

  const onSubmit = (values: SignUpRequest) => {
    signUp(values)
  }

  const passwordValue = watch('password')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 w-full'>
      {error && (
        <p className='text-red-500 text-sm text-center' role='alert'>
          {error}
        </p>
      )}

      <div className='grid grid-cols-3 gap-4'>
        <TextInput
          label='First name'
          register={register('fname', { required: 'Required' })}
          error={errors.fname?.message}
        />
        <TextInput label='Minit' register={register('minit')} error={errors.minit?.message} />
        <TextInput
          label='Last name'
          register={register('lname', { required: 'Required' })}
          error={errors.lname?.message}
        />
      </div>

      <TextInput
        label='Email'
        type='email'
        register={register('email', { required: 'Required' })}
        error={errors.email?.message}
      />

      <PasswordInput
        label='Password'
        register={register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
        error={errors.password?.message}
      />

      <PasswordInput
        label='Confirm Password'
        register={register('confirmPassword', {
          validate: (v) => v === passwordValue || 'Passwords must match'
        })}
        error={errors.confirmPassword?.message}
      />

      <button
        type='submit'
        disabled={loading}
        className='w-full py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-md font-semibold transition-colors'
      >
        {loading ? 'Loading...' : 'Submit'}
      </button>

      <p className='text-center text-sm text-gray-600'>
        Already have an account?{' '}
        <a href='/signin' className='text-blue-900 font-medium hover:underline'>
          Sign In
        </a>
      </p>
    </form>
  )
}

export default SignUpForm
