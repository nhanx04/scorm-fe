import React from 'react'
import { FiChevronDown, FiChevronLeft } from 'react-icons/fi'
import { useNavigate } from 'react-router'

export function Canvas() {
  const navigate = useNavigate()
  return (
    <div className='flex-1 h-full bg-[#f9fafb] flex flex-col'>
      {/* Top Bar */}
      <div className='bg-white border-b px-8 py-4 flex items-center justify-between'>
        <div className='flex flex-col'>
          <div className='flex items-center gap-2'>
            <h1 className='text-xl font-bold text-gray-900'>Nguyên lý Ngôn ngữ Lập trình</h1>
            <FiChevronDown className='text-gray-500 cursor-pointer' />
          </div>
          <p className='text-sm text-gray-500 italic'>Kiểm tra Lexical Analysis</p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className='flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition'
        >
          <FiChevronLeft />
          Back
        </button>
      </div>

      {/* Main Editing Area */}
      <div className='flex-1 p-8 overflow-y-auto'>
        <div className='w-full max-w-5xl mx-auto h-[600px] bg-white border rounded-lg shadow-sm'>
          {/* Placeholder for page builder canvas */}
          <div className='w-full h-full flex items-center justify-center text-gray-300 italic'>
            Course Content Canvas Area
          </div>
        </div>
      </div>
    </div>
  )
}
