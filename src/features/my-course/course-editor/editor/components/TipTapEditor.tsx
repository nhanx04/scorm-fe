import React from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { useLibraries, useLibraryItems } from '@/features/my-library/hooks/useLibrary'
import { useUploadMedia } from '@/features/my-library/hooks/useUpload'
import { tiptapExtensions, toYoutubeEmbedUrl } from './tiptapExtensions'

interface TipTapEditorProps {
  value: string
  onChange: (html: string) => void
  editable?: boolean
  minHeightClassName?: string
  placeholder?: string
}

const getMediaUrl = (metadata: Record<string, unknown>) => {
  const candidate = metadata?.publicUrl ?? metadata?.url ?? metadata?.secureUrl
  return typeof candidate === 'string' ? candidate : ''
}

export function TipTapEditor({
  value,
  onChange,
  editable = true,
  minHeightClassName = 'min-h-[240px]',
  placeholder
}: TipTapEditorProps) {
  const [openMedia, setOpenMedia] = React.useState(false)
  const [mediaMode, setMediaMode] = React.useState<'link' | 'upload' | 'library'>('link')
  const [linkUrl, setLinkUrl] = React.useState('')
  const [selectedLibraryId, setSelectedLibraryId] = React.useState<number | undefined>(undefined)
  const [selectedMedia, setSelectedMedia] = React.useState<{ type: 'image' | 'youtubeEmbed'; width: number } | null>(
    null
  )
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  const { data: libraries = [] } = useLibraries()
  const { data: libraryItems = [] } = useLibraryItems(selectedLibraryId)
  const uploadMutation = useUploadMedia()

  React.useEffect(() => {
    if (!selectedLibraryId && libraries[0]?.libraryId) setSelectedLibraryId(libraries[0].libraryId)
  }, [libraries, selectedLibraryId])

  const editor = useEditor({
    extensions: tiptapExtensions(placeholder),
    content: value,
    editable,
    editorProps: {
      attributes: {
        class: `${minHeightClassName} rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 focus:outline-none [&_.ProseMirror-selectednode]:outline [&_.ProseMirror-selectednode]:outline-2 [&_.ProseMirror-selectednode]:outline-blue-500 [&_img]:max-w-full [&_img]:rounded-xl [&_img]:shadow-sm [&_iframe]:max-w-full [&_iframe]:rounded-xl`
      }
    },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
    immediatelyRender: false
  })

  React.useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) editor.commands.setContent(value, { emitUpdate: false })
  }, [editor, value])

  React.useEffect(() => {
    if (!editor) return
    const syncSelected = () => {
      const node = editor.state.selection.$from.nodeAfter || editor.state.selection.$from.nodeBefore
      if (!node) return setSelectedMedia(null)
      if (node.type.name === 'image' || node.type.name === 'youtubeEmbed') {
        setSelectedMedia({ type: node.type.name as 'image' | 'youtubeEmbed', width: Number(node.attrs.width) || 400 })
      } else {
        setSelectedMedia(null)
      }
    }
    syncSelected()
    editor.on('selectionUpdate', syncSelected)
    return () => {
      editor.off('selectionUpdate', syncSelected)
    }
  }, [editor])

  if (!editor) return null

  const markClass =
    'rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 data-[active=true]:bg-blue-600 data-[active=true]:text-white'

  const insertFromUrl = () => {
    const valueUrl = linkUrl.trim()
    if (!valueUrl) return
    const isImage = /\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i.test(valueUrl)
    const embedUrl = toYoutubeEmbedUrl(valueUrl)
    if (isImage) editor.chain().focus().setImage({ src: valueUrl, width: 400 }).run()
    else if (embedUrl)
      editor
        .chain()
        .focus()
        .insertContent({ type: 'youtubeEmbed', attrs: { src: embedUrl, width: 560, height: 315 } })
        .run()
    else return window.alert('Unsupported URL. Use image URL or YouTube URL.')
    setLinkUrl('')
    setOpenMedia(false)
  }

  const onUploadFile: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0]
    if (!file || !selectedLibraryId) return
    try {
      const uploaded = await uploadMutation.mutateAsync({ type: 'IMAGE', file, libraryId: selectedLibraryId })
      const src = getMediaUrl(uploaded.metadata as Record<string, unknown>)
      if (src) editor.chain().focus().setImage({ src, width: 400 }).run()
      setOpenMedia(false)
    } catch {
      window.alert('Upload failed. Please try again.')
    } finally {
      event.target.value = ''
    }
  }

  const imageItems = libraryItems.filter((item) => item.mediaType === 'IMAGE')

  return (
    <div className='space-y-3'>
      {editable ? (
        <div className='relative flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-white p-2'>
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
          <button className={markClass} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
            L
          </button>
          <button className={markClass} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
            C
          </button>
          <button className={markClass} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
            R
          </button>
          <button className={markClass} onClick={() => setOpenMedia((v) => !v)}>
            Insert Media
          </button>
          {selectedMedia ? (
            <div className='ml-auto flex items-center gap-2 rounded-lg bg-blue-50 px-2 py-1 text-xs text-blue-700'>
              <span>Resize</span>
              <input
                type='range'
                min={180}
                max={900}
                value={selectedMedia.width}
                onChange={(e) => {
                  const width = Number(e.target.value)
                  setSelectedMedia((prev) => (prev ? { ...prev, width } : prev))
                  if (selectedMedia.type === 'image') editor.chain().focus().updateAttributes('image', { width }).run()
                  else
                    editor
                      .chain()
                      .focus()
                      .updateAttributes('youtubeEmbed', { width, height: Math.round((width * 9) / 16) })
                      .run()
                }}
              />
              <span>{selectedMedia.width}px</span>
            </div>
          ) : null}

          {openMedia ? (
            <div className='absolute left-2 top-12 z-20 w-[320px] space-y-2 rounded-xl border border-gray-200 bg-white p-3 shadow-xl'>
              <div className='flex gap-1'>
                <button className={markClass} onClick={() => setMediaMode('link')}>
                  Insert via Link
                </button>
                <button className={markClass} onClick={() => setMediaMode('upload')}>
                  Upload Image
                </button>
                <button className={markClass} onClick={() => setMediaMode('library')}>
                  Choose from Library
                </button>
              </div>
              {mediaMode === 'link' ? (
                <div className='space-y-2'>
                  <input
                    className='w-full rounded border border-gray-200 px-2 py-1 text-xs'
                    placeholder='Image URL or YouTube URL'
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                  {linkUrl ? (
                    <p className='text-[11px] text-gray-500 break-all'>{toYoutubeEmbedUrl(linkUrl) ?? linkUrl}</p>
                  ) : null}
                  <button className={markClass} onClick={insertFromUrl}>
                    Insert
                  </button>
                </div>
              ) : null}
              {mediaMode === 'upload' ? (
                <div className='space-y-2'>
                  <select
                    className='w-full rounded border border-gray-200 px-2 py-1 text-xs'
                    value={selectedLibraryId}
                    onChange={(e) => setSelectedLibraryId(Number(e.target.value))}
                  >
                    {libraries.map((library) => (
                      <option key={library.libraryId} value={library.libraryId}>
                        {library.libraryName}
                      </option>
                    ))}
                  </select>
                  <input ref={fileRef} type='file' accept='image/*' className='hidden' onChange={onUploadFile} />
                  <button className={markClass} onClick={() => fileRef.current?.click()}>
                    {uploadMutation.isPending ? 'Uploading...' : 'Select Image'}
                  </button>
                </div>
              ) : null}
              {mediaMode === 'library' ? (
                <div className='space-y-2'>
                  <select
                    className='w-full rounded border border-gray-200 px-2 py-1 text-xs'
                    value={selectedLibraryId}
                    onChange={(e) => setSelectedLibraryId(Number(e.target.value))}
                  >
                    {libraries.map((library) => (
                      <option key={library.libraryId} value={library.libraryId}>
                        {library.libraryName}
                      </option>
                    ))}
                  </select>
                  <div className='grid max-h-52 grid-cols-3 gap-2 overflow-auto'>
                    {imageItems.map((item) => {
                      const src = getMediaUrl(item.metadata as Record<string, unknown>)
                      if (!src) return null
                      return (
                        <button
                          key={item.mediaId}
                          className='overflow-hidden rounded border border-gray-200'
                          onClick={() => {
                            editor.chain().focus().setImage({ src, width: 400 }).run()
                            setOpenMedia(false)
                          }}
                        >
                          <img src={src} alt={item.title} className='h-20 w-full object-cover' />
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
      <EditorContent editor={editor} />
    </div>
  )
}
