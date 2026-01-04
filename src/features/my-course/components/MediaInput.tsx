import React, { useState } from 'react'
import { FiImage, FiLink, FiUpload, FiX } from 'react-icons/fi'
import { mediaApi } from '../../../services/api'
import AssetPickerDialog from './AssetPickerDialog'

type Props = {
  type: 'image' | 'video'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  label?: string
}

const MediaInput: React.FC<Props> = ({
  type,
  value,
  onChange,
  placeholder = '',
  className = '',
  label = type === 'image' ? 'Hình ảnh' : 'Video'
}) => {
  const [showOptions, setShowOptions] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    setError('')
    try {
      const res = await mediaApi.uploadFile(file)
      onChange(res.data.url)
      setShowOptions(false)
    } catch (e: any) {
      setError(e?.response?.data || e?.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleSelectFromLibrary = (url: string) => {
    onChange(url)
    setShowOptions(false)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          {type === 'image' ? <FiImage className='w-4 h-4' /> : <FiLink className='w-4 h-4' />}
          <span>{label}</span>
        </div>
      )}

      <div className='space-y-2'>
        <div className='flex gap-2'>
          <input
            type='url'
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={
              placeholder || (type === 'image' ? 'https://example.com/image.jpg' : 'https://youtube.com/...')
            }
            className='flex-1 rounded-sm border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3.5'
          />
          <button
            type='button'
            onClick={() => setIsPickerOpen(true)}
            className='inline-flex items-center gap-1.5 px-3 py-2 border border-blue-500 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-sm transition-colors'
          >
            <FiImage className='w-4 h-4' />
            <span>Chọn từ thư viện</span>
          </button>
          <label className='inline-flex items-center gap-1.5 px-3 py-2 border border-green-600 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-sm cursor-pointer transition-colors'>
            <FiUpload className='w-4 h-4' />
            <span>Tải lên từ máy</span>
            <input
              type='file'
              accept={type === 'image' ? 'image/*' : 'video/*'}
              onChange={handleFileChange}
              className='hidden'
            />
          </label>
        </div>

        {value && (
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() => onChange('')}
              className='inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors'
            >
              <FiX className='w-3.5 h-3.5' />
              <span>Xóa {type === 'image' ? 'ảnh' : 'video'}</span>
            </button>
          </div>
        )}

        {isUploading && <div className='text-xs text-blue-600'>Đang tải lên...</div>}
        {error && <div className='text-xs text-red-600'>{error}</div>}

        {/* Preview */}
        {value && (
          <div className='pt-2'>
            {type === 'image' ? (
              <div className='w-full max-w-xs border border-gray-200 rounded-sm overflow-hidden'>
                <img
                  src={value}
                  alt='Preview'
                  className='w-full h-auto max-h-48 object-contain bg-gray-50 p-2'
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
            ) : (
              <div className='w-full max-w-xs aspect-video bg-gray-100 rounded-sm overflow-hidden'>
                <iframe
                  src={value}
                  title='Video preview'
                  className='w-full h-full'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Asset Picker Dialog */}
      {isPickerOpen && (
        <AssetPickerDialog
          type={type}
          onClose={() => setIsPickerOpen(false)}
          onSelect={handleSelectFromLibrary}
          title={`Chọn ${type === 'image' ? 'ảnh' : 'video'} từ thư viện`}
        />
      )}
    </div>
  )
}

export default MediaInput
