import React from 'react'
import SignInForm from './components/SignInForm'
import signinImg from '@/assets/signin.png'

const SignInPage: React.FC = () => (
  <div className="h-screen flex">
    {/* Left side */}
    <div className="w-full md:w-2/5 flex items-center justify-center bg-white p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold uppercase text-center text-blue-900 mb-8">Sign In</h1>
        <SignInForm />
      </div>
    </div>

    {/* Right side */}
    <div className="hidden md:block md:w-3/5 h-full">
      <img src={signinImg} alt="Sign In" className="w-full h-full object-cover" />
    </div>
  </div>
)

export default SignInPage

