import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import { useDelayedLoading } from './useDelayedLoading'

interface SectionLoadingProps {
  loading: boolean
  text?: string
}

const SectionLoading: React.FC<SectionLoadingProps> = ({ loading, text }) => {
  const show = useDelayedLoading(loading, 200)

  if (!show) return null

  return (
    <div className='w-full py-8 flex flex-col items-center justify-center gap-2 transition-opacity duration-200 opacity-100'>
      <LoadingSpinner size='sm' />
      {text ? <p className='text-sm text-gray-500'>{text}</p> : null}
    </div>
  )
}

export default SectionLoading

