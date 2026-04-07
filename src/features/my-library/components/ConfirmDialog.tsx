import React from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  loading = false,
  onConfirm,
  onCancel
}) => {
  if (!open) return null

  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4'>
      <div className='w-full max-w-md rounded-xl bg-white p-5 shadow-xl'>
        <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
        <p className='mt-2 text-sm text-gray-600'>{message}</p>

        <div className='mt-5 flex items-center justify-end gap-2'>
          <button
            type='button'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60'
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type='button'
            className={`rounded-md px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60 ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

