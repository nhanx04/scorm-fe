import type { Route } from './+types/home'
import { useParams } from 'react-router'
import { OverlayLoading } from '@/components/loading'
import OrganizationSharedFolderPage from '../../src/features/organization/organization-shared-folder-page'
import { useOrganizationFolderAssets } from '../../src/features/organization/hook/useResource'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Shared Folder' }]
}

export default function OrganizationSharedFolderRoute() {
  const { orgId, folderId } = useParams()
  const orgIdNum = Number(orgId)
  const folderIdNum = Number(folderId)
  const { isLoading } = useOrganizationFolderAssets(orgIdNum, folderIdNum)

  return (
    <div className='relative'>
      <OrganizationSharedFolderPage />
      <OverlayLoading loading={isLoading} text='Loading shared folder assets...' />
    </div>
  )
}
