import React from 'react'
import { FiArrowLeft, FiArrowRight, FiEye, FiEyeOff, FiGrid, FiList, FiRefreshCw } from 'react-icons/fi'
import { HiArrowsUpDown } from 'react-icons/hi2'

export type ViewMode = 'grid' | 'list'
export type SortValue = 'name' | 'date' | 'size'

interface LibraryToolbarProps {
  onRefresh: () => void
  sortBy: SortValue
  onSortChange: (value: SortValue) => void
  hideMeta: boolean
  onToggleHide: () => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  showNavigation?: boolean
  onBack?: () => void
  onForward?: () => void
}

const ghostBtn =
  'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-all duration-150 hover:bg-gray-100'

const LibraryToolbar: React.FC<LibraryToolbarProps> = ({
  onRefresh,
  sortBy,
  onSortChange,
  hideMeta,
  onToggleHide,
  viewMode,
  onViewModeChange,
  showNavigation = false,
  onBack,
  onForward
}) => {
  return (
    <div className='mb-4 flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <button type='button' className={ghostBtn} onClick={onRefresh}>
          <FiRefreshCw className='h-4 w-4' />
          Refresh
        </button>

        {showNavigation && (
          <>
            <button type='button' className={ghostBtn} onClick={onBack}>
              <FiArrowLeft className='h-4 w-4' />
            </button>
            <button type='button' className={ghostBtn} onClick={onForward}>
              <FiArrowRight className='h-4 w-4' />
            </button>
          </>
        )}
      </div>

      <div className='flex items-center gap-2'>
        <label className={`${ghostBtn} cursor-pointer`}>
          <HiArrowsUpDown className='h-4 w-4' />
          <span>Sort</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortValue)}
            className='bg-transparent text-sm text-gray-700 focus:outline-none'
          >
            <option value='name'>Name</option>
            <option value='date'>Date</option>
            <option value='size'>Size</option>
          </select>
        </label>

        <button type='button' className={ghostBtn} onClick={onToggleHide}>
          {hideMeta ? <FiEyeOff className='h-4 w-4' /> : <FiEye className='h-4 w-4' />}
          Hide
        </button>

        <div className='flex items-center rounded-lg bg-gray-100 p-1'>
          <button
            type='button'
            onClick={() => onViewModeChange('grid')}
            className={`rounded-md p-1.5 transition ${viewMode === 'grid' ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            <FiGrid className='h-4 w-4' />
          </button>
          <button
            type='button'
            onClick={() => onViewModeChange('list')}
            className={`rounded-md p-1.5 transition ${viewMode === 'list' ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            <FiList className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default LibraryToolbar
