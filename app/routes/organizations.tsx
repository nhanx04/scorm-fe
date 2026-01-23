import type { Route } from './+types/home'
import { OrganizationPage } from '../../src/features/organization'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Organizations' }, { name: 'description', content: 'Tổ chức' }]
}

export default function Organizations() {
  return <OrganizationPage />
}

