import React from 'react'
import type { Page, Section } from '../../types/editor.types'
import PageItem from './PageItem'

type SectionItemProps = {
  section: Section
  pages: Page[]
  activePageId: string | null
  onSelectPage: (pageId: string) => void
  onSectionTitleChange: (value: string) => void
  onAddPage: () => void
  onAddQuizPage: () => void
}

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  pages,
  activePageId,
  onSelectPage,
  onSectionTitleChange,
  onAddPage,
  onAddQuizPage
}) => {
  return (
    <div className='rounded-xl bg-white border border-gray-200 p-3 space-y-2'>
      <input
        value={section.title}
        onChange={(e) => onSectionTitleChange(e.target.value)}
        className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200'
      />

      <div className='space-y-1'>
        {pages.map((page) => (
          <PageItem
            key={page.id}
            title={page.title}
            isActive={activePageId === page.id}
            onClick={() => onSelectPage(page.id)}
          />
        ))}
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <button
          type='button'
          onClick={onAddPage}
          className='w-full rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer'
        >
          + Content
        </button>
        <button
          type='button'
          onClick={onAddQuizPage}
          className='w-full rounded-lg px-3 py-2 text-sm text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer'
        >
          + Quiz
        </button>
      </div>
    </div>
  )
}

export default SectionItem
