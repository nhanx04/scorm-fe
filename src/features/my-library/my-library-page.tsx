// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React, { useMemo, useState } from 'react'
import MainLayout from '@/layouts/main-layout'
import { OverlayLoading, PageLoading } from '@/components'
import {
  useBulkDeleteLibraries,
  useBulkDeleteMedia,
  useDeleteLibrary,
  useDeleteMedia,
  useLibraries,
  useLibraryItems
} from './hooks/useLibrary'
import FolderList from './components/FolderList'
import ItemList from './components/ItemList'
import UploadDialog from './components/UploadDialog'
import CreateLibraryDialog from './components/CreateLibraryDialog'
import ConfirmDialog from './components/ConfirmDialog'
import ImagePreviewDialog from './components/ImagePreviewDialog'
import Toast, { type ToastType } from './components/Toast'
import type { Library } from './types/library'

type ConfirmAction =
  | { kind: 'delete-library'; libraryId: number }
  | { kind: 'bulk-delete-libraries'; libraryIds: number[] }
  | { kind: 'delete-media'; mediaId: number }
  | { kind: 'bulk-delete-media'; payload: { libraryId: number; mediaIds: number[] } }

const MyLibraryContent: React.FC = () => {
  const [selected, setSelected] = useState<Library | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTitle, setConfirmTitle] = useState('Confirm')
  const [confirmMessage, setConfirmMessage] = useState('')
  const [pendingAction, setPendingAction] = useState<ConfirmAction | null>(null)
  const [toast, setToast] = useState<{ open: boolean; type: ToastType; message: string }>({
    open: false,
    type: 'success',
    message: ''
  })
  const [imagePreview, setImagePreview] = useState<{ open: boolean; imageUrl?: string; imageName?: string }>({
    open: false,
    imageUrl: undefined,
    imageName: undefined
  })

  const { data: libraries = [], isLoading: loadingLibs, refetch: refetchLibraries } = useLibraries()
  const { data: items = [], isLoading: loadingItems, refetch: refetchItems } = useLibraryItems(selected?.libraryId)
  const deleteLibraryMutation = useDeleteLibrary()
  const bulkDeleteLibrariesMutation = useBulkDeleteLibraries()
  const deleteMediaMutation = useDeleteMedia()
  const bulkDeleteMediaMutation = useBulkDeleteMedia()

  const deleting =
    deleteLibraryMutation.isPending ||
    bulkDeleteLibrariesMutation.isPending ||
    deleteMediaMutation.isPending ||
    bulkDeleteMediaMutation.isPending

  const confirmLoading = useMemo(() => {
    if (!pendingAction) return false
    if (pendingAction.kind === 'delete-library') return deleteLibraryMutation.isPending
    if (pendingAction.kind === 'bulk-delete-libraries') return bulkDeleteLibrariesMutation.isPending
    if (pendingAction.kind === 'delete-media') return deleteMediaMutation.isPending
    return bulkDeleteMediaMutation.isPending
  }, [
    pendingAction,
    deleteLibraryMutation.isPending,
    bulkDeleteLibrariesMutation.isPending,
    deleteMediaMutation.isPending,
    bulkDeleteMediaMutation.isPending
  ])

  const showToast = (type: ToastType, message: string) => {
    setToast({ open: true, type, message })
  }

  const openConfirm = (title: string, message: string, action: ConfirmAction) => {
    setConfirmTitle(title)
    setConfirmMessage(message)
    setPendingAction(action)
    setConfirmOpen(true)
  }

  const handleConfirm = () => {
    if (!pendingAction) return

    if (pendingAction.kind === 'delete-library') {
      deleteLibraryMutation.mutate(pendingAction.libraryId, {
        onSuccess: () => showToast('success', 'Delete folder successfully'),
        onError: () => showToast('error', 'Delete folder failed'),
        onSettled: () => setConfirmOpen(false)
      })
      return
    }

    if (pendingAction.kind === 'bulk-delete-libraries') {
      bulkDeleteLibrariesMutation.mutate(pendingAction.libraryIds, {
        onSuccess: () => showToast('success', 'Delete selected folders successfully'),
        onError: () => showToast('error', 'Delete selected folders failed'),
        onSettled: () => setConfirmOpen(false)
      })
      return
    }

    if (pendingAction.kind === 'delete-media') {
      deleteMediaMutation.mutate(pendingAction.mediaId, {
        onSuccess: () => showToast('success', 'Delete image successfully'),
        onError: () => showToast('error', 'Delete image failed'),
        onSettled: () => setConfirmOpen(false)
      })
      return
    }

    bulkDeleteMediaMutation.mutate(pendingAction.payload, {
      onSuccess: () => showToast('success', 'Delete selected images successfully'),
      onError: () => showToast('error', 'Delete selected images failed'),
      onSettled: () => setConfirmOpen(false)
    })
  }

  return (
    <div className='flex h-full flex-1 overflow-hidden bg-white'>
      <div className='flex-1 overflow-y-auto bg-white px-16 py-10'>
        <h1 className='mb-6 text-[32px] font-bold text-gray-900'>My library</h1>

        {loadingLibs ? (
          <PageLoading loading={loadingLibs} text='Loading libraries...' minHeightClassName='min-h-[60vh]' />
        ) : selected ? (
          <div className='relative'>
            <ItemList
              library={selected}
              items={items}
              onBack={() => setSelected(null)}
              onOpenUpload={() => setUploadOpen(true)}
              onRefresh={() => {
                void refetchItems()
              }}
              deleting={deleting}
              onDeleteMedia={(mediaId, mediaTitle) => {
                openConfirm('Delete image', `Are you sure you want to delete image "${mediaTitle}"?`, {
                  kind: 'delete-media',
                  mediaId
                })
              }}
              onBulkDeleteMedia={(payload) => {
                openConfirm('Delete selected images', `Delete ${payload.mediaIds.length} selected image(s)?`, {
                  kind: 'bulk-delete-media',
                  payload
                })
              }}
              onPreviewImage={({ imageUrl, imageName }) => {
                setImagePreview({ open: true, imageUrl, imageName })
              }}
            />
            <OverlayLoading loading={loadingItems} text='Loading items...' />
          </div>
        ) : (
          <FolderList
            data={libraries}
            onSelect={setSelected}
            onOpenCreate={() => setCreateOpen(true)}
            onRefresh={() => {
              void refetchLibraries()
            }}
            deleting={deleting}
            onDeleteLibrary={(libraryId, libraryName) => {
              openConfirm('Delete folder', `Are you sure you want to delete folder "${libraryName}"?`, {
                kind: 'delete-library',
                libraryId
              })
            }}
            onBulkDeleteLibraries={(libraryIds) => {
              openConfirm('Delete selected folders', `Delete ${libraryIds.length} selected folder(s)?`, {
                kind: 'bulk-delete-libraries',
                libraryIds
              })
            }}
          />
        )}
      </div>

      {selected && (
        <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} libraryId={selected.libraryId} />
      )}
      <CreateLibraryDialog open={createOpen} onClose={() => setCreateOpen(false)} />

      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmLabel='Delete'
        danger
        loading={confirmLoading}
        onCancel={() => {
          if (!confirmLoading) {
            setConfirmOpen(false)
            setPendingAction(null)
          }
        }}
        onConfirm={handleConfirm}
      />

      <ImagePreviewDialog
        open={imagePreview.open}
        imageUrl={imagePreview.imageUrl}
        imageName={imagePreview.imageName}
        onClose={() => setImagePreview({ open: false, imageUrl: undefined, imageName: undefined })}
      />

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </div>
  )
}

const MyLibraryPage: React.FC = () => (
  <MainLayout>
    <MyLibraryContent />
  </MainLayout>
)

export default MyLibraryPage
