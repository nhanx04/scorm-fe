import React, { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { FiUpload, FiX } from 'react-icons/fi'
import { api } from '@/services/api'
import { useLibraries } from '@/features/my-library/hooks/useLibrary'
import { useOrgLogoImages } from '../hook/useOrganizations'

interface Props {
  open: boolean
  selectedMediaId?: number
  onClose: () => void
  onSelect: (mediaId: number) => void
}

const OrganizationThumbnailPickerDialog: React.FC<Props> = ({ open, selectedMediaId, onClose, onSelect }) => {
  const qc = useQueryClient()
  const { data: images = [], isLoading } = useOrgLogoImages()
  const { data: libraries = [] } = useLibraries()
  const [selectedLibraryId, setSelectedLibraryId] = useState<number | undefined>(undefined)
  const [isUploading, setIsUploading] = useState(false)

  const availableLibraryId = useMemo(() => {
    if (selectedLibraryId) return selectedLibraryId
    return libraries[0]?.libraryId
  }, [libraries, selectedLibraryId])

  const uploadFromLocal = async (file?: File) => {
    if (!file) return
    if (!availableLibraryId) {
      window.alert('Please create at least one Library before uploading image.')
      return
    }

    const form = new FormData()
    form.append('file', file)
    form.append('libraryId', String(availableLibraryId))
    form.append('title', file.name)

    try {
      setIsUploading(true)
      const res = await api.post<{ mediaId: number }>('/media/images/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const newMediaId = res.data?.mediaId
      await qc.invalidateQueries({ queryKey: ['org-logo-images'] })
      if (newMediaId) onSelect(newMediaId)
    } catch (error) {
      console.error('Upload thumbnail failed', error)
      window.alert('Upload thumbnail failed.')
    } finally {
      setIsUploading(false)
    }
  }

  if (!open) return null

  return (
    <div className='fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4'>
      <div className='bg-white rounded-xl w-full max-w-3xl p-5 relative'>
        <button type='button' className='absolute right-3 top-3 text-gray-500' onClick={onClose}>
          <FiX />
        </button>

        <h3 className='text-lg font-semibold text-blue-900 mb-4'>Choose organization thumbnail</h3>

        <div className='mb-4 flex flex-wrap items-center gap-3'>
          <select
            value={availableLibraryId ?? ''}
            onChange={(e) => setSelectedLibraryId(Number(e.target.value))}
            className='border border-gray-300 rounded px-3 py-2 text-sm'
          >
            {libraries.map((lib) => (
              <option key={lib.libraryId} value={lib.libraryId}>
                {lib.libraryName}
              </option>
            ))}
          </select>

          <label className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded cursor-pointer text-sm'>
            <FiUpload /> Upload from device
            <input
              type='file'
              accept='image/*'
              className='hidden'
              disabled={isUploading}
              onChange={(e) => {
                void uploadFromLocal(e.target.files?.[0])
                e.currentTarget.value = ''
              }}
            />
          </label>
        </div>

        {isLoading ? (
          <p className='text-sm text-gray-500'>Loading images...</p>
        ) : (
          <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[420px] overflow-auto'>
            {images.map((img) => {
              const url = img.metadata?.publicUrl
              if (!url) return null
              const isActive = selectedMediaId === img.mediaId
              return (
                <button
                  key={img.mediaId}
                  type='button'
                  onClick={() => onSelect(img.mediaId)}
                  className={`overflow-hidden rounded-md border ${isActive ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'}`}
                  title={img.title || `Image ${img.mediaId}`}
                >
                  <img src={url} alt={img.title || `Image ${img.mediaId}`} className='h-24 w-full object-cover' />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrganizationThumbnailPickerDialog

