import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import MainLayout from '@/layouts/main-layout'
import { PageLoading } from '@/components'
import InviteDialog from './components/InviteDialog'
import OrgHeader from './components/OrgHeader'
import Tabs from './components/Tabs'
import ResourcesTab from './components/ResourcesTab'
import MembersTable from './components/MembersTable'
import ActivityTimeline from './components/ActivityTimeline'
import { useOrgLogoUrlMap } from './hook/useOrganizations'
import { useOrganizationActivities, useOrganizationDetail, useOrganizationMembers } from './hook/useOrganization'

const TAB_ITEMS = [
  { key: 'overview', label: 'Overview' },
  { key: 'members', label: 'Members' },
  { key: 'resources', label: 'Resources' },
  { key: 'activity', label: 'Activity' }
]

const OrgDetailContent: React.FC = () => {
  const { orgId } = useParams<'orgId'>()
  const navigate = useNavigate()
  const numericOrgId = Number(orgId)

  const [activeTab, setActiveTab] = useState('resources')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { data: org, isLoading: loadingOrg } = useOrganizationDetail(numericOrgId)
  const { data: members = [], isLoading: loadingMembers } = useOrganizationMembers(numericOrgId)
  const { data: activities = [], isLoading: loadingActivities } = useOrganizationActivities(numericOrgId)
  const logoUrlMap = useOrgLogoUrlMap()

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast(null), 2500)
  }

  const canManage = useMemo(() => members.some((m) => m.role === 'OWNER'), [members])

  if (loadingOrg) {
    return <PageLoading loading text='Loading organization...' minHeightClassName='min-h-[60vh]' />
  }

  if (!org) return <p className='p-8'>Organization not found</p>

  const logoUrl = org.logoMediaId ? logoUrlMap.get(org.logoMediaId) : undefined

  return (
    <div className='min-h-screen bg-gray-100 px-4 py-5 md:px-8 xl:px-14'>
      <div className='mx-auto max-w-7xl'>
        <button
          type='button'
          onClick={() => navigate('/organization')}
          className='mb-3 inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50'
        >
          Back
        </button>

        <OrgHeader
          organization={org}
          memberCount={members.length}
          logoUrl={logoUrl}
          onInvite={() => setInviteOpen(true)}
          onSettings={() => showToast('Settings coming soon')}
          canManage={canManage}
        />

        <Tabs items={TAB_ITEMS} activeKey={activeTab} onChange={setActiveTab} />

        <div className='min-h-[420px]'>
          {activeTab === 'overview' && (
            <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
              <h3 className='text-base font-semibold text-gray-900'>Overview</h3>
              <p className='mt-2 text-sm text-gray-600'>
                This organization workspace is dedicated to sharing media, courses, and folders in one place.
              </p>
            </div>
          )}

          {activeTab === 'members' &&
            (loadingMembers ? (
              <div className='space-y-2'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className='h-14 animate-pulse rounded-xl bg-white' />
                ))}
              </div>
            ) : (
              <MembersTable members={members} canManage={canManage} />
            ))}

          {activeTab === 'resources' && <ResourcesTab orgId={org.orgId} canManage={canManage} onToast={showToast} />}

          {activeTab === 'activity' &&
            (loadingActivities ? (
              <div className='space-y-2'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className='h-12 animate-pulse rounded-xl bg-white' />
                ))}
              </div>
            ) : (
              <ActivityTimeline activities={activities} />
            ))}
        </div>
      </div>

      <InviteDialog open={inviteOpen} onClose={() => setInviteOpen(false)} orgId={org.orgId} />

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 rounded-xl px-4 py-2 text-sm text-white shadow-lg ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
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
