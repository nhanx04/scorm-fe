import React, { useState, useMemo } from 'react'
import { FiSearch, FiPlus } from 'react-icons/fi'
import VideoCard from './VideoCard'
import type { Video } from './VideoCard'
import AddVideoModal from './AddVideoModal'

const mockVideos: Video[] = [
  {
    id: 'vid1',
    title: 'Introduction to React',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    source: 'youtube',
    addedAt: '2025-11-05'
  },
  {
    id: 'vid2',
    title: 'Web Development Tutorial',
    embedUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    source: 'youtube',
    addedAt: '2025-11-03'
  },
  {
    id: 'vid3',
    title: 'JavaScript Basics',
    embedUrl: 'https://www.youtube.com/embed/W6NZfCO5tTE',
    source: 'youtube',
    addedAt: '2025-10-28'
  }
]

type SortKey = 'recently-added' | 'oldest' | 'title-asc' | 'title-desc'

type Props = {
  videos?: Video[]
}

const VideoList: React.FC<Props> = ({ videos = mockVideos }) => {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<SortKey>('recently-added')
  const [localVideos, setLocalVideos] = useState(videos)
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false)

  const visible = useMemo(() => {
    let arr = localVideos.filter((vid) => vid.title.toLowerCase().includes(q.toLowerCase()))
    arr = arr.slice().sort((a, b) => {
      const aTime = new Date(a.addedAt).getTime()
      const bTime = new Date(b.addedAt).getTime()
      switch (sort) {
        case 'recently-added':
          return bTime - aTime
        case 'oldest':
          return aTime - bTime
        case 'title-asc':
          return a.title.localeCompare(b.title)
        case 'title-desc':
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })
    return arr
  }, [localVideos, q, sort])

  const handleDelete = (id: string) => {
    setLocalVideos((prev) => prev.filter((vid) => vid.id !== id))
  }

  const handleAddVideo = (video: Omit<Video, 'id'>) => {
    const newVideo: Video = {
      ...video,
      id: 'vid' + Date.now()
    }
    setLocalVideos((prev) => [newVideo, ...prev])
    setIsAddVideoOpen(false)
  }

  return (
    <div>
      {/* Page heading */}
      <div className='mb-5 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-900'>Videos ({visible.length})</h2>
        <div className='flex items-center gap-4'>
          {/* Search */}
          <div className='relative'>
            <FiSearch className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Search videos'
              className='w-56 rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-green-500'
            />
          </div>
          {/* Add video button */}
          <button
            onClick={() => setIsAddVideoOpen(true)}
            className='flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors'
          >
            <FiPlus size={18} />
            Add Video
          </button>
        </div>
      </div>

      {/* Sub header */}
      <div className='mb-4 flex items-center justify-between text-sm'>
        <div className='text-gray-500'>All videos</div>
        <label className='flex items-center gap-2 text-gray-500'>
          <span className='hidden sm:inline'>Sort</span>
          <select
            className='cursor-pointer rounded-md border border-gray-200 bg-white px-2 py-1 text-gray-700 focus:outline-none'
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value='recently-added'>Recently added</option>
            <option value='oldest'>Oldest</option>
            <option value='title-asc'>Title A-Z</option>
            <option value='title-desc'>Title Z-A</option>
          </select>
        </label>
      </div>

      {/* Grid view */}
      {visible.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {visible.map((video) => (
            <VideoCard key={video.id} {...video} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <p className='text-gray-500'>No videos found</p>
        </div>
      )}

      {/* Add Video Modal */}
      {isAddVideoOpen && <AddVideoModal onClose={() => setIsAddVideoOpen(false)} onAdd={handleAddVideo} />}
    </div>
  )
}

export default VideoList
