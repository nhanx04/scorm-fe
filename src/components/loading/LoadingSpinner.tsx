import React from 'react'

type LoadingSpinnerSize = 'sm' | 'md' | 'lg'

interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize
  className?: string
}

const sizeClassMap: Record<LoadingSpinnerSize, string> = {
  sm: 'w-6 h-6 border-[3px]',
  md: 'w-8 h-8 border-4',
  lg: 'w-12 h-12 border-4'
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-white p-2 shadow-md ${className}`}
      aria-label='Loading'
      role='status'
    >
      <span
        className={`inline-block rounded-full border-gray-300 border-t-blue-500 animate-[spin_0.7s_linear_infinite,pulse_2s_ease-in-out_infinite] ${sizeClassMap[size]}`}
      />
    </span>
  )
}

export default LoadingSpinner
