import React from 'react'

type EditableTextProps = {
  value: string
  onSave: (newValue: string) => void
  className?: string
  inputClassName?: string
  multiline?: boolean
  placeholder?: string
}

export function EditableText({
  value,
  onSave,
  className,
  inputClassName,
  multiline = false,
  placeholder
}: EditableTextProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(value)
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  React.useEffect(() => {
    if (!isEditing) setDraft(value)
  }, [isEditing, value])

  React.useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const commit = () => {
    const nextValue = draft.trim()
    if (nextValue !== value) onSave(nextValue)
    setIsEditing(false)
  }

  const cancel = () => {
    setDraft(value)
    setIsEditing(false)
  }

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          placeholder={placeholder}
          rows={3}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault()
              cancel()
            }
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              commit()
            }
          }}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className={`w-full rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName ?? ''}`}
        />
      )
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            cancel()
          }
          if (e.key === 'Enter') {
            e.preventDefault()
            commit()
          }
        }}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className={`w-full rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName ?? ''}`}
      />
    )
  }

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation()
        setIsEditing(true)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.stopPropagation()
          setIsEditing(true)
        }
      }}
      className={`cursor-text rounded-md px-1 py-0.5 hover:bg-gray-100 ${className ?? ''}`}
    >
      {value || placeholder || 'Untitled'}
    </div>
  )
}

