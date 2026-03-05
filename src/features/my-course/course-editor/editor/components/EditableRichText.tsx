import React from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { tiptapExtensions } from './tiptapExtensions'

type EditableRichTextVariant = 'sectionTitle' | 'sectionDescription' | 'pageTitle'

interface EditableRichTextProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  variant?: EditableRichTextVariant
  mode?: 'edit' | 'preview'
}

const variantClassName: Record<EditableRichTextVariant, string> = {
  sectionTitle: 'text-2xl font-semibold',
  sectionDescription: 'text-base opacity-80',
  pageTitle: 'text-lg font-medium'
}

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '30px']

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function toHtmlString(value: string) {
  const normalized = value?.trim() ?? ''
  if (!normalized) return '<p></p>'
  if (/<[^>]+>/.test(normalized)) return value
  return `<p>${escapeHtml(value).replace(/\r?\n/g, '<br/>')}</p>`
}

export function EditableRichText({
  value,
  onChange,
  placeholder = 'Type here...',
  variant = 'pageTitle',
  mode = 'edit'
}: EditableRichTextProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const content = React.useMemo(() => toHtmlString(value || ''), [value])

  const editor = useEditor({
    extensions: tiptapExtensions(placeholder),
    content,
    editable: mode === 'edit',
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none min-h-[44px] px-2 py-1.5 outline-none ${variantClassName[variant]}`
      }
    },
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    immediatelyRender: false
  })

  React.useEffect(() => {
    if (!editor) return
    const currentHtml = editor.getHTML()
    if (currentHtml !== content) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [content, editor])

  if (mode === 'preview') {
    return (
      <div
        className={`prose prose-sm max-w-none ${variantClassName[variant]}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  if (!editor) {
    return (
      <div
        className={`prose prose-sm max-w-none ${variantClassName[variant]}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  return (
    <div
      className={`relative rounded-lg border border-transparent bg-white/40 transition ${isFocused ? 'ring-1 ring-blue-400' : 'hover:border-gray-200'}`}
    >
      {editor.isFocused ? (
        <div className='absolute -top-10 left-2 z-20 flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 shadow'>
          <button
            type='button'
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`rounded px-1.5 py-0.5 text-xs ${editor.isActive('bold') ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
          >
            B
          </button>
          <button
            type='button'
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`rounded px-1.5 py-0.5 text-xs ${editor.isActive('italic') ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
          >
            I
          </button>
          <button
            type='button'
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`rounded px-1.5 py-0.5 text-xs ${editor.isActive('underline') ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
          >
            U
          </button>
          <select
            className='rounded border border-gray-200 px-1 py-0.5 text-xs'
            defaultValue=''
            onMouseDown={(event) => event.preventDefault()}
            onChange={(event) => {
              const size = event.target.value
              if (!size) return
              editor.chain().focus().setMark('textStyle', { fontSize: size }).run()
            }}
          >
            <option value=''>Size</option>
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <input
            type='color'
            className='h-6 w-6 cursor-pointer rounded border border-gray-200 p-0'
            onMouseDown={(event) => event.preventDefault()}
            onChange={(event) => editor.chain().focus().setColor(event.target.value).run()}
            aria-label='Text color'
          />
          <button
            type='button'
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className='rounded px-1 text-xs text-gray-700'
          >
            L
          </button>
          <button
            type='button'
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className='rounded px-1 text-xs text-gray-700'
          >
            C
          </button>
          <button
            type='button'
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className='rounded px-1 text-xs text-gray-700'
          >
            R
          </button>
        </div>
      ) : null}
      <EditorContent editor={editor} />
    </div>
  )
}
