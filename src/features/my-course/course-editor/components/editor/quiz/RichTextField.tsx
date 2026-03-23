import React, { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

const RichTextField: React.FC<Props> = ({ value, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[90px] border-b border-gray-300 bg-transparent px-0 py-2 text-base outline-none focus-within:border-blue-500'
      }
    }
  })

  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() === value) return
    editor.commands.setContent(value || `<p>${placeholder ?? ''}</p>`)
  }, [value, editor, placeholder])

  if (!editor) return null
  return <EditorContent editor={editor} />
}

export default RichTextField
