import React, { useMemo, useState } from 'react'
import type { OrganizationResourceType } from '../type'
import { useSelectableResources } from '../hook/useResource'

interface ShareResourceModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (payload: {
    type: OrganizationResourceType
    mediaAssetId?: number
    courseId?: number
    folderId?: number
  }) => void
  isPending?: boolean
}

const tabStyles = (active: boolean) =>
  `rounded-xl px-3 py-1.5 text-sm font-medium transition ${active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`

const ShareResourceModal: React.FC<ShareResourceModalProps> = ({ open, onClose, onConfirm, isPending = false }) => {
  const [activeTab, setActiveTab] = useState<OrganizationResourceType>('MEDIA')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { data, isLoading } = useSelectableResources()

  const list = useMemo(() => {
    if (!data) return []
    if (activeTab === 'MEDIA') return data.media
    if (activeTab === 'COURSE') return data.courses
    return data.folders
  }, [activeTab, data])

  const handleConfirm = () => {
    if (!selectedId) return
    onConfirm({
      type: activeTab,
      mediaAssetId: activeTab === 'MEDIA' ? selectedId : undefined,
      courseId: activeTab === 'COURSE' ? selectedId : undefined,
      folderId: activeTab === 'FOLDER' ? selectedId : undefined
    })
  }

  if (!open) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
      <div className='w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-900'>Share Resource</h3>
          <button type='button' className='text-sm text-gray-500 hover:text-gray-700' onClick={onClose}>
            Close
          </button>
        </div>

        <div className='mb-4 flex gap-2 rounded-xl bg-gray-50 p-1'>
          <button className={tabStyles(activeTab === 'MEDIA')} type='button' onClick={() => setActiveTab('MEDIA')}>
            MediaAsset
          </button>
          <button className={tabStyles(activeTab === 'COURSE')} type='button' onClick={() => setActiveTab('COURSE')}>
            Course
          </button>
          <button className={tabStyles(activeTab === 'FOLDER')} type='button' onClick={() => setActiveTab('FOLDER')}>
            Folder
          </button>
        </div>

        <div className='h-72 overflow-auto rounded-xl border border-gray-200'>
          {isLoading ? (
            <div className='space-y-2 p-3'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='h-11 animate-pulse rounded-lg bg-gray-100' />
              ))}
            </div>
          ) : !list.length ? (
            <div className='flex h-full items-center justify-center text-sm text-gray-500'>No items found</div>
          ) : (
            <div className='p-2'>
              {list.map((item: any) => (
                <button
                  key={item.id}
                  type='button'
                  onClick={() => setSelectedId(item.id)}
                  className={`mb-2 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition ${selectedId === item.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <span>{item.name}</span>
                  <span className='text-xs text-gray-500'>
                    {activeTab === 'COURSE' ? item.instructor || 'Unknown' : activeTab === 'FOLDER' ? `${item.itemCount || 0} items` : 'Media'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className='mt-4 flex justify-end gap-2'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            type='button'
            disabled={!selectedId || isPending}
            onClick={handleConfirm}
            className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isPending ? 'Sharing...' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShareResourceModal

