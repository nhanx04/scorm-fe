import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import type {
  OrganizationFolderAssetsResponse,
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
        const res = await api.get(`/organizations/${orgId}/resources`, {
          params: { type: type || undefined }
        })

        const rows = toArray<Record<string, unknown>>(res.data)
        return rows.map((item) => ({
          id: Number(item.id ?? Date.now()),
          type: String(item.type ?? 'MEDIA') as OrganizationResourceType,
          name: String(item.name ?? item.title ?? 'Untitled'),
          thumbnail: typeof item.thumbnail === 'string' ? item.thumbnail : undefined,
          instructor: typeof item.instructor === 'string' ? item.instructor : undefined,
          folderItemCount: Number(item.folderItemCount ?? item.itemCount ?? 0),
          mediaAssetId: Number(item.mediaAssetId ?? item.mediaId ?? item.id ?? 0) || undefined,
          courseId: Number(item.courseId ?? item.id ?? 0) || undefined,
          folderId: Number(item.folderId ?? item.libraryId ?? item.id ?? 0) || undefined,
          sharedBy: Number(item.sharedBy ?? 0) || undefined,
          sharedByName: typeof item.sharedByName === 'string' ? item.sharedByName : undefined,
          createdAt: String(item.createdAt ?? new Date().toISOString())
        }))
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
          name:
            type === 'MEDIA'
              ? `Media #${payload.mediaAssetId}`
              : type === 'COURSE'
                ? `Course #${payload.courseId}`
                : `Folder #${payload.folderId}`,
          thumbnail: '',
          mediaAssetId: payload.mediaAssetId,
          courseId: payload.courseId,
          folderId: payload.folderId,
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
        mediaAssetId: payload.mediaAssetId,
        courseId: payload.courseId,
        folderId: payload.folderId,
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

function toArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[]
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (Array.isArray(record.content)) return record.content as T[]
    if (Array.isArray(record.data)) return record.data as T[]
    if (Array.isArray(record.items)) return record.items as T[]
  }
  return []
}

export function useOrganizationFolderAssets(orgId?: number, folderId?: number) {
  return useQuery<OrganizationFolderAssetsResponse>({
    queryKey: ['organization-folder-assets', orgId, folderId],
    enabled: !!orgId && !!folderId,
    queryFn: async () => {
      const res = await api.get(`/organizations/${orgId}/folders/${folderId}/assets`)
      const data = (res.data ?? {}) as Record<string, unknown>
      const itemRows = toArray<Record<string, unknown>>(data.items)

      return {
        orgId: Number(data.orgId ?? orgId ?? 0),
        resourceId: Number(data.resourceId ?? 0),
        folderId: Number(data.folderId ?? folderId ?? 0),
        folderName: typeof data.folderName === 'string' ? data.folderName : undefined,
        items: itemRows
          .map((item) => ({
            mediaId: Number(item.mediaId ?? item.id ?? 0),
            title: typeof item.title === 'string' ? item.title : undefined,
            description: typeof item.description === 'string' ? item.description : undefined,
            originalFileName: typeof item.originalFileName === 'string' ? item.originalFileName : undefined,
            mediaType: typeof item.mediaType === 'string' ? item.mediaType : undefined,
            uploadedAt: typeof item.uploadedAt === 'string' ? item.uploadedAt : undefined,
            updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
            metadata: item.metadata
          }))
          .filter((item) => Number.isFinite(item.mediaId) && item.mediaId > 0)
      }
    }
  })
}

export function useSelectableResources() {
  return useQuery<{ media: SelectableMedia[]; courses: SelectableCourse[]; folders: SelectableFolder[] }>({
    queryKey: ['organization-selectable-resources'],
    queryFn: async () => {
      try {
        const [courseRes, folderRes] = await Promise.all([api.get('/courses'), api.get('/libraries')])

        const courses = toArray<Record<string, unknown>>(courseRes.data)
          .map((item) => ({
            id: Number(item.id ?? item.courseId),
            name: String(item.name ?? item.courseName ?? item.title ?? 'Untitled course'),
            instructor: typeof item.instructor === 'string' ? item.instructor : undefined
          }))
          .filter((item) => Number.isFinite(item.id))

        const folders = toArray<Record<string, unknown>>(folderRes.data)
          .map((item) => ({
            id: Number(item.id ?? item.libraryId ?? item.folderId),
            name: String(item.name ?? item.libraryName ?? item.folderName ?? 'Untitled folder'),
            itemCount: Number(item.itemCount ?? item.totalItems ?? 0)
          }))
          .filter((item) => Number.isFinite(item.id))

        const folderAssets = await Promise.all(
          folders.map(async (folder) => {
            try {
              const assetsRes = await api.get(`/libraries/${folder.id}/assets`)
              const rows = toArray<Record<string, unknown>>(assetsRes.data)
              return rows
                .filter((asset) => String(asset.mediaType ?? '').toUpperCase() === 'IMAGE')
                .map((asset) => ({
                  id: Number(asset.id ?? asset.mediaAssetId),
                  name: String(asset.title ?? asset.name ?? asset.originalFileName ?? `Image #${asset.id ?? ''}`),
                  thumbnail:
                    typeof asset.publicUrl === 'string'
                      ? asset.publicUrl
                      : typeof asset.thumbnail === 'string'
                        ? asset.thumbnail
                        : undefined
                }))
                .filter((asset) => Number.isFinite(asset.id))
            } catch {
              return [] as SelectableMedia[]
            }
          })
        )

        const mediaMap = new Map<number, SelectableMedia>()
        folderAssets.flat().forEach((m) => mediaMap.set(m.id, m))
        const media = Array.from(mediaMap.values())

        return { media, courses, folders }
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
