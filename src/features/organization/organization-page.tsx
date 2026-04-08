// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React, { useMemo, useState } from 'react'
import { FiPlus, FiSearch, FiSmile } from 'react-icons/fi'
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
  const navigate = useNavigate()

  const filteredOrganizations = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return data

    return data.filter((org) => {
      const name = org.orgName?.toLowerCase() || ''
      const description = org.description?.toLowerCase() || ''
      return name.includes(keyword) || description.includes(keyword)
    })
  }, [data, searchTerm])

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
    <div className='min-h-screen bg-gray-100 px-20'>
      <div className='h-full bg-white px-6 py-5 shadow-lg'>
        <div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
          <h1 className='text-2xl font-semibold tracking-tight text-gray-900'>Organizations</h1>
        </div>

        <div className='mb-6 flex items-center gap-4'>
          <div className='relative flex-1'>
            <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-blue-800' />
            <input
              type='text'
              placeholder='Type here to search...'
              className='w-full pl-10 pr-4 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 transition-colors'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            className='inline-flex items-center gap-2 rounded-xl cursor-pointer bg-blue-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110'
            type='button'
          >
            <FiPlus className='h-4 w-4' />
            New Organization
          </button>
        </div>

        {isLoading ? (
          <PageLoading loading={isLoading} text='Loading organizations...' minHeightClassName='min-h-[60vh]' />
        ) : filteredOrganizations.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center'>
            <div className='mb-3 rounded-full bg-indigo-100 p-3 text-indigo-600'>
              <FiSmile className='h-6 w-6' />
            </div>
            <h3 className='text-lg font-semibold text-gray-800'>No organizations yet</h3>
            <p className='mt-1 text-sm text-gray-500'>Create your first organization to get started.</p>
            <button
              onClick={() => setDialogOpen(true)}
              type='button'
              className='mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:brightness-110'
            >
              <FiPlus className='h-4 w-4' />
              New Organization
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
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
        onConfirm={() => {
          void handleDeleteOrganization()
        }}
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
