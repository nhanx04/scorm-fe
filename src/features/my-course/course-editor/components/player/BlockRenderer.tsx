import React from 'react'
import type { Block } from '../../types/editor.types'
import { useCourseEditorStore } from '../../store/use-course-editor-store'
import { resolveTheme } from '../../utils/resolveTheme'

type Props = {
  block: Block
  sectionId: string | null
  pageTheme: { background: string; color: string; borderRadius: number; padding?: number; fontFamily: string }
}

const BlockRenderer: React.FC<Props> = ({ block, sectionId }) => {
  const theme = useCourseEditorStore((state) => state.theme)
  const blockTheme = resolveTheme(
    theme.global,
    sectionId ? theme.sectionOverrides?.[sectionId] : undefined,
    theme.blockOverrides?.[block.id],
    block.themeOverride
  )

  const wrapperStyle = {
    background: blockTheme.background,
    color: blockTheme.color,
    borderRadius: blockTheme.borderRadius,
    padding: blockTheme.padding,
    fontFamily: blockTheme.fontFamily
  }

  switch (block.type) {
    case 'TEXT':
      return (
        <div className='prose max-w-none' style={wrapperStyle} dangerouslySetInnerHTML={{ __html: block.textHtml }} />
      )
    case 'IMAGE':
      return (
        <img
          src={block.imageUrl}
          alt={block.caption ?? 'image'}
          className='max-h-[280px] w-full rounded-lg object-contain sm:max-h-[360px]'
          style={{ borderRadius: blockTheme.borderRadius }}
        />
      )
    case 'VIDEO':
      return (
        <iframe
          src={block.embedUrl}
          title='video block'
          className='h-[220px] w-full rounded-lg sm:h-[360px]'
          style={{ borderRadius: blockTheme.borderRadius }}
          allowFullScreen
        />
      )
    default:
      return null
  }
}

export default BlockRenderer
