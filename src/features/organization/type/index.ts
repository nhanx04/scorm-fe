// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
export interface Organization {
  orgId: number
  orgName: string
  description?: string
  maxAuthors?: number
  logoMediaId?: number
  ownerId: number
  updatedAt?: string
  createdAt?: string
}

export interface Member {
  userId: number
  email: string
  fname: string
  minit: string
  lname: string
  role: 'OWNER' | 'MEMBER'
  status: 'ACTIVE' | 'INVITED' | 'REJECTED'
  invitedAt: string | null
  joinedAt: string | null
}

export type CreateOrganizationRequest = {
  orgName: string
  description?: string
  maxAuthors?: number
  logoMediaId?: number
}

export type InviteMemberRequest = {
  email: string
  role?: 'MEMBER' | 'OWNER'
}

export type OrganizationResourceType = 'MEDIA' | 'COURSE' | 'FOLDER'

export interface OrganizationResource {
  id: number
  type: OrganizationResourceType
  name: string
  thumbnail?: string
  instructor?: string
  folderItemCount?: number
  sharedBy?: number
  sharedByName?: string
  createdAt: string
}

export interface ShareResourcePayload {
  type: OrganizationResourceType
  mediaAssetId?: number
  courseId?: number
  folderId?: number
}

export interface SelectableMedia {
  id: number
  name: string
  thumbnail?: string
}

export interface SelectableCourse {
  id: number
  name: string
  instructor?: string
}

export interface SelectableFolder {
  id: number
  name: string
  itemCount?: number
}

export interface OrganizationActivity {
  id: number
  userName: string
  action: string
  targetType?: OrganizationResourceType | 'MEMBER'
  targetName?: string
  createdAt: string
}
