import React from 'react'
import { FaGoogle, FaFacebookF } from 'react-icons/fa'

const buttonClass =
  'flex items-center justify-center gap-2 w-full py-2 border rounded-md text-sm font-medium transition-colors'

const SocialLoginButtons: React.FC = () => {
  const handleGoogle = () => {
    // Placeholder for Google OAuth integration
  }

  const handleFacebook = () => {
    // Placeholder for Facebook OAuth integration
  }

  return (
    <div className='flex gap-4'>
      <button type='button' onClick={handleGoogle} className={`${buttonClass} bg-white text-gray-700 hover:bg-gray-50`}>
        <FaGoogle className='text-red-500' />
        Google
      </button>
      <button
        type='button'
        onClick={handleFacebook}
        className={`${buttonClass} bg-white text-gray-700 hover:bg-gray-50`}
      >
        <FaFacebookF className='text-blue-600' />
        Facebook
      </button>
    </div>
  )
}

export default SocialLoginButtons
