import React, { useMemo, useRef, useState } from 'react'
import { useLibraries, useLibraryItems } from '@/features/my-library/hooks/useLibrary'
import type { MediaItem } from '@/features/my-library/types/library'
import type { ImageBlock } from '../../../../types/editor.types'

type ImageBlockEditorProps = {
  block: ImageBlock
  onChange: (data: Partial<ImageBlock>) => void
}

const getImageUrl = (item: MediaItem) => {
  const metadata = item.metadata as Record<string, unknown>
  const fromPublic = typeof metadata.publicUrl === 'string' ? metadata.publicUrl : ''
  const fromFile = typeof metadata.fileUrl === 'string' ? metadata.fileUrl : ''
  const fromThumbnail = typeof metadata.thumbnailUrl === 'string' ? metadata.thumbnailUrl : ''
  return fromPublic || fromFile || fromThumbnail || ''
}

const ImageBlockEditor: React.FC<ImageBlockEditorProps> = ({ block, onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [openLibrary, setOpenLibrary] = useState(false)
  const [selectedLibraryId, setSelectedLibraryId] = useState<number | undefined>()
  const [urlInput, setUrlInput] = useState(block.imageUrl ?? '')

  const librariesQuery = useLibraries()
  const libraryItemsQuery = useLibraryItems(selectedLibraryId)

  const imageItems = useMemo(
    () => (libraryItemsQuery.data ?? []).filter((item) => item.mediaType === 'IMAGE' && Boolean(getImageUrl(item))),
    [libraryItemsQuery.data]
  )

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    onChange({ imageUrl: objectUrl, caption: block.caption })
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-2'>
        <button
          type='button'
          onClick={() => inputRef.current?.click()}
          className='rounded-full border bg-white px-3 py-1 text-sm hover:bg-gray-100'
        >
          Upload image
        </button>
        <button
          type='button'
          onClick={() => setOpenLibrary(true)}
          className='rounded-full border bg-white px-3 py-1 text-sm hover:bg-gray-100'
        >
          Select from library
        </button>
      </div>

      <div className='rounded-xl border border-gray-200 bg-white p-3'>
        <label className='mb-2 block text-xs font-medium text-gray-600'>Fetch image from URL</label>
        <div className='flex flex-col gap-2 sm:flex-row'>
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder='https://example.com/image.jpg'
            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'
          />
          <button
            type='button'
            onClick={() => {
              if (!urlInput.trim()) return
              onChange({ imageUrl: urlInput.trim() })
            }}
            className='rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100'
          >
            Use URL
          </button>
        </div>
      </div>

      <input ref={inputRef} type='file' accept='image/*' onChange={handleUpload} className='hidden' />

      <div className='overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white'>
        <div className='flex items-center justify-between border-b border-gray-100 px-4 py-2'>
          <p className='text-xs font-medium text-gray-600'>Image preview</p>
          {block.imageUrl && <p className='max-w-[220px] truncate text-[11px] text-gray-400'>{block.imageUrl}</p>}
        </div>
        {block.imageUrl ? (
          <div className='grid place-items-center p-4 sm:p-6'>
            <div className='grid h-[220px] w-full place-items-center overflow-hidden rounded-xl bg-white p-3 shadow-inner sm:h-[320px]'>
              <img src={block.imageUrl} alt='Block' className='h-full w-full object-contain' />
            </div>
          </div>
        ) : (
          <div className='grid h-[180px] place-items-center p-6 text-sm text-gray-500'>No image selected</div>
        )}
      </div>

      <input
        value={block.caption ?? ''}
        onChange={(e) => onChange({ caption: e.target.value })}
        placeholder='Caption'
        className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
      />

      {openLibrary && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='w-full max-w-4xl rounded-2xl bg-white p-4 shadow-xl'>
            <div className='mb-3 flex items-center justify-between'>
              <h4 className='text-sm font-semibold text-gray-800'>Select image from library</h4>
              <button type='button' onClick={() => setOpenLibrary(false)} className='rounded border px-2 py-1 text-xs'>
                Close
              </button>
            </div>

            <div className='mb-3'>
              <label className='mb-1 block text-xs text-gray-600'>Library</label>
              <select
                value={selectedLibraryId ?? ''}
                onChange={(e) => setSelectedLibraryId(e.target.value ? Number(e.target.value) : undefined)}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
              >
                <option value=''>Select a library</option>
                {(librariesQuery.data ?? []).map((library) => (
                  <option key={library.libraryId} value={library.libraryId}>
                    {library.libraryName}
                  </option>
                ))}
              </select>
            </div>

            <div className='max-h-[55vh] overflow-auto rounded-xl border border-gray-200 p-3'>
              {libraryItemsQuery.isLoading ? (
                <p className='text-sm text-gray-500'>Loading images...</p>
              ) : imageItems.length === 0 ? (
                <p className='text-sm text-gray-500'>No images found in this library.</p>
              ) : (
                <div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4'>
                  {imageItems.map((item) => {
                    const url = getImageUrl(item)
                    return (
                      <button
                        key={item.mediaId}
                        type='button'
                        onClick={() => {
                          onChange({ imageUrl: url })
                          setUrlInput(url)
                          setOpenLibrary(false)
                        }}
                        className='group overflow-hidden rounded-xl border border-gray-200 bg-white text-left hover:border-blue-300 hover:shadow-sm'
                      >
                        <div className='grid h-32 place-items-center bg-gray-50 p-2'>
                          <img src={url} alt={item.title} className='h-full w-full object-contain' />
                        </div>
                        <div className='border-t border-gray-100 px-2 py-2 text-xs text-gray-700 line-clamp-2'>
                          {item.title}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageBlockEditor
