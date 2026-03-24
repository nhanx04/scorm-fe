import React from 'react'
import { useCourseEditorStore } from '../../store/use-course-editor-store'
import SectionItem from './SectionItem'
import { resolveTheme } from '../../utils/resolveTheme'

const Sidebar: React.FC = () => {
  const sectionOrder = useCourseEditorStore((state) => state.sectionOrder)
  const sections = useCourseEditorStore((state) => state.sections)
  const pages = useCourseEditorStore((state) => state.pages)
  const pageOrder = useCourseEditorStore((state) => state.pageOrder)
  const activePageId = useCourseEditorStore((state) => state.activePageId)
  const addSection = useCourseEditorStore((state) => state.addSection)
  const addPage = useCourseEditorStore((state) => state.addPage)
  const updateSection = useCourseEditorStore((state) => state.updateSection)
  const setActivePage = useCourseEditorStore((state) => state.setActivePage)
  const theme = useCourseEditorStore((state) => state.theme)

  const sidebarTheme = resolveTheme(theme.global)

  return (
    <div
      className='h-full flex flex-col gap-3 overflow-y-auto p-3'
      style={{ background: sidebarTheme.background, color: sidebarTheme.color }}
    >
      <div className='flex items-center justify-between'>
        <h2 className='text-sm font-semibold'>Course Outline</h2>
        <button
          type='button'
          onClick={addSection}
          className='rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer hover:opacity-80'
          style={{ background: '#f3f4f6' }}
        >
          + Add Section
        </button>
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
    </div>
  )
}

export default Sidebar
