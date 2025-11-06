import React from 'react'
import logo from '../../../assets/scorm.png'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-blue-900 pt-16 pb-4'>
      <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-lg'>
        <header className='mb-8 flex flex-col items-center gap-4'>
          <div className='w-48'>
            <img src={logo} alt='SCORM Logo' className='block w-full' />
          </div>
          <h1 className='text-2xl font-bold text-gray-700'>{title}</h1>
        </header>
        {children}
      </div>
    </main>
  )
}

export default AuthLayout
