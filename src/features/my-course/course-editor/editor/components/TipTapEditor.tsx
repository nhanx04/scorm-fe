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
          'min-h-[90px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none'
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
    <div className='space-y-2'>
      <div className='flex flex-wrap gap-1'>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded border px-2 py-1 text-xs ${editor.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
        >
          Bold
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded border px-2 py-1 text-xs ${editor.isActive('italic') ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
        >
          Italic
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded border px-2 py-1 text-xs ${editor.isActive('underline') ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
        >
          Underline
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className='rounded border bg-white px-2 py-1 text-xs text-gray-700'
        >
          H2
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className='rounded border bg-white px-2 py-1 text-xs text-gray-700'
        >
          List
        </button>
        <input
          type='color'
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className='h-7 w-9 rounded border'
          title='Text color'
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
