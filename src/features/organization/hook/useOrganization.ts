import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import type { Member, Organization, OrganizationActivity } from '../type'

const mockActivities: OrganizationActivity[] = [
  {
    id: 1,
    userName: 'System',
    action: 'shared',
    targetType: 'COURSE',
    targetName: 'React Fundamentals',
    createdAt: new Date().toISOString()
  }
]

export function useOrganizationDetail(orgId?: number) {
  return useQuery<Organization | null>({
    queryKey: ['organization-detail', orgId],
    enabled: !!orgId,
    queryFn: async () => {
      try {
        const res = await api.get<Organization[]>('/organizations/me')
        return res.data.find((o) => o.orgId === orgId) ?? null
      } catch {
        return {
          orgId: orgId || 0,
          orgName: 'Demo Organization',
          description: 'A collaborative workspace for sharing learning resources.',
          ownerId: 1,
          logoMediaId: undefined,
          maxAuthors: 10
        }
      }
    }
  })
}

export function useOrganizationMembers(orgId?: number) {
  return useQuery<Member[]>({
    queryKey: ['organization-members', orgId],
    enabled: !!orgId,
    queryFn: async () => {
      try {
        const res = await api.get<Member[]>(`/organizations/${orgId}/members`)
        return res.data
      } catch {
        return [
          {
            userId: 1,
            email: 'owner@demo.com',
            fname: 'Org',
            minit: '',
            lname: 'Owner',
            role: 'OWNER',
            status: 'ACTIVE',
            invitedAt: null,
            joinedAt: new Date().toISOString()
          }
        ]
      }
    }
  })
}

export function useOrganizationActivities(orgId?: number) {
  return useQuery<OrganizationActivity[]>({
    queryKey: ['organization-activities', orgId],
    enabled: !!orgId,
    queryFn: async () => {
      try {
        const res = await api.get<OrganizationActivity[]>(`/organizations/${orgId}/activities`)
        return res.data
      } catch {
        return mockActivities
      }
    }
  })
}

