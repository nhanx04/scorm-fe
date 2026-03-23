import React, { useEffect, useMemo, useRef } from 'react'
import type { TextBlock } from '../../../../types/editor.types'

type TextBlockEditorProps = {
  block: TextBlock
  isActive: boolean
  onFocus: () => void
  onBlur: () => void
  onChange: (textHtml: string) => void
}

const toPlainText = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim()

const TextBlockEditor: React.FC<TextBlockEditorProps> = ({ block, isActive, onFocus, onBlur, onChange }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const isFocusedRef = useRef(false)

  const isEmpty = useMemo(() => toPlainText(block.textHtml).length === 0, [block.textHtml])

  useEffect(() => {
    if (!ref.current) return
    const nextHtml = block.textHtml || '<p></p>'
    if (isFocusedRef.current) return
    if (ref.current.innerHTML !== nextHtml) {
      ref.current.innerHTML = nextHtml
    }
  }, [block.textHtml])

  const exec = (command: 'bold' | 'italic' | 'insertUnorderedList' | 'formatBlock') => {
    if (!ref.current) return
    ref.current.focus()
    if (command === 'formatBlock') {
      document.execCommand('formatBlock', false, 'h2')
      return
    }
    document.execCommand(command, false)
    onChange(ref.current.innerHTML)
  }

  return (
    <div className='relative'>
      {isActive && (
        <div className='absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-full gap-1 rounded-lg border bg-white px-2 py-1 shadow-md'>
          <button
            type='button'
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('bold')}
            className='rounded px-2 py-1 text-sm hover:bg-gray-100'
          >
            Bold
          </button>
          <button
            type='button'
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('italic')}
            className='rounded px-2 py-1 text-sm hover:bg-gray-100'
          >
            Italic
          </button>
          <button
            type='button'
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('formatBlock')}
            className='rounded px-2 py-1 text-sm hover:bg-gray-100'
          >
            H2
          </button>
          <button
            type='button'
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('insertUnorderedList')}
            className='rounded px-2 py-1 text-sm hover:bg-gray-100'
          >
            List
          </button>
          <button
            type='button'
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              document.execCommand('formatBlock', false, 'pre')
              if (ref.current) onChange(ref.current.innerHTML)
            }}
            className='rounded px-2 py-1 text-sm hover:bg-gray-100'
          >
            Code
          </button>
        </div>
      )}

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        dir='ltr'
        className='w-full min-h-[80px] cursor-text text-left leading-relaxed text-gray-800 outline-none [direction:ltr]'
        onFocus={() => {
          isFocusedRef.current = true
          onFocus()
        }}
        onBlur={() => {
          isFocusedRef.current = false
          onBlur()
        }}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
      />

      {isEmpty && (
        <div className='pointer-events-none absolute left-0 top-0 text-sm text-gray-400'>Type something...</div>
      )}
    </div>
  )
}

export default TextBlockEditor
