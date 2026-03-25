import React, { useMemo, useState } from 'react'
import { useCourseEditorStore } from '../../store/use-course-editor-store'
import SectionItem from './SectionItem'
import { resolveTheme } from '../../utils/resolveTheme'
import { FiTrash2 } from 'react-icons/fi'

const Sidebar: React.FC = () => {
  const sectionOrder = useCourseEditorStore((state) => state.sectionOrder)
  const sections = useCourseEditorStore((state) => state.sections)
  const pages = useCourseEditorStore((state) => state.pages)
  const pageOrder = useCourseEditorStore((state) => state.pageOrder)
  const activePageId = useCourseEditorStore((state) => state.activePageId)
  const addSection = useCourseEditorStore((state) => state.addSection)
  const addPage = useCourseEditorStore((state) => state.addPage)
  const updateSection = useCourseEditorStore((state) => state.updateSection)
  const removeSection = useCourseEditorStore((state) => state.removeSection)
  const setActivePage = useCourseEditorStore((state) => state.setActivePage)
  const theme = useCourseEditorStore((state) => state.theme)

  const [sectionToRemove, setSectionToRemove] = useState<string | null>(null)

  const sidebarTheme = resolveTheme(theme.global)

  const activeSectionId = useMemo(() => {
    if (!activePageId) return sectionOrder[0] ?? null
    return (
      sectionOrder.find((sectionId) => (pageOrder[sectionId] ?? []).includes(activePageId)) ?? sectionOrder[0] ?? null
    )
  }, [activePageId, pageOrder, sectionOrder])

  const activeSectionTitle = activeSectionId ? (sections[activeSectionId]?.title ?? 'section này') : 'section này'

  return (
    <div
      className='h-full flex flex-col gap-3 overflow-y-auto p-4'
      style={{ background: sidebarTheme.background, color: sidebarTheme.color }}
    >
      <div className='flex items-center justify-between gap-2'>
        <h2 className='text-sm font-semibold'>Course Outline</h2>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={addSection}
            className='rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer hover:opacity-80'
            style={{ background: '#f3f4f6' }}
          >
            + Add Section
          </button>
          <button
            type='button'
            disabled={!activeSectionId || sectionOrder.length === 0}
            onClick={() => activeSectionId && setSectionToRemove(activeSectionId)}
            className='flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50'
            title='Remove active section'
            aria-label='Remove active section'
          >
            <FiTrash2 className='h-4 w-4' />
          </button>
        </div>
      </div>

      <div className='flex-1 space-y-3 pr-1'>
        {sectionOrder.map((sectionId) => {
          const section = sections[sectionId]
          if (!section) return null

          const sectionPages = (pageOrder[sectionId] ?? []).map((pageId) => pages[pageId]).filter(Boolean)

          return (
            <SectionItem
              key={section.id}
              section={section}
              pages={sectionPages}
              activePageId={activePageId}
              onSelectPage={setActivePage}
              onSectionTitleChange={(value) => updateSection(section.id, { title: value })}
              onAddPage={() => addPage(section.id, 'content')}
              onAddQuizPage={() => addPage(section.id, 'quiz')}
            />
          )
        })}
      </div>

      {sectionToRemove && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl'>
            <h3 className='text-base font-semibold text-gray-900'>Xác nhận xóa</h3>
            <p className='mt-2 text-sm text-gray-600'>
              Bạn sắp xóa một trang. Hành động này sẽ xóa toàn bộ nội dung trong trang.
            </p>
            <div className='mt-5 flex justify-end gap-2'>
              <button
                type='button'
                onClick={() => setSectionToRemove(null)}
                className='rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              >
                Hủy
              </button>
              <button
                type='button'
                onClick={() => {
                  removeSection(sectionToRemove)
                  setSectionToRemove(null)
                }}
                className='rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700'
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
