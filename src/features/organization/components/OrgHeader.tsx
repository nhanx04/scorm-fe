import React from 'react'
import type { Organization } from '../type'

interface OrgHeaderProps {
  organization: Organization
  memberCount: number
  logoUrl?: string
  onInvite: () => void
  onSettings?: () => void
  canManage?: boolean
}

const OrgHeader: React.FC<OrgHeaderProps> = ({ organization, memberCount, logoUrl, onInvite, onSettings, canManage = false }) => {
  const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(organization.orgName)}&background=1E3A8A&color=fff&size=240`

  return (
    <div className='mb-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
      <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
        <div className='flex items-start gap-4'>
          <img src={logoUrl || fallbackLogo} alt={organization.orgName} className='h-16 w-16 rounded-2xl border border-gray-200 object-cover' />
          <div>
            <h1 className='text-xl font-semibold text-gray-900'>{organization.orgName}</h1>
            <p className='mt-1 max-w-2xl text-sm text-gray-600'>
              {organization.description || 'No description provided yet.'}
            </p>
            <p className='mt-2 text-xs text-gray-500'>{memberCount} members</p>
          </div>
        </div>

        <div className='flex gap-2'>
          <button
            type='button'
            onClick={onInvite}
            className='rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700'
          >
            Invite member
          </button>
          {canManage && (
            <button
              type='button'
              onClick={onSettings}
              className='rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
            >
              Settings
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrgHeader

