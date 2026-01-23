// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import type {
  Organization,
  CreateOrganizationRequest,
  InviteMemberRequest,
  Member
} from '../type'

const ORGS_KEY = ['organizations']

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

