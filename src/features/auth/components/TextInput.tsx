import React from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  register: UseFormRegisterReturn
  error?: string
  containerClassName?: string
}

const TextInput: React.FC<TextInputProps> = ({ label, register, error, containerClassName = '', ...inputProps }) => (
  <div className={`w-full ${containerClassName}`}>
    <label className='block text-sm font-medium text-gray-700 mb-1'>
      {label}
      <input
        className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        {...register}
        {...inputProps}
      />
    </label>
    {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
  </div>
)

export default TextInput
