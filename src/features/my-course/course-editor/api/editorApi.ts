import { api } from '@/services/api'
import type { EditorState } from '../types/editor.types'

export const saveDraft = async (editorState: EditorState) => {
  const { data } = await api.post('/editor/draft', { editorState })
  return data
}

export const loadDraft = async (courseId: string) => {
  const { data } = await api.get(`/editor/draft/${courseId}`)
  return data
}

export const exportCourse = async (payload: unknown) => {
  const { data } = await api.post('/editor/export', payload)
  return data
}

