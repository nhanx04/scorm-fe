import type { Route } from './+types/home'
import { OrganizationDetailPage } from '../../src/features/organization'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Organization Detail' }]
}

export default function OrganizationDetail() {
  return <OrganizationDetailPage />
}

