import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import { useDelayedLoading } from './useDelayedLoading'

interface OverlayLoadingProps {
  loading: boolean
  text?: string
}

const OverlayLoading: React.FC<OverlayLoadingProps> = ({ loading, text }) => {
  const show = useDelayedLoading(loading, 200)

  if (!show) return null

  return (
    <div className='absolute inset-0 z-10 rounded-xl bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 transition-opacity duration-200 ease-out opacity-100'>
      <LoadingSpinner size='md' className='scale-110 shadow-lg' />
      {text ? <p className='text-sm text-gray-600'>{text}</p> : null}
    </div>
  )
}

export default OverlayLoading
