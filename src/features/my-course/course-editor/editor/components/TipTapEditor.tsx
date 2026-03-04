import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'

interface TipTapEditorProps {
  value: string
  onChange: (html: string) => void
}

export function TipTapEditor({ value, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, Color],
    content: value,
    editorProps: {
      attributes: {
        class:
          'min-h-[220px] rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 focus:outline-none'
      }
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML())
    },
    immediatelyRender: false
  })

  React.useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value !== current) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [editor, value])

  if (!editor) return null

  return (
    <div className='space-y-3'>
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
    </div>
  )
}
