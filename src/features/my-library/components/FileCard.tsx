import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { FiCheck, FiFileText, FiFolder, FiImage, FiMoreHorizontal, FiMusic, FiTrash2, FiVideo } from 'react-icons/fi'

dayjs.extend(relativeTime)

export type FileCardType = 'FOLDER' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT'

interface FileCardProps {
  name: string
  type: FileCardType
  updatedAt?: string
  size?: string
  selected?: boolean
  previewUrl?: string
  hideMeta?: boolean
  viewMode?: 'grid' | 'list'
  onClick?: () => void
  onToggleSelect?: () => void
  onDelete?: () => void
}

const cardTheme: Record<FileCardType, { bg: string; icon: React.ReactNode; iconColor: string }> = {
  FOLDER: { bg: 'bg-blue-50', icon: <FiFolder className='h-9 w-9' />, iconColor: 'text-blue-600' },
  IMAGE: { bg: 'bg-green-50', icon: <FiImage className='h-9 w-9' />, iconColor: 'text-green-600' },
  VIDEO: { bg: 'bg-purple-50', icon: <FiVideo className='h-9 w-9' />, iconColor: 'text-purple-600' },
  AUDIO: { bg: 'bg-pink-50', icon: <FiMusic className='h-9 w-9' />, iconColor: 'text-pink-600' },
  DOCUMENT: { bg: 'bg-orange-50', icon: <FiFileText className='h-9 w-9' />, iconColor: 'text-orange-600' }
}

const FileCard: React.FC<FileCardProps> = ({
  name,
  type,
  updatedAt,
  size,
  selected = false,
  previewUrl,
  hideMeta = false,
  viewMode = 'grid',
  onClick,
  onToggleSelect,
  onDelete
}) => {
  const theme = cardTheme[type]
  const meta = [updatedAt ? dayjs(updatedAt).fromNow() : null, size].filter(Boolean).join(' • ')

  return (
    <div
      onClick={onClick}
      role='button'
      className={`group relative w-full rounded-xl border bg-white p-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
        selected ? 'border-blue-500 bg-blue-50/40' : 'border-gray-200'
      } ${viewMode === 'list' ? 'flex items-center gap-3' : ''}`}
    >
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation()
          onToggleSelect?.()
        }}
        className={`absolute left-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded border bg-white text-blue-600 transition-all ${
          selected ? 'border-blue-500 opacity-100' : 'border-gray-300 opacity-0 group-hover:opacity-100'
        }`}
      >
        {selected && <FiCheck className='h-3.5 w-3.5' />}
      </button>

      <div className='absolute right-2 top-2 flex items-center gap-1 opacity-0 transition group-hover:opacity-100'>
        {onDelete && (
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className='rounded-md p-1 text-red-500 transition hover:bg-red-50'
          >
            <FiTrash2 className='h-4 w-4' />
          </button>
        )}
        <span className='rounded-md p-1 text-gray-400 transition group-hover:bg-gray-100'>
          <FiMoreHorizontal className='h-4 w-4' />
        </span>
      </div>

      <div
        className={`flex items-center justify-center overflow-hidden rounded-lg ${theme.bg} ${
          viewMode === 'list' ? 'h-14 w-14 shrink-0' : 'mb-3 h-24 w-full'
        }`}
      >
        {previewUrl && type === 'IMAGE' ? (
          <img src={previewUrl} alt={name} className='h-full w-full object-cover' />
        ) : (
          <span className={theme.iconColor}>{theme.icon}</span>
        )}
      </div>

      <div className={viewMode === 'list' ? 'min-w-0' : ''}>
        <p className='truncate text-sm font-medium text-gray-800'>{name}</p>
        {!hideMeta && <p className='mt-1 truncate text-xs text-gray-500'>{meta || 'Recently updated'}</p>}
      </div>
    </div>
  )
}

export default FileCard
