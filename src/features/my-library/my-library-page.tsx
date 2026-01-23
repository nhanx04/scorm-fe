// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import React, { useState } from 'react'
import MainLayout from '@/layouts/main-layout'
import { useLibraries, useLibraryItems } from './hooks/useLibrary'
import FolderList from './components/FolderList'
import ItemList from './components/ItemList'
import UploadDialog from './components/UploadDialog'
import CreateLibraryDialog from './components/CreateLibraryDialog'
import type { Library } from './types/library'

const MyLibraryContent: React.FC = () => {
  const [selected, setSelected] = useState<Library | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  const { data: libraries = [], isLoading: loadingLibs } = useLibraries()
  const { data: items = [], isLoading: loadingItems } = useLibraryItems(selected?.libraryId)

  return (
    <div className='px-20 bg-gray-100 min-h-screen'>
      <div className='bg-white h-full shadow-lg px-6 py-4'>
        {loadingLibs ? (
          <p>Loading...</p>
        ) : selected ? (
          <>
            {loadingItems ? (
              <p>Loading items...</p>
            ) : (
              <ItemList
                library={selected}
                items={items}
                onBack={() => setSelected(null)}
                onOpenUpload={() => setUploadOpen(true)}
              />
            )}
          </>
        ) : (
          <FolderList data={libraries} onSelect={setSelected} onOpenCreate={() => setCreateOpen(true)} />
        )}
      </div>

      {/* dialogs */}
      {selected && (
        <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} libraryId={selected.libraryId} />
      )}
      <CreateLibraryDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}

const MyLibraryPage: React.FC = () => (
  <MainLayout>
    <MyLibraryContent />
  </MainLayout>
)

export default MyLibraryPage

