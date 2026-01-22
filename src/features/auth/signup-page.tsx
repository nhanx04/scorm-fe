import React from 'react'
import SignUpForm from './components/SignUpForm'
import signupImg from '@/assets/signup.png'

const SignUpPage: React.FC = () => (
  <div className="h-screen flex">
    {/* Left side: image & branding */}
    <div className="hidden md:flex md:w-3/5 flex-col bg-white p-10">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">SCORMGO</h1>
        <p className="text-gray-600 mt-2">Scorm Authoring Tool with AI Assistant</p>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <img src={signupImg} alt="Sign Up" className="w-full h-full object-contain" />
      </div>
    </div>

    {/* Right side: form */}
    <div className="w-full md:w-2/5 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold uppercase text-center text-blue-900 mb-8">Sign Up</h1>
        <SignUpForm />
      </div>
    </div>
  </div>
)

export default SignUpPage

