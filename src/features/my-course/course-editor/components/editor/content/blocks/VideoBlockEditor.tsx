import React, { useMemo, useState } from 'react'
import type { VideoBlock } from '../../../../types/editor.types'

type VideoBlockEditorProps = {
  block: VideoBlock
  onChange: (data: Partial<VideoBlock>) => void
}

const toEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('youtube.com') && !parsed.hostname.includes('youtu.be')) {
      return ''
    }

    const videoId =
      parsed.hostname.includes('youtu.be')
        ? parsed.pathname.replace('/', '')
        : parsed.searchParams.get('v') ?? ''

    if (!videoId) return ''
    return `https://www.youtube.com/embed/${videoId}`
  } catch {
    return ''
  }
}

const VideoBlockEditor: React.FC<VideoBlockEditorProps> = ({ block, onChange }) => {
  const [input, setInput] = useState('')
  const isValidInput = useMemo(() => (input ? Boolean(toEmbedUrl(input)) : true), [input])

  return (
    <div className='space-y-3'>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Paste YouTube URL'
        className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
        onBlur={(e) => {
          const embed = toEmbedUrl(e.target.value)
          if (embed) onChange({ embedUrl: embed })
        }}
      />

      {!isValidInput && <p className='text-xs text-red-500'>Only YouTube URLs are supported.</p>}

      {block.embedUrl && (
        <iframe
          src={block.embedUrl}
          className='aspect-video w-full rounded-xl'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          title='YouTube video embed'
        />
      )}
    </div>
  )
}

export default VideoBlockEditor

