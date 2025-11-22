import { useState } from 'react'
import ImageList from '../components/ImageList'
import VideoList from '../components/VideoList'

type Tab = 'images' | 'videos'

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('images')

  return (
    <div className='h-[calc(100vh-5rem)]'>
      <div className='flex h-[calc(100vh-5rem)] gap-6'>
        {/* Right content area fills remaining width */}
        <div className='flex-1 h-full'>
          <div className='mx-auto max-w-5xl px-4 py-6 h-full overflow-y-auto'>
            {/* Tabs */}
            <div className='mb-6 border-b border-gray-200'>
              <div className='flex gap-8'>
                <button
                  onClick={() => setActiveTab('images')}
                  className={`pb-3 px-1 font-medium transition-colors ${
                    activeTab === 'images'
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Images
                </button>
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`pb-3 px-1 font-medium transition-colors ${
                    activeTab === 'videos'
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Videos
                </button>
              </div>
            </div>

            {/* Content */}
            {activeTab === 'images' && <ImageList />}
            {activeTab === 'videos' && <VideoList />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LibraryPage
