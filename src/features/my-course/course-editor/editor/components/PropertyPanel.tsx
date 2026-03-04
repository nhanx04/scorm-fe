import React from 'react'
import { useCourseStore } from '../store/useCourseStore'
import type { Page } from '../types/course'

const fonts = ['Inter', 'Arial', 'Roboto', 'Times New Roman']

export function PropertyPanel() {
  const selectedElement = useCourseStore((s) => s.selectedElement)
  const course = useCourseStore((s) => s.course)
  const updateElement = useCourseStore((s) => s.updateElement)
  const exportCourse = useCourseStore((s) => s.exportCourse)
  const undo = useCourseStore((s) => s.undo)
  const redo = useCourseStore((s) => s.redo)
  const deleteElement = useCourseStore((s) => s.deleteElement)

  const selected = React.useMemo(() => {
    if (!selectedElement) return null
    if (selectedElement.kind === 'course') return course
    for (const section of course.sections) {
      if (selectedElement.id === section.id) return section
      for (const page of section.pages) {
        if (selectedElement.id === page.id) return page
        const block = page.contentPage?.blocks.find((b) => b.id === selectedElement.id)
        if (block) return block
        const question = page.quizPage?.questions.find((q) => q.id === selectedElement.id)
        if (question) return question
      }
    }
    return null
  }, [course, selectedElement])

  const [fontFamily, setFontFamily] = React.useState('Inter')
  const [fontSize, setFontSize] = React.useState(16)
  const [color, setColor] = React.useState('#1f2937')

  const onExport = () => {
    // eslint-disable-next-line no-console
    console.log('exportCourse()', exportCourse())
    alert('Course JSON exported to console')
  }

  return (
    <aside className='w-[320px] border-l bg-white p-4'>
      <h3 className='text-sm font-semibold text-gray-800'>Property Editor</h3>

      {!selected ? <p className='mt-3 text-sm text-gray-400'>Select an element from canvas...</p> : null}

      {selectedElement?.kind === 'block' ? (
        <div className='mt-4 space-y-3'>
          <label className='block text-xs text-gray-500'>Font Family</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className='w-full rounded border px-2 py-2 text-sm'
          >
            {fonts.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
          <label className='block text-xs text-gray-500'>Size</label>
          <input
            type='number'
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className='w-full rounded border px-2 py-2 text-sm'
          />
          <label className='block text-xs text-gray-500'>Color</label>
          <input
            type='color'
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className='h-10 w-full rounded border'
          />
        </div>
      ) : null}

      {selectedElement?.kind === 'page' ? (
        <div className='mt-4 space-y-3'>
          <label className='block text-xs text-gray-500'>Page title</label>
          <input
            className='w-full rounded border px-2 py-2 text-sm'
            value={(selected as Page).title}
            onChange={(e) => updateElement(selectedElement.id, { title: e.target.value })}
          />
        </div>
      ) : null}

      {selectedElement?.kind === 'question' ? (
        <div className='mt-4 text-sm text-gray-600'>Question config can be edited in Quiz Builder section.</div>
      ) : null}

      <div className='mt-6 grid grid-cols-2 gap-2'>
        <button onClick={undo} className='rounded bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700'>
          Undo
        </button>
        <button onClick={redo} className='rounded bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700'>
          Redo
        </button>
      </div>
      <div className='mt-2 grid grid-cols-1 gap-2'>
        {selectedElement?.id && selectedElement.id !== 'course-root' ? (
          <button
            onClick={() => deleteElement(selectedElement.id)}
            className='rounded bg-red-50 px-3 py-2 text-sm font-medium text-red-700'
          >
            Delete Element
          </button>
        ) : null}
        <button className='rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700'>
          Save as Template
        </button>
        <button
          onClick={onExport}
          className='rounded bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800'
        >
          Export Package
        </button>
      </div>
    </aside>
  )
}
