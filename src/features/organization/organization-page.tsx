import React, { useMemo, useState } from 'react'
import { FiClock, FiFolder, FiPlus, FiSearch, FiSmile, FiType } from 'react-icons/fi'
import { useNavigate } from 'react-router'
import MainLayout from '@/layouts/main-layout'
import { PageLoading } from '@/components'
import { useDeleteOrganization, useOrganizations, useOrgLogoUrlMap } from './hook/useOrganizations'
import OrganizationCard from './components/OrganizationCard'
import CreateOrgDialog from './components/CreateOrgDialog'
import ConfirmDialog from '@/features/my-library/components/ConfirmDialog'

const OrgListContent: React.FC = () => {
  const { data = [], isLoading } = useOrganizations()
  const logoUrlMap = useOrgLogoUrlMap()
  const deleteOrganization = useDeleteOrganization()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deletingOrgId, setDeletingOrgId] = useState<number | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteOrgId, setPendingDeleteOrgId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortMode, setSortMode] = useState<'TIME_DESC' | 'ALPHA_ASC'>('TIME_DESC')
  const navigate = useNavigate()

  const filteredOrganizations = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    const filtered = !keyword
      ? data
      : data.filter(
          (org) =>
            (org.orgName || '').toLowerCase().includes(keyword) ||
            (org.description || '').toLowerCase().includes(keyword)
        )

    return [...filtered].sort((a, b) => {
      if (sortMode === 'ALPHA_ASC') {
        return (a.orgName || '').localeCompare(b.orgName || '')
      }

      const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime()
      return bTime - aTime
    })
  }, [data, searchTerm, sortMode])

  const handleDeleteOrganization = async () => {
    if (!pendingDeleteOrgId) return
    try {
      setDeletingOrgId(pendingDeleteOrgId)
      await deleteOrganization.mutateAsync(pendingDeleteOrgId)
      setConfirmOpen(false)
      setPendingDeleteOrgId(null)
    } catch (error) {
      console.error('Failed to delete organization', error)
    } finally {
      setDeletingOrgId(null)
    }
  }

  return (
    <div className='flex h-full flex-1 overflow-hidden bg-white'>
      <div className='w-[310px] shrink-0 overflow-y-auto border-r border-gray-200 bg-[#F7F9FA] p-6'>
        <button
          onClick={() => setDialogOpen(true)}
          className='mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-800'
          type='button'
        >
          <FiPlus className='h-4 w-4' />
          New Organization
        </button>

        <div className='mt-8 space-y-3'>
          <p className='text-sm font-semibold text-gray-900'>Workspace</p>
          <button className='flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-700'>
            <FiFolder className='h-4 w-4' />
            My organizations
          </button>

          <div className='flex flex-wrap items-center gap-2'>
            <button
              type='button'
              onClick={() => setSortMode('TIME_DESC')}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                sortMode === 'TIME_DESC'
                  ? 'bg-blue-900 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiClock className='h-3.5 w-3.5' />
              Time
            </button>

            <button
              type='button'
              onClick={() => setSortMode('ALPHA_ASC')}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                sortMode === 'ALPHA_ASC'
                  ? 'bg-blue-900 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiType className='h-3.5 w-3.5' />
              A-Z
            </button>
          </div>

          <div className='max-h-[380px] space-y-1 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2'>
            {filteredOrganizations.length === 0 ? (
              <p className='px-2 py-3 text-xs text-gray-500'>No organizations</p>
            ) : (
              filteredOrganizations.map((org) => (
                <button
                  key={org.orgId}
                  type='button'
                  onClick={() => navigate(`/organizations/${org.orgId}`)}
                  className='w-full truncate rounded-md px-2 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100'
                  title={org.orgName}
                >
                  {org.orgName}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto bg-white px-16 py-10'>
        <h1 className='mb-6 text-[32px] font-bold text-gray-900'>Organizations</h1>

        <div className='mx-auto mb-8 flex max-w-[700px] flex-col gap-3'>
          <div className='relative'>
            <FiSearch className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500' />
            <input
              type='text'
              placeholder='Search organizations by name or description...'
              className='w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 text-base transition-colors focus:outline-none focus:ring-1 focus:ring-gray-800'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <PageLoading loading text='Loading organizations...' minHeightClassName='min-h-[60vh]' />
        ) : filteredOrganizations.length === 0 ? (
          <div className='flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center text-gray-500'>
            <FiSmile className='mb-3 h-10 w-10 text-gray-300' />
            <p>No organizations found.</p>
          </div>
        ) : (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredOrganizations.map((org) => (
              <OrganizationCard
                key={org.orgId}
                org={org}
                thumbnailUrl={org.logoMediaId ? logoUrlMap.get(org.logoMediaId) : undefined}
                onClick={() => navigate(`/organizations/${org.orgId}`)}
                onDelete={() => {
                  setPendingDeleteOrgId(org.orgId)
                  setConfirmOpen(true)
                }}
                isDeleting={deletingOrgId === org.orgId}
              />
            ))}
          </div>
        )}
      </div>

      <CreateOrgDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      <ConfirmDialog
        open={confirmOpen}
        title='Delete organization'
        message='Are you sure you want to delete this organization?'
        confirmLabel='Delete'
        cancelLabel='Cancel'
        danger
        loading={deleteOrganization.isPending}
        onConfirm={() => void handleDeleteOrganization()}
        onCancel={() => {
          if (deleteOrganization.isPending) return
          setConfirmOpen(false)
          setPendingDeleteOrgId(null)
        }}
      />
    </div>
  )
}

const OrganizationPage: React.FC = () => (
  <MainLayout>
    <OrgListContent />
  </MainLayout>
)

export default OrganizationPage
