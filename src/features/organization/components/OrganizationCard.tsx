// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { FiMoreVertical } from 'react-icons/fi'
import type { Organization } from '../type'

dayjs.extend(relativeTime)

interface Props {
  org: Organization
  onClick: () => void
}

const OrganizationCard: React.FC<Props> = ({ org, onClick }) => {
  return (
    <div
      onClick={onClick}
      role='button'
      className='flex items-center justify-between bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer transition-colors'
    >
      <div>
        <h3 className='text-lg font-semibold text-blue-900'>{org.orgName}</h3>
        {org.updatedAt && <p className='text-sm text-gray-500'>Updated {dayjs(org.updatedAt).fromNow()}</p>}
      </div>
      <FiMoreVertical className='text-gray-400' />
    </div>
  )
}

export default OrganizationCard
