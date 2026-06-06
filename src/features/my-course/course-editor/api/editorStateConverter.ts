import type { AICourseOutlineResponse } from './aiApi'
import { v4 as uuidv4 } from 'uuid'

export interface EditorState {
  title: string
  description: string
  coverImageUrl?: string
  sections: Array<{
    id: string
    title: string
    description: string
    pages: Array<{
      id: string
      title: string
      pageType: 'CONTENT'
      orderIndex: number
      contentPage: {
        layoutType: 'SINGLE_COLUMN'
        blocks: Array<{
          id: string
          type: 'TEXT'
          textHtml: string
          orderIndex: number
        }>
      }
    }>
  }>
}

/**
 * Convert AI outline (sections with topics) to editor state format
 * Each topic becomes a CONTENT page with placeholder text
 */
export const convertOutlineToEditorState = (
  outline: AICourseOutlineResponse,
  description: string,
  coverImageUrl?: string
): EditorState => {
  return {
    title: outline.title,
    description: description,
    coverImageUrl,
    sections: outline.sections.map((section, sectionIdx) => ({
      id: uuidv4(),
      title: section.title,
      description: section.title,
      pages: section.topics.map((topic, topicIdx) => ({
        id: uuidv4(),
        title: topic,
        pageType: 'CONTENT' as const,
        orderIndex: topicIdx + 1,
        contentPage: {
          layoutType: 'SINGLE_COLUMN' as const,
          blocks: [
            {
              id: uuidv4(),
              type: 'TEXT' as const,
              textHtml: `<p>${topic}</p>`,
              orderIndex: 1
            }
          ]
        }
      }))
    }))
  }
}

