// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import { useMutation } from '@tanstack/react-query'
import { api } from '@/services/api'
import { useInvalidateLibraries } from './useLibrary'
import type { MediaItem } from '../types/library'

export type UploadPayload =
  | { type: 'IMAGE' | 'DOCUMENT' | 'AUDIO'; file: File; title?: string; description?: string; libraryId: number }
  | { type: 'VIDEO'; youtubeUrl: string; title: string; description?: string; libraryId: number }

export function useUploadMedia() {
  const invalidate = useInvalidateLibraries()
  return useMutation({
    mutationFn: async (payload: UploadPayload) => {
      if (payload.type === 'VIDEO') {
        const res = await api.post<MediaItem>('/media/videos', {
          libraryId: payload.libraryId,
          youtubeUrl: payload.youtubeUrl.trim(),
          title: payload.title.trim(),
          description: payload.description?.trim()
        })
        return res.data
      }

      // Other types: multipart upload
      const form = new FormData()
      form.append('file', payload.file)
      form.append('libraryId', String(payload.libraryId))
      if (payload.title) form.append('title', payload.title)
      if (payload.description) form.append('description', payload.description)

      let endpoint = '/media/images/upload'
      if (payload.type === 'AUDIO') endpoint = '/media/audios/upload'
      if (payload.type === 'DOCUMENT') endpoint = '/media/documents/upload'

      const res = await api.post<MediaItem>(endpoint, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return res.data
    },
    onSuccess: () => invalidate()
  })
}
