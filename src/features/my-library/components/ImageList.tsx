import React, { useEffect, useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import ImageCard from './ImageCard'
import UploadModal from './UploadModal'
import type { Image } from './ImageCard'
import { mediaApi } from '../../../services/api'

type SortKey = 'recently-added' | 'oldest' | 'name-asc' | 'name-desc' | 'size-asc' | 'size-desc'

type Props = {
  images?: Image[]
}

type ImageUploadResponse = {
  id: number
  name: string
  url: string
  size: number
  width?: number | null
  height?: number | null
  createdAt: string
}

const ImageList: React.FC<Props> = () => {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<SortKey>('recently-added')
  const [localImages, setLocalImages] = useState<Image[]>([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch images from backend on mount
  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true)
      setError('')
      try {
        const res = await mediaApi.getImages()
        const imgs: Image[] = res.data.map((i) => ({
          id: String(i.id),
          name: i.name,
          url: i.url,
          size: i.size,
          uploadedAt: i.createdAt,
          dimensions: i.width && i.height ? { width: i.width, height: i.height } : undefined
        }))
        setLocalImages(imgs)
      } catch (e: any) {
        setError(e?.response?.data || e?.message || 'Load images failed')
      } finally {
        setIsLoading(false)
      }
    }

    fetchImages()
  }, [])

  const handleUploaded = (img: ImageUploadResponse) => {
    const newImage: Image = {
      id: String(img.id),
      name: img.name,
      url: img.url,
      size: img.size ?? 0,
      uploadedAt: img.createdAt,
      dimensions: img.width && img.height ? { width: img.width, height: img.height } : undefined
    }

    setLocalImages((prev) => [newImage, ...prev])
  }

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

      {error && <div className='mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600'>{error}</div>}

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
      {isLoading ? (
        <div className='text-center py-12'>Loading...</div>
      ) : visible.length > 0 ? (
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

      {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} onUploaded={handleUploaded} />}
    </div>
  )
}

export default ImageList
