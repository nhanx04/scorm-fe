import React, { useEffect } from 'react'

export type ToastType = 'success' | 'error'

interface ToastProps {
  open: boolean
  type: ToastType
  message: string
  onClose: () => void
  duration?: number
}

const Toast: React.FC<ToastProps> = ({ open, type, message, onClose, duration = 2500 }) => {
  useEffect(() => {
    if (!open) return

    const timer = window.setTimeout(() => {
      onClose()
    }, duration)

    return () => {
      window.clearTimeout(timer)
    }
  }, [open, duration, onClose])

  if (!open) return null

  const style =
    type === 'success'
      ? 'border-green-200 bg-green-50 text-green-800'
      : 'border-red-200 bg-red-50 text-red-800'

  return (
    <div className='pointer-events-none fixed right-4 top-4 z-[70]'>
      <div className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-lg ${style}`}>{message}</div>
    </div>
  )
}

export default Toast

