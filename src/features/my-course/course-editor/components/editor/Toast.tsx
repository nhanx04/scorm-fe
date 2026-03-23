import React from 'react'

type ToastProps = {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div className='fixed bottom-6 right-6 z-50 rounded-lg border px-4 py-3 text-sm shadow-lg bg-white'>
      <div className={`font-medium ${type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>{message}</div>
      <button type='button' onClick={onClose} className='mt-2 text-xs text-gray-500 hover:text-gray-700'>
        Dismiss
      </button>
    </div>
  )
}

export default Toast

