// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React, { useMemo, useState } from 'react'
import { FiFolderPlus, FiPlus } from 'react-icons/fi'
import type { Library } from '../types/library'
import FileCard from './FileCard'
import LibraryToolbar, { type SortValue, type ViewMode } from './LibraryToolbar'

interface FolderListProps {
  data: Library[]
  onSelect: (lib: Library) => void
  onOpenCreate: () => void
  onRefresh: () => void
  deleting?: boolean
  onDeleteLibrary: (libraryId: number, libraryName: string) => void
  onBulkDeleteLibraries: (libraryIds: number[]) => void
}

const FolderList: React.FC<FolderListProps> = ({
  data,
  onSelect,
  onOpenCreate,
  onRefresh,
  deleting = false,
  onDeleteLibrary,
  onBulkDeleteLibraries
}) => {
  const [sortBy, setSortBy] = useState<SortValue>('date')
  const [hideMeta, setHideMeta] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const sortedData = useMemo(() => {
    const cloned = [...data]
    if (sortBy === 'name') return cloned.sort((a, b) => a.libraryName.localeCompare(b.libraryName))
    return cloned.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
  }, [data, sortBy])

  const allSelected = sortedData.length > 0 && selectedIds.length === sortedData.length

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-900'>Thư viện của tôi</h2>
        <div className='flex items-center gap-2'>
          <button
            className='inline-flex items-center gap-2 rounded-lg bg-blue-900 px-3 py-2 text-sm font-medium text-white transition-all duration-150 hover:brightness-110'
            onClick={onOpenCreate}
            type='button'
          >
            <FiPlus className='h-4 w-4' />
            New Folder
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
      />

      <div className='mb-2 flex items-center gap-2'>
        <input
          id='select-all-libraries'
          type='checkbox'
          checked={allSelected}
          onChange={(e) => setSelectedIds(e.target.checked ? sortedData.map((lib) => lib.libraryId) : [])}
          className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
        />
        <label htmlFor='select-all-libraries' className='text-sm text-gray-700'>
          Select All
        </label>
      </div>

      {selectedIds.length > 0 && (
        <div className='mb-2 flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-3 py-2'>
          <p className='text-sm text-red-700'>{selectedIds.length} selected</p>
          <button
            type='button'
            disabled={deleting}
            className='rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60'
            onClick={() => onBulkDeleteLibraries(selectedIds)}
          >
            {deleting ? 'Deleting...' : 'Delete Selected'}
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
        {sortedData.map((lib) => (
          <FileCard
            key={lib.libraryId}
            name={lib.libraryName}
            type='FOLDER'
            updatedAt={lib.updatedAt}
            selected={selectedIds.includes(lib.libraryId)}
            hideMeta={hideMeta}
            viewMode={viewMode}
            onClick={() => onSelect(lib)}
            onDelete={() => {
              onDeleteLibrary(lib.libraryId, lib.libraryName)
              setSelectedIds((prev) => prev.filter((id) => id !== lib.libraryId))
            }}
            onToggleSelect={() =>
              setSelectedIds((prev) =>
                prev.includes(lib.libraryId) ? prev.filter((id) => id !== lib.libraryId) : [...prev, lib.libraryId]
              )
            }
          />
        ))}
      </div>

      {data.length === 0 && <p className='py-8 text-center text-sm text-gray-500'>No library yet.</p>}
    </div>
  )
}

export default FolderList
