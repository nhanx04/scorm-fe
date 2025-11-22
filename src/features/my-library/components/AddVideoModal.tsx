import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import type { Video } from './VideoCard'

type Props = {
  onClose: () => void
  onAdd: (video: Omit<Video, 'id'>) => void
}

const AddVideoModal: React.FC<Props> = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState('')
  const [embedUrl, setEmbedUrl] = useState('')
  const [source, setSource] = useState<'youtube' | 'vimeo' | 'other'>('youtube')
  const [error, setError] = useState('')

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Please enter a video title')
      return
    }

    if (!embedUrl.trim()) {
      setError('Please enter an embed URL')
      return
    }

    if (!validateUrl(embedUrl)) {
      setError('Please enter a valid URL')
      return
    }

    onAdd({
      title: title.trim(),
      embedUrl: embedUrl.trim(),
      source,
      addedAt: new Date().toISOString().split('T')[0]
    })

    setTitle('')
    setEmbedUrl('')
    setSource('youtube')
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg max-w-md w-full mx-4'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-lg font-semibold text-gray-900'>Add Video</h2>
          <button onClick={onClose} className='p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors'>
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {/* Title input */}
          <div>
            <label className='block text-sm font-medium text-gray-900 mb-1'>Video Title</label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g., Introduction to React'
              className='w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-500'
            />
          </div>

          {/* Source select */}
          <div>
            <label className='block text-sm font-medium text-gray-900 mb-1'>Video Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as 'youtube' | 'vimeo' | 'other')}
              className='w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-500'
            >
              <option value='youtube'>YouTube</option>
              <option value='vimeo'>Vimeo</option>
              <option value='other'>Other</option>
            </select>
          </div>

          {/* URL input */}
          <div>
            <label className='block text-sm font-medium text-gray-900 mb-1'>Embed URL</label>
            <input
              type='url'
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              placeholder={
                source === 'youtube' ? 'https://www.youtube.com/embed/VIDEO_ID' : 'https://vimeo.com/VIDEO_ID'
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-500'
            />
            <p className='text-xs text-gray-500 mt-1'>
              {source === 'youtube' &&
                'Use the embed URL from YouTube (e.g., https://www.youtube.com/embed/dQw4w9WgXcQ)'}
              {source === 'vimeo' && 'Use the embed URL from Vimeo (e.g., https://vimeo.com/123456789)'}
              {source === 'other' && 'Enter the full embed URL of the video'}
            </p>
          </div>

          {/* Error message */}
          {error && <div className='p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600'>{error}</div>}

          {/* Preview */}
          {embedUrl && validateUrl(embedUrl) && (
            <div>
              <label className='block text-sm font-medium text-gray-900 mb-2'>Preview</label>
              <div className='w-full aspect-video bg-gray-100 rounded-md overflow-hidden'>
                <iframe
                  src={embedUrl}
                  title='Video preview'
                  className='w-full h-full'
                  allowFullScreen
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                />
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className='flex items-center justify-end gap-3 p-6 border-t border-gray-200'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-700 font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className='px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors'
          >
            Add Video
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddVideoModal
