// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { useCreateLibrary } from '../hooks/useLibrary'

interface CreateLibraryDialogProps {
  open: boolean
  onClose: () => void
}

const CreateLibraryDialog: React.FC<CreateLibraryDialogProps> = ({ open, onClose }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { mutate, isLoading } = useCreateLibrary()

  const handleSubmit = () => {
    if (!name.trim()) return
    mutate(
      { libraryName: name.trim(), description: description.trim() },
      {
        onSuccess: () => {
          setName('')
          setDescription('')
          onClose()
        }
      }
    )
  }

  if (!open) return null

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative'>
        <button className='absolute top-3 right-3 text-gray-500' onClick={onClose} type='button'>
          <FiX />
        </button>
        <h3 className='text-lg font-semibold text-blue-900 mb-4'>Create new library</h3>
        <div className='space-y-4'>
          <input
            type='text'
            className='w-full border border-gray-300 px-3 py-2 rounded'
            placeholder='Library name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className='w-full border border-gray-300 px-3 py-2 rounded'
            placeholder='Description (optional)'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className='w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50'
            type='button'
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateLibraryDialog

