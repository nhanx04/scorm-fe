import React from 'react'
import type { Page } from '../../../types/editor.types'
import BlockList from './BlockList'

type ContentPageEditorProps = {
  page: Page
}

const ContentPageEditor: React.FC<ContentPageEditorProps> = ({ page }) => {
  if (page.type !== 'content') return null

  return (
    <div className='mx-auto w-full max-w-6xl'>
      <BlockList page={page} />
    </div>
  )
}

export default ContentPageEditor
