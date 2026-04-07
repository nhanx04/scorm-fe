// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React, { useState } from 'react'
import { useParams } from 'react-router'
import MainLayout from '@/layouts/main-layout'
import { useMembers, useOrganizations, useOrgLogoUrlMap, useUpdateOrganization } from './hook/useOrganizations'
import InviteDialog from './components/InviteDialog'
import MemberList from './components/MemberList'
import OrganizationThumbnailPickerDialog from './components/OrganizationThumbnailPickerDialog'

const OrgDetailContent: React.FC = () => {
  const { orgId } = useParams<'orgId'>()
  const { data: orgs = [] } = useOrganizations()
  const logoUrlMap = useOrgLogoUrlMap()
  const org = orgs.find((o) => o.orgId === Number(orgId))
  const { data: members = [] } = useMembers(org?.orgId)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [thumbnailPickerOpen, setThumbnailPickerOpen] = useState(false)
  const updateOrganization = useUpdateOrganization(org?.orgId ?? 0)

  if (!org) return <p className='p-8'>Organization not found</p>

  const thumbnail =
    (org.logoMediaId ? logoUrlMap.get(org.logoMediaId) : undefined) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(org.orgName)}&background=1E3A8A&color=fff&size=240`

  return (
    <div className='px-20 bg-gray-100 min-h-screen'>
      <div className='bg-white h-full shadow-lg px-6 py-4 flex gap-6'>
        {/* main */}
        <div className='flex-1'>
          <div className='mb-6 rounded-xl border border-gray-200 bg-gray-100 h-50 p-4'>
            <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
              <div className='flex items-start gap-4'>
                <div className='relative'>
                  <img
                    src={thumbnail}
                    alt={org.orgName}
                    className='h-42 w-42 rounded-xl border border-gray-200 object-cover'
                  />
                  <button
                    type='button'
                    onClick={() => setThumbnailPickerOpen(true)}
                    className='absolute -bottom-2 -right-2 rounded-full bg-white border border-gray-200 p-1 text-xs shadow'
                  >
                    Edit
                  </button>
                </div>
                <div>
                  <h2 className='text-xl font-semibold text-blue-900'>{org.orgName}</h2>
                  {org.description ? (
                    <p className='text-sm text-gray-600 mt-1'>{org.description}</p>
                  ) : (
                    <p className='text-sm text-gray-400 mt-1'>No description yet.</p>
                  )}
                  <p className='mt-2 text-xs text-gray-500'>
                    Owner ID: {org.ownerId} • Max authors: {org.maxAuthors ?? 'N/A'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInviteOpen(true)}
                className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium'
                type='button'
              >
                Invite
              </button>
            </div>
          </div>

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
      {org && (
        <OrganizationThumbnailPickerDialog
          open={thumbnailPickerOpen}
          selectedMediaId={org.logoMediaId ?? undefined}
          onClose={() => setThumbnailPickerOpen(false)}
          onSelect={(mediaId) => {
            updateOrganization.mutate({ logoMediaId: mediaId })
            setThumbnailPickerOpen(false)
          }}
        />
      )}
    </div>
  )
}

const OrganizationDetailPage: React.FC = () => (
  <MainLayout>
    <OrgDetailContent />
  </MainLayout>
)

export default OrganizationDetailPage
