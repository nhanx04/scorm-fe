import React from 'react'
import { FiDownload, FiTrash2 } from 'react-icons/fi'

export type Image = {
  id: string
  name: string
  url: string
  size: number
  uploadedAt: string
  dimensions?: {
    width: number
    height: number
  }
}

type Props = Image & {
  onDelete?: (id: string) => void
  onDownload?: (id: string) => void
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  })
}

const ImageCard: React.FC<Props> = ({ id, name, url, size, uploadedAt, dimensions, onDelete, onDownload }) => {
  return (
    <div className='rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow'>
      {/* Image preview */}
      <div className='relative h-48 bg-gray-100 overflow-hidden'>
        <img src={url} alt={name} className='w-full h-full object-cover' />
      </div>

      {/* Content */}
      <div className='p-4'>
        <div className='flex items-start justify-between mb-2'>
          <h3 className='text-sm font-medium text-gray-900 truncate flex-1'>{name}</h3>
          <div className='flex gap-2 ml-2'>
            {onDownload && (
              <button
                onClick={() => onDownload(id)}
                className='p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded transition-colors'
                title='Download'
              >
                <FiDownload size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(id)}
                className='p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded transition-colors'
                title='Delete'
              >
                <FiTrash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className='space-y-1 text-xs text-gray-600'>
          <div className='flex justify-between'>
            <span>Size:</span>
            <span className='font-medium'>{formatFileSize(size)}</span>
          </div>
          {dimensions && (
            <div className='flex justify-between'>
              <span>Dimensions:</span>
              <span className='font-medium'>
                {dimensions.width} × {dimensions.height}
              </span>
            </div>
          )}
          <div className='flex justify-between'>
            <span>Uploaded:</span>
            <span className='font-medium'>{formatDate(uploadedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageCard
