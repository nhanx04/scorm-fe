import React from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { tiptapExtensions } from './tiptapExtensions'

interface TipTapEditorProps {
  value: string
  onChange: (html: string) => void
  editable?: boolean
  minHeightClassName?: string
  placeholder?: string
}

export function TipTapEditor({
  value,
  onChange,
  editable = true,
  minHeightClassName = 'min-h-[240px]',
  placeholder
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: tiptapExtensions(placeholder),
    content: value,
    editable,
    editorProps: {
      attributes: {
        class: `${minHeightClassName} rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 focus:outline-none`
      }
    },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
    immediatelyRender: false
  })

  React.useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [editor, value])

  if (!editor) return null

  const markClass =
    'rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 data-[active=true]:bg-blue-600 data-[active=true]:text-white'

  return (
    <div className='space-y-3'>
      {editable ? (
        <div className='flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-white p-2'>
          <button
            data-active={editor.isActive('bold')}
            className={markClass}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            Bold
          </button>
          <button
            data-active={editor.isActive('italic')}
            className={markClass}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            Italic
          </button>
          <button
            data-active={editor.isActive('underline')}
            className={markClass}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            Underline
          </button>
          <button
            data-active={editor.isActive('strike')}
            className={markClass}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            Strike
          </button>
          <button className={markClass} onClick={() => editor.chain().focus().toggleSubscript().run()}>
            Sub
          </button>
          <button className={markClass} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
            Sup
          </button>
          <button className={markClass} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            List
          </button>
          <button className={markClass} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            HR
          </button>
          <button className={markClass} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
            L
          </button>
          <button className={markClass} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
            C
          </button>
          <button className={markClass} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
            R
          </button>

          <select
            className='rounded border px-2 py-1 text-xs'
            onChange={(e) => editor.chain().focus().setMark('textStyle', { fontFamily: e.target.value }).run()}
            defaultValue=''
          >
            <option value=''>Font</option>
            <option value='Inter'>Inter</option>
            <option value='Arial'>Arial</option>
            <option value='Georgia'>Georgia</option>
          </select>
          <input
            type='number'
            min={10}
            max={72}
            defaultValue={16}
            className='w-16 rounded border px-2 py-1 text-xs'
            onChange={(e) =>
              editor
                .chain()
                .focus()
                .setMark('textStyle', { fontSize: `${e.target.value}px` })
                .run()
            }
          />
          <input
            type='color'
            title='Text color'
            className='h-8 w-8 rounded border'
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
          <input
            type='color'
            title='Highlight'
            className='h-8 w-8 rounded border'
            onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
          />
          <input
            type='number'
            step={0.1}
            min={1}
            max={3}
            defaultValue={1.6}
            className='w-16 rounded border px-2 py-1 text-xs'
            onChange={(e) =>
              editor
                .chain()
                .focus()
                .setMark('textStyle', { lineHeight: String(e.target.value) })
                .run()
            }
          />
          <input
            type='number'
            step={0.1}
            min={0}
            max={10}
            defaultValue={0}
            className='w-16 rounded border px-2 py-1 text-xs'
            onChange={(e) =>
              editor
                .chain()
                .focus()
                .setMark('textStyle', { letterSpacing: `${e.target.value}px` })
                .run()
            }
          />
          <button
            className={markClass}
            onClick={() => {
              const href = window.prompt('URL')
              if (href) editor.chain().focus().setLink({ href }).run()
            }}
          >
            Link
          </button>
          <button
            className={markClass}
            onClick={() => {
              const src = window.prompt('Image URL')
              if (src) editor.chain().focus().setImage({ src }).run()
            }}
          >
            Image
          </button>
          <button
            className={markClass}
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          >
            Table
          </button>
          <button
            className={markClass}
            onClick={() => {
              const cls = window.prompt('Custom class name')
              if (cls) editor.chain().focus().setMark('textStyle', { class: cls }).run()
            }}
          >
            Class
          </button>
        </div>
      ) : null}
      <EditorContent editor={editor} />
    </div>
  )
}
