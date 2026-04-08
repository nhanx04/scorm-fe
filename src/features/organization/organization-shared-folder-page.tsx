import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import FileCard from '../my-library/components/FileCard'
import ImagePreviewDialog from '../my-library/components/ImagePreviewDialog'
import { useOrganizationFolderAssets } from './hook/useResource'
import type { OrganizationFolderAssetItem } from './type'

function readPreviewUrl(item: OrganizationFolderAssetItem): string | undefined {
  const metadata = (item.metadata ?? {}) as Record<string, unknown>
  const publicUrl = metadata.publicUrl
  if (typeof publicUrl === 'string') return publicUrl

  const thumbnail = metadata.thumbnail
  if (typeof thumbnail === 'string') return thumbnail

  return undefined
}

const OrganizationSharedFolderPage: React.FC = () => {
  const navigate = useNavigate()
  const { orgId, folderId } = useParams()

  const orgIdNum = Number(orgId)
  const folderIdNum = Number(folderId)

  const { data, isLoading, isError } = useOrganizationFolderAssets(orgIdNum, folderIdNum)
  const [preview, setPreview] = useState<{ open: boolean; imageUrl?: string; imageName?: string }>({
    open: false,
    imageUrl: undefined,
    imageName: undefined
  })

  const imageItems = useMemo(() => {
    return (data?.items ?? []).filter((item) => String(item.mediaType ?? '').toUpperCase() === 'IMAGE')
  }, [data?.items])

  return (
    <div className='min-h-screen bg-[#f8fafc] p-4 md:p-6'>
      <div className='mx-auto max-w-7xl space-y-4'>
        <button
          type='button'
          onClick={() => navigate(`/organizations/${orgIdNum}`)}
          className='rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
        >
          ← Back to organization
        </button>

        <div className='rounded-2xl border border-gray-200 bg-white p-4 md:p-6'>
          <h1 className='text-xl font-semibold text-gray-900'>{data?.folderName || `Folder #${folderIdNum}`}</h1>
          <p className='mt-1 text-sm text-gray-500'>Shared folder assets in organization context</p>
        </div>

        {isLoading ? (
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='h-36 animate-pulse rounded-xl border border-gray-200 bg-white' />
            ))}
          </div>
        ) : isError ? (
          <div className='rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600'>
            Failed to load shared folder assets.
          </div>
        ) : !imageItems.length ? (
          <div className='rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500'>
            No image assets in this shared folder.
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {imageItems.map((item) => {
              const previewUrl = readPreviewUrl(item)
              const imageName = item.title || item.originalFileName || `Image #${item.mediaId}`

              return (
                <FileCard
                  key={item.mediaId}
                  name={imageName}
                  type='IMAGE'
                  updatedAt={item.updatedAt || item.uploadedAt}
                  previewUrl={previewUrl}
                  onClick={() => setPreview({ open: true, imageUrl: previewUrl, imageName })}
                />
              )
            })}
          </div>
        )}
      </div>

      <ImagePreviewDialog
        open={preview.open}
        imageUrl={preview.imageUrl}
        imageName={preview.imageName}
        onClose={() => setPreview({ open: false, imageUrl: undefined, imageName: undefined })}
      />
    </div>
  )
}

export default OrganizationSharedFolderPage
