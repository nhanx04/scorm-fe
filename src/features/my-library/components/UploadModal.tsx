import React, { useRef, useState } from 'react'
import { FiX, FiUploadCloud } from 'react-icons/fi'
import { mediaApi } from '../../../services/api'

type Props = {
  onClose: () => void
  onUploaded?: (image: any) => void
}

const UploadModal: React.FC<Props> = ({ onClose, onUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith('image/'))

    if (files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...files])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((file) => file.type.startsWith('image/'))

    if (files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...files])
    }
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return

    setIsUploading(true)
    setError('')
    try {
      // Upload lần lượt để tránh overload + dễ xử lý lỗi
      for (const file of uploadedFiles) {
        const res = await mediaApi.uploadFile(file)
        onUploaded?.(res.data)
      }
      onClose()
    } catch (e: any) {
      setError(e?.response?.data || e?.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-lg font-semibold text-gray-900'>Upload Images</h2>
          <button onClick={onClose} className='p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors'>
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {uploadedFiles.length === 0 ? (
            <>
              {/* Drop zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
              >
                <FiUploadCloud className='mx-auto mb-4 text-gray-400' size={48} />
                <p className='text-gray-900 font-medium mb-1'>Drag and drop your images here</p>
                <p className='text-gray-500 text-sm mb-4'>or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className='bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition-colors'
                >
                  Select Images
                </button>
                <p className='text-gray-500 text-xs mt-4'>Supported formats: JPG, PNG, GIF, WebP (Max 10MB per file)</p>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type='file'
                multiple
                accept='image/*'
                onChange={handleFileSelect}
                className='hidden'
              />
            </>
          ) : (
            <>
              {/* Uploaded files list */}
              <div className='mb-6'>
                <h3 className='text-sm font-medium text-gray-900 mb-3'>{uploadedFiles.length} file(s) selected</h3>
                <div className='space-y-2'>
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200'
                    >
                      <div className='flex items-center gap-3 flex-1 min-w-0'>
                        <div className='w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0'>
                          <svg className='w-6 h-6 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                            />
                          </svg>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium text-gray-900 truncate'>{file.name}</p>
                          <p className='text-xs text-gray-500'>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className='ml-2 p-1 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded transition-colors flex-shrink-0'
                      >
                        <FiX size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add more button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className='w-full border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-colors mb-6'
              >
                Add More Images
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type='file'
                multiple
                accept='image/*'
                onChange={handleFileSelect}
                className='hidden'
              />
            </>
          )}
        </div>

        {/* Footer */}
        {/* Error message */}
        {error && <div className='mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600'>{error}</div>}
        <div className='flex items-center justify-end gap-3 p-6 border-t border-gray-200'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-700 font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploadedFiles.length === 0 || isUploading}
            className='px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-medium rounded-md transition-colors'
          >
            {isUploading ? 'Uploading...' : `Upload${uploadedFiles.length > 0 ? ` (${uploadedFiles.length})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadModal
