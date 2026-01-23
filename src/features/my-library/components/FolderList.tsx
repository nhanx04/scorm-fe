// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React from 'react'
import { FiFolder } from 'react-icons/fi'
import dayjs from 'dayjs'
import type { Library } from '../types/library'

interface FolderListProps {
  data: Library[]
  onSelect: (lib: Library) => void
  onOpenCreate: () => void
}

const FolderList: React.FC<FolderListProps> = ({ data, onSelect, onOpenCreate }) => {
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-blue-900'>Thư viện của tôi</h2>
        <button
          className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium'
          onClick={onOpenCreate}
          type='button'
        >
          + New Library
        </button>
      </div>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {data.map((lib) => (
          <button
            key={lib.libraryId}
            onClick={() => onSelect(lib)}
            className='border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:shadow transition'
            type='button'
          >
            <FiFolder size={40} className='text-yellow-500 mb-3' />
            <p className='font-medium text-blue-900'>{lib.libraryName}</p>
            <p className='text-xs text-gray-500 mt-1'>Updated: {dayjs(lib.updatedAt).format('DD/MM/YYYY')}</p>
          </button>
        ))}
        {data.length === 0 && <p className='text-gray-500'>No library yet.</p>}
      </div>
    </div>
  )
}

export default FolderList

