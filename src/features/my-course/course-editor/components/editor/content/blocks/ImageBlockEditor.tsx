import React, { useRef } from 'react'
import type { ImageBlock } from '../../../../types/editor.types'

type ImageBlockEditorProps = {
  block: ImageBlock
  onChange: (data: Partial<ImageBlock>) => void
}

const ImageBlockEditor: React.FC<ImageBlockEditorProps> = ({ block, onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    onChange({ imageUrl: objectUrl })
  }

  return (
    <div className='space-y-3'>
      <div className='flex flex-wrap gap-2'>
        <button
          type='button'
          onClick={() => inputRef.current?.click()}
          className='rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100'
        >
          Upload image
        </button>
        <button
          type='button'
          onClick={() => {
            const demo = window.prompt('Paste image URL')
            if (demo) onChange({ imageUrl: demo })
          }}
          className='rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100'
        >
          Select from library
        </button>
      </div>

      <input ref={inputRef} type='file' accept='image/*' onChange={handleUpload} className='hidden' />

      {block.imageUrl ? (
        <img src={block.imageUrl} alt='Block' className='max-h-72 w-full rounded-xl object-contain bg-gray-50' />
      ) : (
        <div className='rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500'>
          No image selected
        </div>
      )}

      <input
        value={block.caption ?? ''}
        onChange={(e) => onChange({ caption: e.target.value })}
        placeholder='Caption'
        className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
      />
    </div>
  )
}

export default ImageBlockEditor

