import { useDroppable, useDraggable } from '@dnd-kit/core'
import { useCourseStore } from '../store/useCourseStore'
import type { Page } from '../types/course'
import { BlockView } from './BlockView'
import { EditableText } from './EditableText'
import { QuizBuilder } from './QuizBuilder'
import { buildLayoutStyle, buildThemeStyle } from './theme'

export function PageView({ page, sectionId, pageIndex }: { page: Page; sectionId: string; pageIndex: number }) {
  const selectElement = useCourseStore((s) => s.selectElement)
  const selected = useCourseStore((s) => s.selectedElement)
  const updatePage = useCourseStore((s) => s.updatePage)
  const toggleElementSelection = useCourseStore((s) => s.toggleElementSelection)
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `page-drop-${page.id}`,
    data: { type: 'page-drop', pageId: page.id, sectionId }
  })

  const {
    setNodeRef: setDragRef,
    listeners,
    attributes,
    transform,
    isDragging
  } = useDraggable({
    id: `page-${page.id}`,
    data: { type: 'page', pageId: String(pageIndex), sectionId }
  })

  const setRefs = (el: HTMLDivElement | null) => {
    setDropRef(el)
    setDragRef(el)
  }

  return (
    <div
      ref={setRefs}
      {...listeners}
      {...attributes}
      onClick={(event) => {
        event.stopPropagation()
        selectElement({ kind: 'page', id: page.id })
        if (event.shiftKey) toggleElementSelection(page.id)
      }}
      className={`border border-transparent bg-white p-6 transition ${selected?.id === page.id ? 'ring-2 ring-blue-500' : 'hover:border-gray-200'} ${isOver ? 'ring-2 ring-blue-400' : ''}`}
      style={{
        ...buildThemeStyle(page.themeOverride),
        ...buildLayoutStyle(page.layoutMode, page.layoutMeta),
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.5 : 1,
        minHeight: page.layoutMeta?.height ? `${page.layoutMeta.height}px` : undefined
      }}
    >
      <div className='mb-4 flex items-center justify-between gap-3'>
        <EditableText
          value={page.title}
          onSave={(newValue) => updatePage(sectionId, page.id, { title: newValue })}
          className='text-sm font-semibold text-gray-800'
          inputClassName='text-sm font-semibold text-gray-800'
          placeholder='Page title'
        />
        <span className='rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600'>{page.pageType}</span>
      </div>

      {page.pageType === 'CONTENT' ? (
        <div className='space-y-4'>
          {page.contentPage?.blocks.map((block, idx) => (
            <BlockView key={block.id} block={block} pageId={page.id} blockIndex={idx} />
          ))}
          {page.contentPage && page.contentPage.blocks.length === 0 ? (
            <p className='rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-400'>
              Drag content block here
            </p>
          ) : null}
        </div>
      ) : (
        <QuizBuilder page={page} sectionId={sectionId} />
      )}
    </div>
  )
}
