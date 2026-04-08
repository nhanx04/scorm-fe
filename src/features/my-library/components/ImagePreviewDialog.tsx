import React from 'react'
import { FiX } from 'react-icons/fi'

interface ImagePreviewDialogProps {
  open: boolean
  imageUrl?: string
  imageName?: string
  onClose: () => void
}

const ImagePreviewDialog: React.FC<ImagePreviewDialogProps> = ({ open, imageUrl, imageName, onClose }) => {
  if (!open) return null

  return (
    <div className='fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4' onClick={onClose}>
      <div
        className='relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-[#0b1220] shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between border-b border-white/10 px-4 py-3'>
          <p className='truncate pr-4 text-sm font-medium text-white'>{imageName || 'Image preview'}</p>
          <button
            type='button'
            onClick={onClose}
            className='inline-flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white'
          >
            <FiX className='h-5 w-5' />
          </button>
        </div>

        <div className='flex max-h-[calc(90vh-56px)] items-center justify-center p-4'>
          {imageUrl ? (
            <img src={imageUrl} alt={imageName || 'preview'} className='max-h-[calc(90vh-88px)] max-w-full object-contain' />
          ) : (
            <p className='text-sm text-white/70'>No preview available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImagePreviewDialog

