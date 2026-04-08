// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React, { useMemo, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { useCreateOrganization, useOrgLogoImages } from '../hook/useOrganizations'
import OrganizationThumbnailPickerDialog from './OrganizationThumbnailPickerDialog'

interface Props {
  open: boolean
  onClose: () => void
}

const CreateOrgDialog: React.FC<Props> = ({ open, onClose }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [maxAuthors, setMaxAuthors] = useState<number>(5)
  const [logoMediaId, setLogoMediaId] = useState<string>('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const { data: logoImages = [] } = useOrgLogoImages()
  const { mutate, isPending } = useCreateOrganization()

  const selectedThumbnail = useMemo(() => {
    const id = Number(logoMediaId)
    if (!id) return undefined
    return logoImages.find((img) => img.mediaId === id)
  }, [logoImages, logoMediaId])

  const resetForm = () => {
    setName('')
    setDescription('')
    setMaxAuthors(5)
    setLogoMediaId('')
  }

  const submit = () => {
    if (!name.trim()) return

    const parsedLogoMediaId = logoMediaId.trim() ? Number(logoMediaId) : undefined

    mutate(
      {
        orgName: name.trim(),
        description: description.trim() || undefined,
        maxAuthors: Number.isFinite(maxAuthors) ? Math.max(1, maxAuthors) : 5,
        logoMediaId:
          parsedLogoMediaId !== undefined && Number.isFinite(parsedLogoMediaId) && parsedLogoMediaId > 0
            ? parsedLogoMediaId
            : undefined
      },
      {
        onSuccess: () => {
          resetForm()
          onClose()
        }
      }
    )
  }

  if (!open) return null
  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg w-full max-w-sm p-6 relative'>
        <button className='absolute top-3 right-3 text-gray-500' onClick={onClose} type='button'>
          <FiX />
        </button>
        <h3 className='text-lg font-semibold text-blue-900 mb-4'>Create organization</h3>
        <div className='space-y-3'>
          <input
            type='text'
            placeholder='Organization name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full border border-gray-300 px-3 py-2 rounded'
          />

          <textarea
            placeholder='Description (optional)'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full border border-gray-300 px-3 py-2 rounded min-h-[84px]'
          />

          <div className='grid grid-cols-2 gap-3'>
            <input
              type='number'
              min={1}
              value={maxAuthors}
              onChange={(e) => setMaxAuthors(Math.max(1, Number(e.target.value || 1)))}
              className='w-full border border-gray-300 px-3 py-2 rounded'
              placeholder='Max authors'
            />
            <input
              type='number'
              min={1}
              value={logoMediaId}
              onChange={(e) => setLogoMediaId(e.target.value)}
              className='w-full border border-gray-300 px-3 py-2 rounded'
              placeholder='Thumbnail mediaId'
            />
          </div>

          <div className='rounded-md border border-gray-200 p-3'>
            <p className='mb-2 text-xs text-gray-600'>Thumbnail</p>
            <button
              type='button'
              onClick={() => setPickerOpen(true)}
              className='w-full border border-dashed border-blue-300 rounded-md px-3 py-2 text-sm text-blue-700 hover:bg-blue-50'
            >
              Choose from Library / Upload from device
            </button>
            {selectedThumbnail?.metadata?.publicUrl ? (
              <div className='mt-3 flex items-center gap-3'>
                <img
                  src={selectedThumbnail.metadata.publicUrl}
                  alt={selectedThumbnail.title || `Image ${selectedThumbnail.mediaId}`}
                  className='h-12 w-12 rounded border border-gray-200 object-cover'
                />
                <span className='text-xs text-gray-600'>Selected mediaId: {selectedThumbnail.mediaId}</span>
              </div>
            ) : (
              <p className='mt-3 text-xs text-gray-400'>No thumbnail selected</p>
            )}
          </div>

          <button
            disabled={isPending}
            onClick={submit}
            className='w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50'
            type='button'
          >
            {isPending ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>

      <OrganizationThumbnailPickerDialog
        open={pickerOpen}
        selectedMediaId={logoMediaId ? Number(logoMediaId) : undefined}
        onClose={() => setPickerOpen(false)}
        onSelect={(mediaId) => {
          setLogoMediaId(String(mediaId))
          setPickerOpen(false)
        }}
      />
    </div>
  )
}

export default CreateOrgDialog
