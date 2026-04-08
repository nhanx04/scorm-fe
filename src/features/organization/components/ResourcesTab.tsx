import React, { useEffect, useMemo, useState } from 'react'
import ResourceCard from './ResourceCard'
import ShareResourceModal from './ShareResourceModal'
import { useOrganizationResources, useRemoveResource, useShareResource } from '../hook/useResource'
import type { OrganizationResource, OrganizationResourceType, ShareResourcePayload } from '../type'

interface ResourcesTabProps {
  orgId: number
  canManage?: boolean
  onToast?: (message: string, type?: 'success' | 'error') => void
}

const ResourcesTab: React.FC<ResourcesTabProps> = ({ orgId, canManage = false, onToast }) => {
  const [searchInput, setSearchInput] = useState('')
  const [searchText, setSearchText] = useState('')
  const [filter, setFilter] = useState<OrganizationResourceType | 'ALL'>('ALL')
  const [shareOpen, setShareOpen] = useState(false)

  const type = filter === 'ALL' ? undefined : filter
  const { data: resources = [], isLoading } = useOrganizationResources(orgId, type)
  const shareMutation = useShareResource(orgId)
  const removeMutation = useRemoveResource(orgId)

  useEffect(() => {
    const timer = setTimeout(() => setSearchText(searchInput.trim().toLowerCase()), 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const filteredResources = useMemo(() => {
    if (!searchText) return resources
    return resources.filter((r) => r.name.toLowerCase().includes(searchText))
  }, [resources, searchText])

  const handleShare = (payload: ShareResourcePayload) => {
    shareMutation.mutate(payload, {
      onSuccess: () => {
        onToast?.('Resource shared successfully', 'success')
        setShareOpen(false)
      },
      onError: () => onToast?.('Failed to share resource', 'error')
    })
  }

  const handleRemove = (resource: OrganizationResource) => {
    if (!canManage) return
    removeMutation.mutate(resource.id, {
      onSuccess: () => onToast?.('Resource removed', 'success'),
      onError: () => onToast?.('Failed to remove resource', 'error')
    })
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center'>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder='Search resources...'
          className='w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2 md:max-w-sm'
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as OrganizationResourceType | 'ALL')}
          className='rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2'
        >
          <option value='ALL'>All types</option>
          <option value='MEDIA'>Media</option>
          <option value='COURSE'>Course</option>
          <option value='FOLDER'>Folder</option>
        </select>

        <button
          type='button'
          onClick={() => setShareOpen(true)}
          className='rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 md:ml-auto'
        >
          Share Resource
        </button>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='h-60 animate-pulse rounded-2xl border border-gray-200 bg-white' />
          ))}
        </div>
      ) : !filteredResources.length ? (
        <div className='rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500'>
          No resources yet
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              canRemove={canManage}
              onOpen={() => onToast?.(`Open ${resource.name}`, 'success')}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      <ShareResourceModal open={shareOpen} onClose={() => setShareOpen(false)} onConfirm={handleShare} isPending={shareMutation.isPending} />
    </div>
  )
}

export default ResourcesTab

