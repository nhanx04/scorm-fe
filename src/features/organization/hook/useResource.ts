import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import type {
  OrganizationResource,
  OrganizationResourceType,
  ShareResourcePayload,
  SelectableCourse,
  SelectableFolder,
  SelectableMedia
} from '../type'

const mockResources: OrganizationResource[] = [
  {
    id: 1,
    type: 'COURSE',
    name: 'TypeScript Masterclass',
    thumbnail: '',
    instructor: 'Jane Doe',
    sharedBy: 1,
    sharedByName: 'Org Owner',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    type: 'FOLDER',
    name: 'Onboarding Assets',
    folderItemCount: 8,
    sharedBy: 1,
    sharedByName: 'Org Owner',
    createdAt: new Date().toISOString()
  }
]

export function useOrganizationResources(orgId?: number, type?: OrganizationResourceType) {
  return useQuery<OrganizationResource[]>({
    queryKey: ['organization-resources', orgId, type],
    enabled: !!orgId,
    queryFn: async () => {
      try {
        const res = await api.get<OrganizationResource[]>(`/organizations/${orgId}/resources`, {
          params: { type: type || undefined }
        })
        return res.data
      } catch {
        return type ? mockResources.filter((x) => x.type === type) : mockResources
      }
    }
  })
}

export function useShareResource(orgId?: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ShareResourcePayload) => {
      if (!orgId) throw new Error('Missing orgId')
      try {
        const res = await api.post<OrganizationResource>(`/organizations/${orgId}/resources`, payload)
        return res.data
      } catch {
        const type = payload.type
        return {
          id: Date.now(),
          type,
          name: type === 'MEDIA' ? `Media #${payload.mediaAssetId}` : type === 'COURSE' ? `Course #${payload.courseId}` : `Folder #${payload.folderId}`,
          thumbnail: '',
          sharedBy: 1,
          sharedByName: 'You',
          instructor: type === 'COURSE' ? 'Unknown Instructor' : undefined,
          folderItemCount: type === 'FOLDER' ? 0 : undefined,
          createdAt: new Date().toISOString()
        } as OrganizationResource
      }
    },
    onMutate: async (payload) => {
      if (!orgId) return
      await qc.cancelQueries({ queryKey: ['organization-resources', orgId] })
      const keyPrefix = ['organization-resources', orgId]
      const optimistic: OrganizationResource = {
        id: Date.now(),
        type: payload.type,
        name:
          payload.type === 'MEDIA'
            ? `Media #${payload.mediaAssetId}`
            : payload.type === 'COURSE'
              ? `Course #${payload.courseId}`
              : `Folder #${payload.folderId}`,
        sharedBy: 1,
        sharedByName: 'You',
        createdAt: new Date().toISOString()
      }
      const allQueries = qc.getQueriesData<OrganizationResource[]>({ queryKey: keyPrefix })
      allQueries.forEach(([queryKey, old]) => {
        qc.setQueryData<OrganizationResource[]>(queryKey, [optimistic, ...(old || [])])
      })
      return { allQueries }
    },
    onError: (_err, _payload, ctx) => {
      ctx?.allQueries?.forEach(([queryKey, old]) => {
        qc.setQueryData(queryKey, old)
      })
    },
    onSettled: () => {
      if (!orgId) return
      qc.invalidateQueries({ queryKey: ['organization-resources', orgId] })
    }
  })
}

export function useRemoveResource(orgId?: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (resourceId: number) => {
      if (!orgId) throw new Error('Missing orgId')
      try {
        await api.delete(`/organizations/${orgId}/resources/${resourceId}`)
      } catch {
        return
      }
    },
    onSuccess: () => {
      if (!orgId) return
      qc.invalidateQueries({ queryKey: ['organization-resources', orgId] })
    }
  })
}

export function useSelectableResources() {
  return useQuery<{ media: SelectableMedia[]; courses: SelectableCourse[]; folders: SelectableFolder[] }>({
    queryKey: ['organization-selectable-resources'],
    queryFn: async () => {
      try {
        const [mediaRes, courseRes, folderRes] = await Promise.all([
          api.get<SelectableMedia[]>('/media-assets/me'),
          api.get<SelectableCourse[]>('/courses'),
          api.get<SelectableFolder[]>('/libraries')
        ])
        return { media: mediaRes.data || [], courses: courseRes.data || [], folders: folderRes.data || [] }
      } catch {
        return {
          media: [
            { id: 101, name: 'Landing Hero Banner', thumbnail: '' },
            { id: 102, name: 'Product Intro Video', thumbnail: '' }
          ],
          courses: [
            { id: 201, name: 'React Fundamentals', instructor: 'Jane Doe' },
            { id: 202, name: 'Spring Boot API Design', instructor: 'John Smith' }
          ],
          folders: [
            { id: 301, name: 'Brand Assets', itemCount: 12 },
            { id: 302, name: 'Training Materials', itemCount: 7 }
          ]
        }
      }
    }
  })
}

