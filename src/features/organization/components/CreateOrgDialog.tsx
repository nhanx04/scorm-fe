// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { useCreateOrganization } from '../hook/useOrganizations'

interface Props {
  open: boolean
  onClose: () => void
}

const CreateOrgDialog: React.FC<Props> = ({ open, onClose }) => {
  const [name, setName] = useState('')
  const { mutate, isLoading } = useCreateOrganization()

  const submit = () => {
    if (!name.trim()) return
    mutate(
      { orgName: name.trim() },
      {
        onSuccess: () => {
          setName('')
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
        <input
          type='text'
          placeholder='Organization name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full border border-gray-300 px-3 py-2 rounded mb-4'
        />
        <button
          disabled={isLoading}
          onClick={submit}
          className='w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50'
          type='button'
        >
          Create
        </button>
      </div>
    </div>
  )
}

export default CreateOrgDialog

