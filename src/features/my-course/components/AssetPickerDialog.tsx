import React, { useEffect, useMemo, useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { mediaApi } from '../../../services/api'

type ImageAsset = {
  id: string
  name: string
  url: string
  uploadedAt: string
}

type VideoAsset = {
  id: string
  title: string
  embedUrl: string
  addedAt: string
  thumbnailUrl?: string
}

type Props = {
  type: 'image' | 'video'
  onClose: () => void
  onSelect: (value: string) => void // imageUrl or video embedUrl
  title?: string
}

const AssetPickerDialog: React.FC<Props> = ({ type, onClose, onSelect, title }) => {
  const [q, setQ] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<ImageAsset[]>([])
  const [videos, setVideos] = useState<VideoAsset[]>([])

  useEffect(() => {
    const run = async () => {
      setIsLoading(true)
      setError('')
      try {
        if (type === 'image') {
          const res = await mediaApi.getImages()
          setImages(
            res.data.map((i) => ({
              id: String(i.id),
              name: i.name,
              url: i.url,
              uploadedAt: i.createdAt
            }))
          )
        } else {
          const res = await mediaApi.getVideoEmbeds()
          setVideos(
            res.data.map((v: any) => ({
              id: String(v.id),
              title: v.title ?? 'Untitled',
              embedUrl: v.embedUrl,
              addedAt: v.createdAt,
              thumbnailUrl: v.thumbnailUrl
            }))
          )
        }
      } catch (e: any) {
        setError(e?.response?.data || e?.message || 'Load assets failed')
      } finally {
        setIsLoading(false)
      }
    }

    run()
  }, [type])

  const visibleImages = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return images.filter((img) => img.name.toLowerCase().includes(qq))
  }, [images, q])

  const visibleVideos = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return videos.filter((vid) => (vid.title ?? '').toLowerCase().includes(qq))
  }, [videos, q])

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden'>
        <div className='flex items-center justify-between p-4 border-b border-gray-200'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>{title || (type === 'image' ? 'Chọn ảnh' : 'Chọn video')}</h2>
            <p className='text-xs text-gray-500'>Từ thư viện (My Library)</p>
          </div>
          <button onClick={onClose} className='p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors'>
            <FiX size={22} />
          </button>
        </div>

        <div className='p-4 border-b border-gray-100'>
          <div className='relative'>
            <FiSearch className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={type === 'image' ? 'Tìm theo tên ảnh...' : 'Tìm theo tiêu đề video...'}
              className='w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </div>
          {error && <div className='mt-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600'>{error}</div>}
        </div>

        <div className='p-4 overflow-y-auto max-h-[70vh]'>
          {isLoading ? (
            <div className='text-center py-10 text-sm text-gray-600'>Loading...</div>
          ) : type === 'image' ? (
            visibleImages.length ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {visibleImages.map((img) => (
                  <button
                    key={img.id}
                    type='button'
                    onClick={() => {
                      onSelect(img.url)
                      onClose()
                    }}
                    className='text-left rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow'
                    title={img.name}
                  >
                    <div className='h-40 bg-gray-100 overflow-hidden'>
                      <img src={img.url} alt={img.name} className='w-full h-full object-cover' />
                    </div>
                    <div className='p-3'>
                      <div className='text-sm font-medium text-gray-900 truncate'>{img.name}</div>
                      <div className='text-xs text-gray-500 truncate'>{img.url}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className='text-center py-10 text-sm text-gray-600'>Không có ảnh phù hợp.</div>
            )
          ) : visibleVideos.length ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {visibleVideos.map((vid) => (
                <button
                  key={vid.id}
                  type='button'
                  onClick={() => {
                    onSelect(vid.embedUrl)
                    onClose()
                  }}
                  className='text-left rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow'
                  title={vid.title}
                >
                  <div className='h-40 bg-gray-100 overflow-hidden flex items-center justify-center'>
                    {vid.thumbnailUrl ? (
                      <img src={vid.thumbnailUrl} alt={vid.title} className='w-full h-full object-cover' />
                    ) : (
                      <div className='text-xs text-gray-500 px-3'>No thumbnail</div>
                    )}
                  </div>
                  <div className='p-3'>
                    <div className='text-sm font-medium text-gray-900 truncate'>{vid.title}</div>
                    <div className='text-xs text-gray-500 truncate'>{vid.embedUrl}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className='text-center py-10 text-sm text-gray-600'>Không có video phù hợp.</div>
          )}
        </div>

        <div className='p-4 border-t border-gray-200 flex justify-end'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 text-gray-700 font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssetPickerDialog

