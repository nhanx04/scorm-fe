// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import type { Organization, CreateOrganizationRequest, InviteMemberRequest, Member } from '../type'
import type { Library, MediaItem } from '@/features/my-library/types/library'

const ORGS_KEY = ['organizations']
const ORG_LOGO_IMAGES_KEY = ['org-logo-images']

export interface OrgLogoImage {
  mediaId: number
  title?: string
  mediaType?: string
  metadata?: {
    publicUrl?: string
    [key: string]: unknown
  }
}

export function useOrganizations() {
  return useQuery<Organization[]>({
    queryKey: ORGS_KEY,
    queryFn: async () => {
      const res = await api.get<Organization[]>('/organizations/me')
      return res.data
    }
  })
}

export function useCreateOrganization() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateOrganizationRequest) => {
      const res = await api.post<Organization>('/organizations', payload)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries(ORGS_KEY)
  })
}

export function useUpdateOrganization(orgId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<CreateOrganizationRequest>) => {
      const res = await api.patch<Organization>(`/organizations/${orgId}`, payload)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries(ORGS_KEY)
  })
}

export function useMembers(orgId?: number) {
  return useQuery<Member[]>({
    queryKey: ['org-members', orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const res = await api.get<Member[]>(`/organizations/${orgId}/members`)
      return res.data
    }
  })
}

export function useInviteMember(orgId: number) {
  return useMutation({
    mutationFn: async (payload: InviteMemberRequest) => {
      const res = await api.post(`/organizations/${orgId}/invite`, payload)
      return res.data
    }
  })
}

export function useDeleteOrganization() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (orgId: number) => {
      try {
        const res = await api.delete(`/organizations/${orgId}`)
        return res.data
      } catch (error: any) {
        const status = error?.response?.status
        if (status === 404 || status === 405 || status === 500) {
          const fallback = await api.post(`/organizations/${orgId}/delete`)
          return fallback.data
        }
        throw error
      }
    },
    onSuccess: () => qc.invalidateQueries(ORGS_KEY)
  })
}

export function useOrgLogoImages() {
  return useQuery<OrgLogoImage[]>({
    queryKey: ORG_LOGO_IMAGES_KEY,
    queryFn: async () => {
      const librariesRes = await api.get<Library[]>('/libraries')
      const libraries = librariesRes.data || []

      if (!libraries.length) return []

      const assetsByLibrary = await Promise.all(
        libraries.map(async (lib) => {
          const assetsRes = await api.get<MediaItem[]>(`/libraries/${lib.libraryId}/assets`)
          return assetsRes.data || []
        })
      )

      return assetsByLibrary
        .flat()
        .filter((asset) => asset.mediaType === 'IMAGE')
        .map((asset) => ({
          mediaId: asset.mediaId,
          title: asset.title,
          mediaType: asset.mediaType,
          metadata: (asset.metadata || {}) as OrgLogoImage['metadata']
        }))
    }
  })
}

export function useOrgLogoUrlMap() {
  const { data = [] } = useOrgLogoImages()

  return useMemo(() => {
    const map = new Map<number, string>()
    data.forEach((img) => {
      const url = img.metadata?.publicUrl
      if (img.mediaId && url) map.set(img.mediaId, url)
    })
    return map
  }, [data])
}
