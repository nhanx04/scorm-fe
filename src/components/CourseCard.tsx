import React from 'react'
import { FiTrash2 } from 'react-icons/fi'

export interface CourseCardProps {
  title: string
  description: string
  image: string
  onClick?: () => void
  onDelete?: () => void
  isDeleting?: boolean
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  image,
  onClick,
  onDelete,
  isDeleting = false
}) => (
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
    // Sửa w-68 h-83 thành w-full h-full flex flex-col và thêm pb-10
    className='relative text-left bg-white border p-2 pb-10 border-blue-800 rounded-sm shadow-sm shadow-blue-300 hover:shadow-md transition-shadow w-full h-full flex flex-col overflow-hidden cursor-pointer'
  >
    {/* Thêm shrink-0 để ảnh giữ nguyên tỷ lệ */}
    <img src={image} alt={title} className='w-full h-40 object-cover shrink-0' />
    
    {/* Thêm flex-1 để phần nội dung chiếm không gian còn lại */}
    <div className='p-2 space-y-2 flex-1'>
      <h3 className='font-semibold text-blue-800 line-clamp-1'>{title}</h3>
      <p className='text-sm text-gray-600 bg-gray-100 p-2 line-clamp-2 min-h-[40px]'>{description}</p>
    </div>
    
    <button
      // Thêm background trắng và padding để nút xóa nổi bật và dễ click hơn
      className='absolute bottom-2 right-2 text-red-500 cursor-pointer hover:text-red-700 disabled:opacity-50 bg-white p-1 rounded-full'
      type='button'
      disabled={isDeleting}
      onClick={(e) => {
        e.stopPropagation()
        onDelete?.()
      }}
      title='Delete course'
    >
      <FiTrash2 size={18} />
    </button>
  </div>
)

export default CourseCard