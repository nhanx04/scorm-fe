import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import { useDelayedLoading } from './useDelayedLoading'

interface PageLoadingProps {
  loading: boolean
  text?: string
  size?: 'sm' | 'md' | 'lg'
  minHeightClassName?: string
}

const PageLoading: React.FC<PageLoadingProps> = ({
  loading,
  text = 'Loading...',
  size = 'lg',
  minHeightClassName = 'min-h-[60vh]'
}) => {
  const show = useDelayedLoading(loading, 200)

  if (!show) return null

  return (
    <div
      className={`flex flex-col items-center justify-center gap-5 ${minHeightClassName} transition-opacity duration-200 ease-out opacity-100`}
      aria-live='polite'
    >
      <LoadingSpinner size={size} className='shadow-lg' />
      {text ? <p className='text-base text-gray-600'>{text}</p> : null}
    </div>
  )
}

export default PageLoading
