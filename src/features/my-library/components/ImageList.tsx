import React, { useState, useMemo } from 'react'
import { FiSearch } from 'react-icons/fi'
import ImageCard from './ImageCard'
import UploadModal from './UploadModal'
import type { Image } from './ImageCard'

const mockImages: Image[] = [
  {
    id: 'img1',
    name: 'snapchat_TLA3NIBO0TIK.webp',
    url: 'https://images.pexels.com/photos/34491460/pexels-photo-34491460.jpeg',
    size: 53248,
    uploadedAt: '2025-11-05',
    dimensions: { width: 1600, height: 1000 }
  },
  {
    id: 'img2',
    name: 'team-collaboration.jpg',
    url: 'https://images.pexels.com/photos/3184429/pexels-photo-3184429.jpeg',
    size: 125000,
    uploadedAt: '2025-11-04',
    dimensions: { width: 1920, height: 1080 }
  },
  {
    id: 'img3',
    name: 'workspace.png',
    url: 'https://images.pexels.com/photos/34390984/pexels-photo-34390984.jpeg',
    size: 89500,
    uploadedAt: '2025-11-01',
    dimensions: { width: 1280, height: 720 }
  }
]

type SortKey = 'recently-added' | 'oldest' | 'name-asc' | 'name-desc' | 'size-asc' | 'size-desc'

type Props = {
  images?: Image[]
}

const ImageList: React.FC<Props> = ({ images = mockImages }) => {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<SortKey>('recently-added')
  const [localImages, setLocalImages] = useState(images)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const visible = useMemo(() => {
    let arr = localImages.filter((img) => img.name.toLowerCase().includes(q.toLowerCase()))
    arr = arr.slice().sort((a, b) => {
      const aTime = new Date(a.uploadedAt).getTime()
      const bTime = new Date(b.uploadedAt).getTime()
      switch (sort) {
        case 'recently-added':
          return bTime - aTime
        case 'oldest':
          return aTime - bTime
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'size-asc':
          return a.size - b.size
        case 'size-desc':
          return b.size - a.size
        default:
          return 0
      }
    })
    return arr
  }, [localImages, q, sort])

  const handleDelete = (id: string) => {
    setLocalImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleDownload = (id: string) => {
    const image = localImages.find((img) => img.id === id)
    if (image) {
      const link = document.createElement('a')
      link.href = image.url
      link.download = image.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div>
      {/* Page heading */}
      <div className='mb-5 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-900'>Images ({visible.length})</h2>
        <div className='flex items-center gap-4'>
          {/* Search */}
          <div className='relative'>
            <FiSearch className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Search images'
              className='w-56 rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-green-500'
            />
          </div>
          <button
            onClick={() => setIsUploadOpen(true)}
            className='flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors'
          >
            Upload from PC
          </button>
        </div>
      </div>

      {/* Sub header */}
      <div className='mb-4 flex items-center justify-between text-sm'>
        <div className='text-gray-500'>All images</div>
        <label className='flex items-center gap-2 text-gray-500'>
          <span className='hidden sm:inline'>Sort</span>
          <select
            className='cursor-pointer rounded-md border border-gray-200 bg-white px-2 py-1 text-gray-700 focus:outline-none'
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value='recently-added'>Recently added</option>
            <option value='oldest'>Oldest</option>
            <option value='name-asc'>Name A-Z</option>
            <option value='name-desc'>Name Z-A</option>
            <option value='size-asc'>Size (smallest)</option>
            <option value='size-desc'>Size (largest)</option>
          </select>
        </label>
      </div>

      {/* Grid view */}
      {visible.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {visible.map((image) => (
            <ImageCard key={image.id} {...image} onDelete={handleDelete} onDownload={handleDownload} />
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <p className='text-gray-500'>No images found</p>
        </div>
      )}
      {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} />}
    </div>
  )
}

export default ImageList
