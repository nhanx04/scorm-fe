// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import type { Library, MediaItem } from '../types/library'

const LIBRARIES_QUERY_KEY = ['libraries']

export function useLibraries() {
  return useQuery({
    queryKey: LIBRARIES_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get<Library[]>('/libraries')
      return res.data
    }
  })
}

export function useCreateLibrary() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { libraryName: string; description?: string; scopeType?: 'PRIVATE' | 'PUBLIC' }) => {
      const res = await api.post<Library>('/libraries', {
        ...payload,
        scopeType: payload.scopeType ?? 'PRIVATE'
      })
      return res.data
    },
    onSuccess: () => qc.invalidateQueries(LIBRARIES_QUERY_KEY)
  })
}

export function useLibraryItems(libraryId?: number) {
  return useQuery({
    queryKey: ['library-items', libraryId],
    queryFn: async () => {
      if (!libraryId) return []
      const res = await api.get<MediaItem[]>(`/libraries/${libraryId}/assets`)
      return res.data
    },
    enabled: !!libraryId
  })
}

export function useInvalidateLibraries() {
  const qc = useQueryClient()
  return useCallback(() => qc.invalidateQueries(LIBRARIES_QUERY_KEY), [qc])
}
export function useDeleteLibrary() {
  const invalidate = useInvalidateLibraries()
  return useMutation({
    mutationFn: async (libraryId: number) => {
      await api.delete(`/libraries/${libraryId}`)
    },
    onSuccess: () => invalidate()
  })
}

export function useBulkDeleteLibraries() {
  const invalidate = useInvalidateLibraries()
  return useMutation({
    mutationFn: async (libraryIds: number[]) => {
      await api.delete('/libraries', { data: { libraryIds } })
    },
    onSuccess: () => invalidate()
  })
}

export function useDeleteMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (mediaId: number) => {
      await api.delete(`/media/${mediaId}`)
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-items'] })
      void qc.invalidateQueries({ queryKey: LIBRARIES_QUERY_KEY })
    }
  })
}

export function useBulkDeleteMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { libraryId: number; mediaIds: number[] }) => {
      await api.delete('/media', { data: payload })
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-items'] })
      void qc.invalidateQueries({ queryKey: LIBRARIES_QUERY_KEY })
    }
  })
}
