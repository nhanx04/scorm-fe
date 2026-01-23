// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { useInviteMember } from '../hook/useOrganizations'

interface Props {
  open: boolean
  onClose: () => void
  orgId: number
}

const InviteDialog: React.FC<Props> = ({ open, onClose, orgId }) => {
  const [email, setEmail] = useState('')
  const { mutate, isLoading } = useInviteMember(orgId)

  const submit = () => {
    if (!email.trim()) return
    mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setEmail('')
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
        <h3 className='text-lg font-semibold text-blue-900 mb-4'>Invite member</h3>
        <input
          type='email'
          placeholder='Email address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full border border-gray-300 px-3 py-2 rounded mb-4'
        />
        <button
          disabled={isLoading}
          onClick={submit}
          className='w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50'
          type='button'
        >
          Send Invite
        </button>
      </div>
    </div>
  )
}

export default InviteDialog

