// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React from 'react'
import type { Member } from '../type'

interface Props {
  members: Member[]
}

const MemberList: React.FC<Props> = ({ members }) => {
  return (
    <div className='bg-gray-50 p-4 rounded-lg'>
      <h3 className='font-semibold mb-2'>Members</h3>
      <ul className='space-y-2'>
        {members.map((m) => (
          <li key={m.userId} className='rounded-md bg-white px-2 py-1.5'>
            <p className='text-sm font-medium text-gray-800 break-words'>
              {[m.fname, m.lname].filter(Boolean).join(' ') || 'Unknown member'}
            </p>
            <p className='text-xs text-gray-600 break-words'>{m.email}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MemberList
