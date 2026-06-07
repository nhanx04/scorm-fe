import React from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import type { Page, Section } from '../../types/editor.types'
import PageItem from './PageItem'

type SectionItemProps = {
  section: Section
  pages: Page[]
  activePageId: string | null
  canMoveUp: boolean
  canMoveDown: boolean
  onSelectPage: (pageId: string) => void
  onSectionTitleChange: (value: string) => void
  onAddPage: () => void
  onAddQuizPage: () => void
  onDeletePage?: (pageId: string) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onReorderPage: (activeId: string, overId: string) => void
}

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  pages,
  activePageId,
  canMoveUp,
  canMoveDown,
  onSelectPage,
  onSectionTitleChange,
  onAddPage,
  onAddQuizPage,
  onDeletePage,
  onMoveUp,
  onMoveDown,
  onReorderPage
}) => {
  return (
    <div className='rounded-xl bg-white border border-gray-200 p-3 space-y-2'>
      <div className='flex items-center gap-1'>
        <input
          value={section.title}
          onChange={(e) => onSectionTitleChange(e.target.value)}
          className='flex-1 min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200'
        />
        <div className='flex shrink-0 flex-col'>
          <button
            type='button'
            onClick={onMoveUp}
            disabled={!canMoveUp}
            title='Move section up'
            aria-label='Move section up'
            className='rounded p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30'
          >
            <FiChevronUp className='h-4 w-4' />
          </button>
          <button
            type='button'
            onClick={onMoveDown}
            disabled={!canMoveDown}
            title='Move section down'
            aria-label='Move section down'
            className='rounded p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30'
          >
            <FiChevronDown className='h-4 w-4' />
          </button>
        </div>
      </div>

      <div className='space-y-1'>
        {pages.map((page, index) => (
          <PageItem
            key={page.id}
            title={page.title}
            isActive={activePageId === page.id}
            onClick={() => onSelectPage(page.id)}
            pageType={page.type === 'quiz' ? 'QUIZ' : 'CONTENT'}
            onDelete={onDeletePage ? () => onDeletePage(page.id) : undefined}
            canMoveUp={index > 0}
            canMoveDown={index < pages.length - 1}
            onMoveUp={() => {
              const prev = pages[index - 1]
              if (prev) onReorderPage(page.id, prev.id)
            }}
            onMoveDown={() => {
              const next = pages[index + 1]
              if (next) onReorderPage(page.id, next.id)
            }}
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
