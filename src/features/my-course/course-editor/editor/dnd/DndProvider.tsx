import React from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useCourseStore } from '../store/useCourseStore'

interface DragMeta {
  type:
    | 'sidebar-section'
    | 'sidebar-content-page'
    | 'sidebar-quiz-page'
    | 'sidebar-content-block'
    | 'sidebar-question'
    | 'section'
    | 'page'
    | 'block'
    | 'question'
  sectionId?: string
  pageId?: string
  questionType?: 'MCQ_SINGLE' | 'MCQ_MULTI' | 'TRUE_FALSE'
}

export function CourseDndProvider({ children }: { children: React.ReactNode }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const addSection = useCourseStore((s) => s.addSection)
  const addPage = useCourseStore((s) => s.addPage)
  const addBlock = useCourseStore((s) => s.addBlock)
  const addQuestion = useCourseStore((s) => s.addQuestion)
  const reorder = useCourseStore((s) => s.reorder)
  const moveBlockToPage = useCourseStore((s) => s.moveBlockToPage)
  const [activeLabel, setActiveLabel] = React.useState<string | null>(null)

  const onDragStart = (event: DragStartEvent) => {
    const meta = event.active.data.current as DragMeta | undefined
    setActiveLabel(String(meta?.type || event.active.id))
  }

  const onDragEnd = (event: DragEndEvent) => {
    setActiveLabel(null)
    const { active, over } = event
    if (!over) return

    const activeMeta = active.data.current as DragMeta | undefined
    const overMeta = over.data.current as DragMeta | undefined

    if (!activeMeta || !overMeta) return

    if (activeMeta.type === 'sidebar-section' && over.id === 'canvas-root') {
      addSection()
      return
    }

    if (activeMeta.type === 'sidebar-content-page' && overMeta.sectionId) {
      addPage(overMeta.sectionId, 'CONTENT')
      return
    }

    if (activeMeta.type === 'sidebar-quiz-page' && overMeta.sectionId) {
      addPage(overMeta.sectionId, 'QUIZ')
      return
    }

    if (activeMeta.type === 'sidebar-content-block' && overMeta.pageId) {
      addBlock(overMeta.pageId)
      return
    }

    if (activeMeta.type === 'sidebar-question' && overMeta.pageId && activeMeta.questionType) {
      addQuestion(overMeta.pageId, activeMeta.questionType)
      return
    }

    if (activeMeta.type === 'page' && overMeta.type === 'page' && activeMeta.sectionId && overMeta.sectionId) {
      if (activeMeta.sectionId !== overMeta.sectionId) return
      reorder({
        type: 'pages',
        sectionId: activeMeta.sectionId,
        fromIndex: Number(activeMeta.pageId),
        toIndex: Number(overMeta.pageId)
      })
      return
    }

    if (activeMeta.type === 'block' && overMeta.type === 'block' && activeMeta.pageId && overMeta.pageId) {
      if (activeMeta.pageId === overMeta.pageId) {
        reorder({
          type: 'blocks',
          pageId: activeMeta.pageId,
          fromIndex: Number(activeMeta.sectionId),
          toIndex: Number(overMeta.sectionId)
        })
      } else {
        moveBlockToPage(active.id as string, activeMeta.pageId, overMeta.pageId, Number(overMeta.sectionId))
      }
      return
    }

    if (activeMeta.type === 'question' && overMeta.type === 'question' && activeMeta.pageId && overMeta.pageId) {
      if (activeMeta.pageId !== overMeta.pageId) return
      reorder({
        type: 'questions',
        pageId: activeMeta.pageId,
        fromIndex: Number(activeMeta.sectionId),
        toIndex: Number(overMeta.sectionId)
      })
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      {children}
      <DragOverlay>
        {activeLabel ? (
          <div className='rounded-md border bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow'>
            {activeLabel}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
