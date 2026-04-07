// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { FiEdit2, FiMoreHorizontal, FiTrash2, FiUsers } from 'react-icons/fi'
import type { Organization } from '../type'

dayjs.extend(relativeTime)

interface Props {
  org: Organization
  onClick: () => void
  onDelete?: () => void
  isDeleting?: boolean
  thumbnailUrl?: string
}

const OrganizationCard: React.FC<Props> = ({ org, onClick, onDelete, isDeleting = false, thumbnailUrl }) => {
  return (
    <div
      onClick={onClick}
      role='button'
      className='group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:border-blue-200 hover:shadow-md'
    >
      <div className='relative h-36 w-full overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100'>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={org.orgName}
            className='h-full w-full object-cover transition-transform duration-200 group-hover:scale-105'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center'>
            <span className='rounded-2xl bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-700 backdrop-blur-sm'>
              {org.orgName.slice(0, 1).toUpperCase()}
            </span>
          </div>
        )}

        <div className='absolute right-3 top-3 flex items-center gap-1'>
          <button
            type='button'
            onClick={(e) => e.stopPropagation()}
            className='rounded-md bg-white/85 p-1.5 text-gray-600 shadow-sm transition hover:bg-white'
            title='Edit organization'
          >
            <FiEdit2 className='h-4 w-4' />
          </button>
          {onDelete && (
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              disabled={isDeleting}
              className='rounded-md bg-white/85 p-1.5 text-red-600 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60'
              title='Delete organization'
            >
              <FiTrash2 className='h-4 w-4' />
            </button>
          )}
          <button
            type='button'
            onClick={(e) => e.stopPropagation()}
            className='rounded-md bg-white/85 p-1.5 text-gray-600 shadow-sm transition hover:bg-white'
            title='More actions'
          >
            <FiMoreHorizontal className='h-4 w-4' />
          </button>
        </div>
      </div>

      <div className='space-y-2 p-5'>
        <h3 className='truncate text-lg font-semibold text-gray-900'>{org.orgName}</h3>
        <p className='line-clamp-2 min-h-10 text-sm text-gray-500'>
          {org.description || 'No description yet for this organization.'}
        </p>
        <div className='flex items-center gap-3 pt-1 text-xs text-gray-500'>
          {typeof org.maxAuthors === 'number' && (
            <span className='inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1'>
              <FiUsers className='h-3.5 w-3.5' />
              {org.maxAuthors} authors
            </span>
          )}
          {org.updatedAt && <span>Updated {dayjs(org.updatedAt).fromNow()}</span>}
        </div>
      </div>
    </div>
  )
}

export default OrganizationCard
