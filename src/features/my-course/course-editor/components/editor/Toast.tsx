import React from 'react'

type ToastProps = {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 min-w-[300px] rounded-lg px-5 py-4 shadow-xl text-white animate-fade-in ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      <div className='font-medium'>{message}</div>

      <button type='button' onClick={onClose} className='mt-2 text-sm text-white/80 hover:text-white transition-colors'>
        Dismiss
      </button>
    </div>
  )
}

export default Toast
