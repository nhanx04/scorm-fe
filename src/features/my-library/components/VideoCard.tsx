import React from 'react'
import { FiExternalLink, FiTrash2 } from 'react-icons/fi'

export type Video = {
  id: string
  title: string
  embedUrl: string
  source: 'youtube' | 'vimeo' | 'other'
  addedAt: string
  thumbnail?: string
}

type Props = Video & {
  onDelete?: (id: string) => void
}

function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  })
}

function getVideoThumbnail(embedUrl: string, source: string): string {
  if (source === 'youtube') {
    const videoId = embedUrl.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^/?]+)/)?.[1]
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
  }
  return 'https://via.placeholder.com/320x180?text=Video'
}

const VideoCard: React.FC<Props> = ({
  id,
  title,
  embedUrl,
  source,
  addedAt,
  thumbnail,
  onDelete
}) => {
  const thumbnailUrl = thumbnail || getVideoThumbnail(embedUrl, source)

  return (
    <div className='rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow'>
      {/* Video thumbnail */}
      <div className='relative h-48 bg-gray-100 overflow-hidden group'>
        <img src={thumbnailUrl} alt={title} className='w-full h-full object-cover' />
        {/* Play button overlay */}
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center'>
          <div className='w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
            <svg className='w-6 h-6 text-gray-900 ml-0.5' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z' />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-4'>
        <div className='flex items-start justify-between mb-2'>
          <h3 className='text-sm font-medium text-gray-900 truncate flex-1'>{title}</h3>
          <div className='flex gap-2 ml-2'>
            <a
              href={embedUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded transition-colors'
              title='Open in new tab'
            >
              <FiExternalLink size={16} />
            </a>
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
            <span>Source:</span>
            <span className='font-medium capitalize'>{source}</span>
          </div>
          <div className='flex justify-between'>
            <span>Added:</span>
            <span className='font-medium'>{formatDate(addedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCard

