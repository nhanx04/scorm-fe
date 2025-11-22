import React from 'react'
import { FiMoreHorizontal, FiTag } from 'react-icons/fi'

type Props = {
  id: string
  title: string
  description: string
  imageUrl: string
  modifiedAt: string
  badge?: string
  tags?: string[]
}

function formatModified(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  })
}

const CourseCard: React.FC<Props> = ({ title, imageUrl, modifiedAt, badge, tags = [] }) => {
  return (
    <div className='rounded-lg border border-gray-200 bg-white p-4 cursor-pointer'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-4'>
          {/* Thumbnail */}
          <div className='relative'>
            <img src={imageUrl} alt={title} className='h-24 w-40 rounded-md object-cover' />
            <span className='absolute bottom-1 left-1 rounded bg-white/95 px-1.5 py-0.5 text-[10px] text-gray-600 shadow'>
              Modified {formatModified(modifiedAt)}
            </span>
          </div>

          {/* Content */}
          <div>
            <h3 className='text-sm font-medium text-gray-900'>{title}</h3>
            <div className='mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600'>
              <button type='button' className='inline-flex items-center gap-1 text-green-600 hover:underline'>
                <FiTag className='-mt-[1px]' size={12} /> Add tag
              </button>

              {badge && (
                <span className='rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase text-gray-700'>
                  {badge}
                </span>
              )}

              {tags.length > 0 &&
                tags.map((t) => (
                  <span key={t} className='rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700'>
                    {t}
                  </span>
                ))}

              <a href='#' className='text-gray-500 hover:text-gray-700 hover:underline'>
                More details
              </a>
            </div>
          </div>
        </div>

        <button
          type='button'
          className='rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          aria-label='More actions'
        >
          <FiMoreHorizontal size={18} />
        </button>
      </div>
    </div>
  )
}

export default CourseCard
