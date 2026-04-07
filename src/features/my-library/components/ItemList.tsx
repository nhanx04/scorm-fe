// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React, { useMemo, useState } from 'react'
import { FiArrowLeft, FiPlus } from 'react-icons/fi'
import type { Library, MediaItem } from '../types/library'
import FileCard, { type FileCardType } from './FileCard'
import LibraryToolbar, { type SortValue, type ViewMode } from './LibraryToolbar'

interface ItemListProps {
  library: Library
  items: MediaItem[]
  onBack: () => void
  onOpenUpload: () => void
  onRefresh: () => void
  deleting?: boolean
  onDeleteMedia: (mediaId: number, mediaTitle: string) => void
  onBulkDeleteMedia: (payload: { libraryId: number; mediaIds: number[] }) => void
}

function toFileType(type: MediaItem['mediaType']): FileCardType {
  switch (type) {
    case 'IMAGE':
      return 'IMAGE'
    case 'AUDIO':
      return 'AUDIO'
    case 'VIDEO':
      return 'VIDEO'
    default:
      return 'DOCUMENT'
  }
}

function readPreviewUrl(item: MediaItem): string | undefined {
  const metadata = item.metadata as Record<string, unknown>
  const publicUrl = metadata.publicUrl
  if (typeof publicUrl === 'string') return publicUrl

  const youtubeUrl = metadata.youtubeUrl
  if (typeof youtubeUrl === 'string') return youtubeUrl

  return undefined
}

function readSize(item: MediaItem): string | undefined {
  const metadata = item.metadata as Record<string, unknown>
  const size = metadata.size || metadata.fileSize
  if (typeof size === 'number') {
    const mb = size / (1024 * 1024)
    return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`
  }

  if (typeof size === 'string') return size
  return undefined
}

const ItemList: React.FC<ItemListProps> = ({
  library,
  items,
  onBack,
  onOpenUpload,
  onRefresh,
  deleting = false,
  onDeleteMedia,
  onBulkDeleteMedia
}) => {
  const [sortBy, setSortBy] = useState<SortValue>('date')
  const [hideMeta, setHideMeta] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const sortedItems = useMemo(() => {
    const cloned = [...items]

    if (sortBy === 'name') {
      return cloned.sort((a, b) => a.title.localeCompare(b.title))
    }

    if (sortBy === 'size') {
      return cloned.sort((a, b) => {
        const aSize = readSize(a)
        const bSize = readSize(b)
        return (bSize || '').localeCompare(aSize || '')
      })
    }

    return cloned.sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1))
  }, [items, sortBy])

  const imageIds = sortedItems.filter((item) => item.mediaType === 'IMAGE').map((item) => item.mediaId)
  const allSelected = imageIds.length > 0 && selectedIds.length === imageIds.length

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <button
          className='inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-800'
          onClick={onBack}
          type='button'
        >
          <FiArrowLeft size={18} /> Back
        </button>
        <h2 className='text-xl font-semibold text-gray-900'>{library.libraryName}</h2>
        <div className='ml-auto flex items-center gap-2'>
          <button
            className='inline-flex items-center gap-2 rounded-lg bg-blue-900 px-3 py-2 text-sm font-medium text-white transition-all duration-150 hover:brightness-110'
            onClick={onOpenUpload}
            type='button'
          >
            <FiPlus className='h-4 w-4' />
            Upload File
          </button>
        </div>
      </div>

      <LibraryToolbar
        onRefresh={onRefresh}
        sortBy={sortBy}
        onSortChange={setSortBy}
        hideMeta={hideMeta}
        onToggleHide={() => setHideMeta((prev) => !prev)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showNavigation
        onBack={onBack}
      />

      <div className='mb-2 flex items-center gap-2'>
        <input
          id='select-all-items'
          type='checkbox'
          checked={allSelected}
          onChange={(e) => setSelectedIds(e.target.checked ? imageIds : [])}
          className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
        />
        <label htmlFor='select-all-items' className='text-sm text-gray-700'>
          Select All Images
        </label>
      </div>

      {selectedIds.length > 0 && (
        <div className='mb-2 flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-3 py-2'>
          <p className='text-sm text-red-700'>{selectedIds.length} image(s) selected</p>
          <button
            type='button'
            disabled={deleting}
            className='rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60'
            onClick={() => onBulkDeleteMedia({ libraryId: library.libraryId, mediaIds: selectedIds })}
          >
            {deleting ? 'Deleting...' : 'Delete Selected Images'}
          </button>
        </div>
      )}

      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
            : 'space-y-3'
        }
      >
        {sortedItems.map((item) => (
          <FileCard
            key={item.mediaId}
            name={item.title}
            type={toFileType(item.mediaType)}
            updatedAt={item.uploadedAt}
            size={readSize(item)}
            previewUrl={readPreviewUrl(item)}
            selected={selectedIds.includes(item.mediaId)}
            hideMeta={hideMeta}
            viewMode={viewMode}
            onDelete={
              item.mediaType === 'IMAGE'
                ? () => {
                    onDeleteMedia(item.mediaId, item.title)
                    setSelectedIds((prev) => prev.filter((id) => id !== item.mediaId))
                  }
                : undefined
            }
            onToggleSelect={
              item.mediaType === 'IMAGE'
                ? () =>
                    setSelectedIds((prev) =>
                      prev.includes(item.mediaId) ? prev.filter((id) => id !== item.mediaId) : [...prev, item.mediaId]
                    )
                : undefined
            }
          />
        ))}
      </div>

      {items.length === 0 && <p className='py-8 text-center text-sm text-gray-500'>No item yet.</p>}
    </div>
  )
}

export default ItemList
