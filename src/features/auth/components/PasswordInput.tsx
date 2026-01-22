import React, { useState } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  register: UseFormRegisterReturn
  error?: string
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, register, error, ...inputProps }) => {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        {label}
        <div className='relative mt-1'>
          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
            <FaLock />
          </span>
          <input
            type={show ? 'text' : 'password'}
            className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            {...register}
            {...inputProps}
          />
          <button
            type='button'
            onClick={() => setShow((prev) => !prev)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </label>
      {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
    </div>
  )
}

export default PasswordInput
