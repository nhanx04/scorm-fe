import React from 'react'
import type { OrganizationResource } from '../type'

interface ResourceCardProps {
  resource: OrganizationResource
  canRemove?: boolean
  onOpen?: (resource: OrganizationResource) => void
  onRemove?: (resource: OrganizationResource) => void
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, canRemove = false, onOpen, onRemove }) => {
  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'>
      <div className='mb-3 h-32 overflow-hidden rounded-xl bg-gray-100'>
        {resource.type === 'FOLDER' ? (
          <div className='flex h-full items-center justify-center text-5xl'>📁</div>
        ) : resource.thumbnail ? (
          <img src={resource.thumbnail} alt={resource.name} className='h-full w-full object-cover' />
        ) : (
          <div className='flex h-full items-center justify-center text-3xl text-gray-400'>
            {resource.type === 'COURSE' ? '📘' : '🖼️'}
          </div>
        )}
      </div>

      <div className='space-y-1'>
        <h4 className='line-clamp-1 text-sm font-semibold text-gray-900'>{resource.name}</h4>
        {resource.type === 'COURSE' && <p className='text-xs text-gray-500'>Instructor: {resource.instructor || 'Unknown'}</p>}
        {resource.type === 'FOLDER' && <p className='text-xs text-gray-500'>{resource.folderItemCount || 0} items</p>}
      </div>

      <div className='mt-4 flex gap-2'>
        <button
          type='button'
          onClick={() => onOpen?.(resource)}
          className='rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50'
        >
          Open
        </button>
        {canRemove && (
          <button
            type='button'
            onClick={() => onRemove?.(resource)}
            className='rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50'
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}

export default ResourceCard

