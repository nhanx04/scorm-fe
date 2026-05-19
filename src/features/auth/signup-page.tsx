import React from 'react'
import SignUpForm from './components/SignUpForm'
import signupImg from '@/assets/signup.png'

const SignUpPage: React.FC = () => (
  <div className='h-screen flex'>
    <div className='flex-grow flex items-center justify-center'>
      <img src={signupImg} alt='Sign Up' className='w-full h-full object-contain' />
    </div>
    {/* </div> */}

    {/* Right side: form */}
    <div className='w-full md:w-2/5 flex items-center justify-center p-8'>
      <div className='w-full max-w-md'>
        <h1 className='text-2xl font-bold uppercase text-center text-blue-900 mb-8'>Sign Up</h1>
        <SignUpForm />
      </div>
    </div>
  </div>
)

export default SignUpPage
