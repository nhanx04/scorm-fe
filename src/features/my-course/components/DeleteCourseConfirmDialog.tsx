import React from 'react'
import { FiAlertTriangle, FiX } from 'react-icons/fi'

type DeleteCourseConfirmDialogProps = {
  open: boolean
  courseTitle?: string
  isDeleting?: boolean
  onConfirm: () => void
  onClose: () => void
}

const DeleteCourseConfirmDialog: React.FC<DeleteCourseConfirmDialogProps> = ({
  open,
  courseTitle,
  isDeleting = false,
  onConfirm,
  onClose
}) => {
  if (!open) return null

  return (
    <div className='fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4'>
      <div className='relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
        <button type='button' onClick={onClose} className='absolute right-3 top-3 text-gray-500 hover:text-gray-700'>
          <FiX className='h-5 w-5' />
        </button>

        <div className='mb-4 inline-flex rounded-full bg-red-100 p-2 text-red-600'>
          <FiAlertTriangle className='h-5 w-5' />
        </div>

        <h3 className='text-lg font-semibold text-gray-900'>Delete course?</h3>
        <p className='mt-2 text-sm text-gray-600'>
          Are you sure you want to delete <span className='font-semibold text-gray-800'>{courseTitle || 'this course'}</span>?
          This action cannot be undone.
        </p>

        <div className='mt-6 flex justify-end gap-3'>
          <button
            type='button'
            onClick={onClose}
            disabled={isDeleting}
            className='rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={isDeleting}
            className='rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60'
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteCourseConfirmDialog

