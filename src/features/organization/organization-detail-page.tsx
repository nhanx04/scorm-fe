// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import MainLayout from '@/layouts/main-layout'
import { OverlayLoading, PageLoading, SectionLoading } from '@/components'
import { useMembers, useOrganizations, useOrgLogoUrlMap, useUpdateOrganization } from './hook/useOrganizations'
import InviteDialog from './components/InviteDialog'
import MemberList from './components/MemberList'
import OrganizationThumbnailPickerDialog from './components/OrganizationThumbnailPickerDialog'

const OrgDetailContent: React.FC = () => {
  const { orgId } = useParams<'orgId'>()
  const navigate = useNavigate()
  const { data: orgs = [], isLoading: loadingOrgs } = useOrganizations()
  const logoUrlMap = useOrgLogoUrlMap()
  const org = orgs.find((o) => o.orgId === Number(orgId))
  const { data: members = [], isLoading: loadingMembers } = useMembers(org?.orgId)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [thumbnailPickerOpen, setThumbnailPickerOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const updateOrganization = useUpdateOrganization(org?.orgId ?? 0)

  if (loadingOrgs) {
    return <PageLoading loading={loadingOrgs} text='Loading organization...' minHeightClassName='min-h-[60vh]' />
  }

  if (!org) return <p className='p-8'>Organization not found</p>

  const thumbnail =
    (org.logoMediaId ? logoUrlMap.get(org.logoMediaId) : undefined) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(org.orgName)}&background=1E3A8A&color=fff&size=240`

  return (
    <div className='px-20 bg-gray-100 min-h-screen'>
      <div className='bg-white h-full shadow-lg px-6 py-4 flex gap-6'>
        {/* main */}
        <div className='flex-1'>
          <button
            type='button'
            onClick={() => navigate('/organization')}
            className='mb-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50'
          >
            Back
          </button>
          <div
            className={`mb-6 rounded-xl border border-gray-200 bg-gray-100 p-4 pb-12 relative transition-all duration-300 ease-in-out ${expanded ? 'max-h-none overflow-visible' : 'max-h-48 overflow-hidden'}`}
          >
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
                <div className='min-w-0 break-words'>
                  <h2 className='text-xl font-semibold text-blue-900 break-words'>{org.orgName}</h2>
                  {org.description ? (
                    <p className='text-sm text-gray-600 mt-1 break-words max-w-xl'>{org.description}</p>
                  ) : (
                    <p className='text-sm text-gray-400 mt-1 break-words'>No description yet.</p>
                  )}
                  <p className='mt-2 text-xs text-gray-500 break-words'>
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

            {!expanded ? (
              <div className='pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-100 to-transparent' />
            ) : null}

            <button
              type='button'
              onClick={() => setExpanded((prev) => !prev)}
              className='absolute bottom-3 right-4 bg-gray-100 px-1 text-sm font-medium text-blue-700 hover:text-blue-800'
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          </div>

          <div className='border border-dashed border-gray-300 rounded-lg p-8 text-gray-400 text-sm text-center'>
            Activities will appear here
          </div>
        </div>

        {/* sidebar */}
        <div className='w-64 relative'>
          {loadingMembers ? (
            <SectionLoading loading={loadingMembers} text='Loading members...' />
          ) : (
            <MemberList members={members} />
          )}
          <OverlayLoading loading={updateOrganization.isPending} text='Updating...' />
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
