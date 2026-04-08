import React, { useState, useRef, useEffect } from 'react'
import { FiTrash2, FiFileText, FiChevronDown, FiTag, FiStar } from 'react-icons/fi'

export interface CourseCardProps {
  title: string
  description: string
  image?: string | null
  status?: string 
  tags?: string[] 
  isFavorite?: boolean // Thêm prop trạng thái yêu thích
  onClick?: () => void
  onDelete?: () => void
  onStatusChange?: (newStatus: string) => void 
  onAddTag?: (newTag: string) => void 
  onFavoriteToggle?: (isFavorite: boolean) => void // Thêm prop xử lý click yêu thích
  isDeleting?: boolean
}

const COURSE_STATUSES = ['Draft', 'In review', 'Ready to publish', 'Published', 'Archived']

const getGradientFromName = (name: string) => {
  const gradients = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-emerald-400 to-emerald-600',
    'from-rose-400 to-rose-600',
    'from-indigo-400 to-indigo-600',
    'from-amber-400 to-amber-600',
  ]
  const index = (name || '').length % gradients.length
  return gradients[index]
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  image,
  status = 'Draft', 
  tags = [], 
  isFavorite = false, // Mặc định là false
  onClick,
  onDelete,
  onStatusChange,
  onAddTag,
  onFavoriteToggle,
  isDeleting = false
}) => {
  const [imgError, setImgError] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  
  // State quản lý việc nhập tag mới
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [newTagValue, setNewTagValue] = useState('')

  const statusRef = useRef<HTMLDivElement>(null)
  const tagInputRef = useRef<HTMLInputElement>(null)

  const firstLetter = title ? title.charAt(0).toUpperCase() : 'C'
  const gradientClass = getGradientFromName(title)

  // Xử lý click ra ngoài để đóng dropdown status
  useEffect(() => {
    if (!isStatusOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setIsStatusOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isStatusOpen])

  // Tự động focus vào input khi mở ô nhập tag
  useEffect(() => {
    if (isAddingTag && tagInputRef.current) {
      tagInputRef.current.focus()
    }
  }, [isAddingTag])

  // Xử lý gửi tag
  const handleTagSubmit = () => {
    const trimmedTag = newTagValue.trim()
    if (trimmedTag && trimmedTag.length <= 50 && !tags.includes(trimmedTag)) {
      onAddTag?.(trimmedTag)
    }
    setIsAddingTag(false)
    setNewTagValue('')
  }

  // Xử lý các phím tắt trong ô input tag
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Chặn mọi phím (đặc biệt là Space) nổi bọt lên Card cha gây chuyển trang
    e.stopPropagation() 

    if (e.key === 'Enter') {
      e.preventDefault()
      handleTagSubmit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsAddingTag(false)
      setNewTagValue('')
    }
  }

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      className='group relative text-left bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 w-full h-full flex flex-col cursor-pointer'
    >
      <div className='relative shrink-0 bg-gray-100 rounded-t-xl overflow-hidden'>
        {image && !imgError ? (
          <img 
            src={image} 
            alt={title} 
            className='w-full h-44 object-cover'
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-44 flex items-center justify-center bg-gradient-to-br ${gradientClass}`}>
             <span className='text-white text-5xl font-bold opacity-90 drop-shadow-sm'>
               {firstLetter}
             </span>
          </div>
        )}
        
        {/* Nút tác vụ góc trên bên phải (Favorite & Delete) */}
        <div className={`absolute top-2 right-2 flex items-center gap-2 transition-opacity duration-200 ${isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <button
            className={`bg-white/90 hover:bg-white p-2 rounded-full shadow-sm transition-colors ${
              isFavorite ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
            }`}
            type='button'
            onClick={(e) => {
              e.stopPropagation()
              onFavoriteToggle?.(!isFavorite)
            }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {/* Sử dụng class fill-current để tô màu bên trong ngôi sao nếu isFavorite = true */}
            <FiStar size={16} className={isFavorite ? 'fill-current' : ''} />
          </button>

          <button
            className='text-gray-500 hover:text-red-600 disabled:opacity-50 bg-white/90 hover:bg-white p-2 rounded-full shadow-sm transition-colors'
            type='button'
            disabled={isDeleting}
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.()
            }}
            title='Delete course'
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className='p-4 flex-1 flex flex-col min-w-0'>
        <h3 className='text-xl font-bold text-blue-900 line-clamp-1 mb-2'>{title}</h3>
        <p className='text-sm text-gray-800 line-clamp-3 leading-relaxed mb-4'>
          {description}
        </p>

        <div 
          className='mt-auto flex items-center justify-start gap-2 pt-2 overflow-x-auto pb-1'
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className='relative shrink-0' ref={statusRef}>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsStatusOpen((v) => !v)
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 border rounded-full text-sm transition-colors whitespace-nowrap ${
                isStatusOpen ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-400 text-gray-800 hover:bg-gray-50'
              }`}
            >
              <FiFileText size={14} className="shrink-0" />
              <span>{status}</span>
              <FiChevronDown size={14} className={`shrink-0 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
            </button>

            {isStatusOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 flex flex-col">
                {COURSE_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onStatusChange?.(s)
                      setIsStatusOpen(false)
                    }}
                    className={`text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      status === s ? 'font-semibold text-blue-700 bg-blue-50/50' : 'text-gray-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className='w-[1px] h-6 bg-gray-300 shrink-0'></div>

          {isAddingTag ? (
            <input
              ref={tagInputRef}
              type="text"
              value={newTagValue}
              onChange={(e) => setNewTagValue(e.target.value)}
              onBlur={handleTagSubmit}
              onKeyDown={handleTagKeyDown}
              onClick={(e) => e.stopPropagation()} 
              maxLength={50} 
              placeholder="Tag..."
              className="w-24 shrink-0 px-2 py-1.5 text-sm border border-blue-500 rounded-full outline-none focus:ring-2 focus:ring-blue-100 bg-white transition-all shadow-sm"
            />
          ) : (
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsAddingTag(true)
              }}
              className='flex items-center gap-1 px-2.5 py-1.5 border border-dashed border-gray-400 rounded-full text-sm text-gray-800 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0'
            >
              <FiTag size={14} className="shrink-0" />
              <span>{tags.length > 0 ? '+' : 'Add tag'}</span>
            </button>
          )}

          {tags.map((tag, index) => (
            <span 
              key={index} 
              className='flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-700 whitespace-nowrap shrink-0'
            >
              <FiTag size={12} className="shrink-0 text-gray-500" />
              <span>{tag}</span>
            </span>
          ))}
          
        </div>
      </div>
    </div>
  )
}

export default CourseCard