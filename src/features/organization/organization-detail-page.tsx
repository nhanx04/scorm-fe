// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React, { useState } from 'react'
import { useParams } from 'react-router'
import MainLayout from '@/layouts/main-layout'
import { useMembers, useOrganizations } from './hook/useOrganizations'
import InviteDialog from './components/InviteDialog'
import MemberList from './components/MemberList'

const OrgDetailContent: React.FC = () => {
  const { orgId } = useParams<'orgId'>()
  const { data: orgs = [] } = useOrganizations()
  const org = orgs.find((o) => o.orgId === Number(orgId))
  const { data: members = [] } = useMembers(org?.orgId)
  const [inviteOpen, setInviteOpen] = useState(false)

  if (!org) return <p className='p-8'>Organization not found</p>
  return (
    <div className='px-20 bg-gray-100 min-h-screen'>
      <div className='bg-white h-full shadow-lg px-6 py-4 flex gap-6'>
        {/* main */}
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold text-blue-900'>{org.orgName}</h2>
            <button
              onClick={() => setInviteOpen(true)}
              className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium'
              type='button'
            >
              Invite
            </button>
          </div>
          {/* activities placeholder */}
          <div className='border border-dashed border-gray-300 rounded-lg p-8 text-gray-400 text-sm text-center'>
            Activities will appear here
          </div>
        </div>

        {/* sidebar */}
        <div className='w-64'>
          <MemberList members={members} />
        </div>
      </div>

      {org && <InviteDialog open={inviteOpen} onClose={() => setInviteOpen(false)} orgId={org.orgId} />}
    </div>
  )
}

const OrganizationDetailPage: React.FC = () => (
  <MainLayout>
    <OrgDetailContent />
  </MainLayout>
)

export default OrganizationDetailPage

