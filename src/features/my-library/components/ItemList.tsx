// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React from 'react'
import { FiImage, FiFileText, FiMusic, FiVideo, FiArrowLeft } from 'react-icons/fi'
import dayjs from 'dayjs'
import type { Library, MediaItem } from '../types/library'

interface ItemListProps {
  library: Library
  items: MediaItem[]
  onBack: () => void
  onOpenUpload: () => void
}

function getIcon(type: MediaItem['mediaType']) {
  switch (type) {
    case 'IMAGE':
      return <FiImage />
    case 'AUDIO':
      return <FiMusic />
    case 'DOCUMENT':
      return <FiFileText />
    case 'VIDEO':
      return <FiVideo />
    default:
      return null
  }
}

const ItemList: React.FC<ItemListProps> = ({ library, items, onBack, onOpenUpload }) => {
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <button className='text-blue-600 hover:text-blue-800' onClick={onBack} type='button'>
          <FiArrowLeft size={20} /> Back
        </button>
        <h2 className='text-xl font-semibold text-blue-900'>{library.libraryName}</h2>
        <button
          className='ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium'
          onClick={onOpenUpload}
          type='button'
        >
          Upload
        </button>
      </div>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {items.map((item) => {
          const isImage = item.mediaType === 'IMAGE'
          const isVideo = item.mediaType === 'VIDEO'
          const previewUrl = (item.metadata as any)?.publicUrl || (item.metadata as any)?.youtubeUrl
          return (
            <div
              key={item.mediaId}
              className='border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:shadow'
            >
              {isImage && previewUrl ? (
                <img src={previewUrl} alt={item.title} className='w-24 h-24 object-cover mb-3 rounded' />
              ) : isVideo ? (
                <iframe
                  src={previewUrl}
                  className='w-32 h-24 mb-3'
                  title={item.title}
                  allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                ></iframe>
              ) : (
                <div className='text-4xl mb-3 text-blue-800'>{getIcon(item.mediaType)}</div>
              )}
              <p className='font-medium text-blue-900 text-center line-clamp-2'>{item.title}</p>
              <p className='text-xs text-gray-500 mt-1'>Uploaded: {dayjs(item.uploadedAt).format('DD/MM/YYYY')}</p>
            </div>
          )
        })}
        {items.length === 0 && <p className='text-gray-500'>No item yet.</p>}
      </div>
    </div>
  )
}

export default ItemList
