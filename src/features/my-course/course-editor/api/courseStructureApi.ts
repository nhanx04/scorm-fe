import { api } from '@/services/api'
import type { AICourseOutlineResponse } from './aiApi'

export type CreateSectionRequest = {
  title: string
  description?: string
  orderIndex: number
  learningObjective?: string
}

export type CreatePageRequest = {
  title: string
  orderIndex: number
  pageType: 'CONTENT' | 'QUIZ'
  contentPageLayoutType?: 'SINGLE_COLUMN' | 'TWO_COLUMN'
}

/**
 * Convert AI outline (sections with topics) to course structure (sections with pages)
 * Each topic becomes a CONTENT page
 */
export const convertOutlineToSections = (outline: AICourseOutlineResponse) => {
  return outline.sections.map((section, sectionIndex) => ({
    section: {
      title: section.title,
      description: '',
      orderIndex: sectionIndex + 1,
      learningObjective: section.title
    },
    pages: section.topics.map((topic, topicIndex) => ({
      title: topic,
      orderIndex: topicIndex + 1,
      pageType: 'CONTENT' as const,
      contentPageLayoutType: 'SINGLE_COLUMN' as const
    }))
  }))
}

/**
 * Create sections and pages from AI outline
 */
export const createSectionsFromOutline = async (
  courseId: number,
  outline: AICourseOutlineResponse
) => {
  const sectionsWithPages = convertOutlineToSections(outline)

  for (const { section, pages } of sectionsWithPages) {
    try {
      // Create section
      const sectionRes = await api.post(`/courses/${courseId}/sections`, section)
      const sectionId = sectionRes.data?.sectionId

      if (!sectionId) throw new Error('Failed to create section')

      // Create pages for this section
      for (const page of pages) {
        await api.post(`/sections/${sectionId}/pages`, {
          title: page.title,
          orderIndex: page.orderIndex,
          pageType: page.pageType,
          contentPageLayoutType: page.contentPageLayoutType
        })
      }
    } catch (error) {
      console.error('Failed to create section structure:', error)
      throw error
    }
  }
}

