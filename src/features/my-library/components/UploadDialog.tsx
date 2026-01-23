// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React, { useRef, useState } from 'react'
import { FiImage, FiFileText, FiMusic, FiVideo, FiX, FiUploadCloud, FiLink } from 'react-icons/fi'
import { useUploadMedia } from '../hooks/useUpload'
import type { UploadPayload } from '../hooks/useUpload'

interface UploadDialogProps {
  open: boolean
  onClose: () => void
  libraryId: number
}

const mediaOptions = [
  { type: 'IMAGE', label: 'Image', icon: <FiImage /> },
  { type: 'DOCUMENT', label: 'Document', icon: <FiFileText /> },
  { type: 'AUDIO', label: 'Audio', icon: <FiMusic /> },
  { type: 'VIDEO', label: 'Video', icon: <FiVideo /> }
] as const

const UploadDialog: React.FC<UploadDialogProps> = ({ open, onClose, libraryId }) => {
  const [step, setStep] = useState<'SELECT' | 'DETAIL'>('SELECT')
  const [payload, setPayload] = useState<UploadPayload | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const { mutate, isLoading } = useUploadMedia()

  const reset = () => {
    setStep('SELECT')
    setPayload(null)
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const type = documentTypeFromFile(file)
    if (!type) return
    setPayload({ type, file, title: file.name, libraryId })
    setStep('DETAIL')
  }

  const handleSubmit = () => {
    if (!payload) return
    if (payload.type === 'VIDEO') {
      if (!payload.youtubeUrl.trim()) {
        alert('Please enter YouTube embed URL')
        return
      }
      if (!payload.title.trim()) {
        alert('Please enter title')
        return
      }
    }

    mutate(payload, {
      onSuccess: () => {
        reset()
        onClose()
      }
    })
  }

  if (!open) return null

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative'>
        <button className='absolute top-3 right-3 text-gray-500' onClick={onClose} type='button'>
          <FiX />
        </button>

        {step === 'SELECT' && (
          <>
            <h3 className='text-lg font-semibold text-blue-900 mb-4'>Select media type</h3>
            <div className='grid grid-cols-2 gap-4'>
              {mediaOptions.map((opt) => (
                <button
                  key={opt.type}
                  className='border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:shadow'
                  onClick={() => {
                    if (opt.type === 'VIDEO') {
                      setPayload({
                        type: 'VIDEO',
                        title: '',
                        youtubeUrl: '',
                        libraryId
                      } as UploadPayload)
                      setStep('DETAIL')
                    } else {
                      // open file input
                      inputRef.current?.click()
                    }
                  }}
                  type='button'
                >
                  <div className='text-3xl mb-2'>{opt.icon}</div>
                  <p>{opt.label}</p>
                </button>
              ))}
            </div>
            {/* hidden file input */}
            <input
              ref={inputRef}
              type='file'
              className='hidden'
              accept='image/*,application/pdf,audio/*'
              onChange={handleFileChange}
            />
          </>
        )}

        {step === 'DETAIL' && payload && (
          <>
            <h3 className='text-lg font-semibold text-blue-900 mb-4'>Media detail</h3>
            <div className='space-y-4'>
              {/* preview */}
              {payload.type === 'IMAGE' && 'file' in payload ? (
                <img
                  src={URL.createObjectURL(payload.file)}
                  alt='preview'
                  className='w-40 h-40 object-cover mx-auto rounded'
                />
              ) : payload.type !== 'VIDEO' ? (
                <div className='text-6xl flex justify-center text-blue-700'>{getPreviewIcon(payload.type)}</div>
              ) : (
                <div className='flex items-center gap-2'>
                  <FiLink />
                  <input
                    type='text'
                    placeholder='YouTube embed URL'
                    className='flex-1 border border-gray-300 px-3 py-2 rounded'
                    value={payload.youtubeUrl}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        youtubeUrl: e.target.value
                      } as UploadPayload)
                    }
                  />
                </div>
              )}

              {/* title */}
              <input
                type='text'
                className='w-full border border-gray-300 px-3 py-2 rounded'
                value={payload.title ?? ''}
                onChange={(e) =>
                  setPayload({
                    ...payload,
                    title: e.target.value
                  } as UploadPayload)
                }
                placeholder='Name of media'
              />

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className='w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50'
                type='button'
              >
                <FiUploadCloud /> Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function documentTypeFromFile(file: File): UploadPayload['type'] | null {
  if (file.type.startsWith('image/')) return 'IMAGE'
  if (file.type.startsWith('audio/')) return 'AUDIO'
  // assume everything else as document (pdf, docx, etc.)
  return 'DOCUMENT'
}

function getPreviewIcon(type: UploadPayload['type']) {
  switch (type) {
    case 'IMAGE':
      return <FiImage />
    case 'AUDIO':
      return <FiMusic />
    case 'DOCUMENT':
      return <FiFileText />
    case 'VIDEO':
      return <FiVideo />
    default:
      return null
  }
}

export default UploadDialog
