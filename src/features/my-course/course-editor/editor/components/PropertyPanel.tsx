import React from 'react'
import { Color } from '@tiptap/extension-color'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCourseStore } from '../store/useCourseStore'

export function PropertyPanel() {
  const selectedElement = useCourseStore((s) => s.selectedElement)
  const selectedBlockId = useCourseStore((s) => s.selectedBlockId)
  const setSelectedBlockId = useCourseStore((s) => s.setSelectedBlockId)
  const selectElement = useCourseStore((s) => s.selectElement)
  const course = useCourseStore((s) => s.course)
  const updateElement = useCourseStore((s) => s.updateElement)
  const exportCourse = useCourseStore((s) => s.exportCourse)
  const undo = useCourseStore((s) => s.undo)
  const redo = useCourseStore((s) => s.redo)
  const deleteElement = useCourseStore((s) => s.deleteElement)

  const selectedSection = React.useMemo(() => {
    if (selectedElement?.kind !== 'section') return null
    return course.sections.find((section) => section.id === selectedElement.id) ?? null
  }, [course.sections, selectedElement])

  const selectedPage = React.useMemo(() => {
    if (selectedElement?.kind !== 'page') return null
    for (const section of course.sections) {
      const page = section.pages.find((item) => item.id === selectedElement.id)
      if (page) return page
    }
    return null
  }, [course.sections, selectedElement])

  const selectedBlockInfo = React.useMemo(() => {
    if (!selectedBlockId) return null
    for (const section of course.sections) {
      for (const page of section.pages) {
        const block = page.contentPage?.blocks.find((item) => item.id === selectedBlockId)
        if (block) return { block, pageId: page.id }
      }
    }
    return null
  }, [course.sections, selectedBlockId])

  const firstBlockInfo = React.useMemo(() => {
    for (const section of course.sections) {
      for (const page of section.pages) {
        const block = page.contentPage?.blocks[0]
        if (block) return { block, pageId: page.id }
      }
    }
    return null
  }, [course.sections])

  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, Color],
    content: '',
    editorProps: {
      attributes: {
        class:
          'min-h-[240px] rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 focus:outline-none'
      }
    },
    immediatelyRender: false
  })

  const hasAutoSelectedRef = React.useRef(false)

  React.useEffect(() => {
    if (hasAutoSelectedRef.current) return
    if (!selectedBlockId && firstBlockInfo) {
      setSelectedBlockId(firstBlockInfo.block.id)
      selectElement({ kind: 'block', id: firstBlockInfo.block.id, pageId: firstBlockInfo.pageId })
      hasAutoSelectedRef.current = true
    }
  }, [firstBlockInfo, selectElement, selectedBlockId, setSelectedBlockId])

  React.useEffect(() => {
    if (editor && selectedBlockInfo) {
      editor.commands.setContent(selectedBlockInfo.block.textHtml || '', { emitUpdate: false })
    }
  }, [editor, selectedBlockInfo])

  React.useEffect(() => {
    if (!editor) return
    const onUpdate = () => {
      if (selectedBlockInfo) {
        updateElement(selectedBlockInfo.block.id, { textHtml: editor.getHTML() })
      }
    }
    editor.on('update', onUpdate)
    return () => {
      editor.off('update', onUpdate)
    }
  }, [editor, selectedBlockInfo, updateElement])

  const onExport = () => {
    // eslint-disable-next-line no-console
    console.log('exportCourse()', exportCourse())
    alert('Course JSON exported to console')
  }

  return (
    <aside className='sticky top-0 h-screen w-[360px] overflow-y-auto border-l border-gray-100 bg-white p-5'>
      <h3 className='text-sm font-semibold text-gray-800'>Properties</h3>

      {selectedSection ? (
        <div className='mt-5 space-y-3 rounded-2xl bg-gray-50 p-4'>
          <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Section settings</p>
          <input
            className='w-full rounded-xl border border-gray-200 px-3 py-2 text-sm'
            value={selectedSection.title}
            onChange={(e) => updateElement(selectedSection.id, { title: e.target.value })}
            placeholder='Section title'
          />
          <textarea
            className='w-full rounded-xl border border-gray-200 px-3 py-2 text-sm'
            value={selectedSection.description}
            onChange={(e) => updateElement(selectedSection.id, { description: e.target.value })}
            placeholder='Section description'
          />
        </div>
      ) : null}

      {selectedPage ? (
        <div className='mt-5 space-y-3 rounded-2xl bg-gray-50 p-4'>
          <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Page settings</p>
          <input
            className='w-full rounded-xl border border-gray-200 px-3 py-2 text-sm'
            value={selectedPage.title}
            onChange={(e) => updateElement(selectedPage.id, { title: e.target.value })}
            placeholder='Page title'
          />
        </div>
      ) : null}

      <div className='mt-5 space-y-3 rounded-2xl bg-gray-50 p-4'>
        <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Block editor</p>
        {!selectedBlockInfo || !editor ? (
          <p className='text-sm text-gray-400'>Select a block to edit</p>
        ) : (
          <>
            <div className='flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-white p-2'>
              <button
                type='button'
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`rounded-lg px-2 py-1 text-xs ${editor.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                Bold
              </button>
              <button
                type='button'
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`rounded-lg px-2 py-1 text-xs ${editor.isActive('italic') ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                Italic
              </button>
              <button
                type='button'
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`rounded-lg px-2 py-1 text-xs ${editor.isActive('underline') ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                Underline
              </button>
              <button
                type='button'
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className='rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100'
              >
                H2
              </button>
              <button
                type='button'
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className='rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100'
              >
                List
              </button>
              <input
                type='color'
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                className='h-7 w-9 rounded-lg border border-gray-200'
                title='Text color'
              />
            </div>
            <EditorContent editor={editor} />
          </>
        )}
      </div>

      <div className='mt-6 grid grid-cols-2 gap-2'>
        <button onClick={undo} className='rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700'>
          Undo
        </button>
        <button onClick={redo} className='rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700'>
          Redo
        </button>
      </div>
      <div className='mt-2 grid grid-cols-1 gap-2'>
        {selectedElement?.id && selectedElement.id !== 'course-root' ? (
          <button
            onClick={() => deleteElement(selectedElement.id)}
            className='rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700'
          >
            Delete Element
          </button>
        ) : null}
        <button className='rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700'>
          Save as Template
        </button>
        <button
          onClick={onExport}
          className='rounded-xl bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800'
        >
          Export Package
        </button>
      </div>
    </aside>
  )
}
