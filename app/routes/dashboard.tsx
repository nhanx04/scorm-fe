import type { Route } from './+types/home'
import { DashboardPage } from '../../src/features/dashboard'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Dashboard' }, { name: 'description', content: 'SCORM control center dashboard' }]
}

export default function DashboardRoute() {
  return <DashboardPage />
}

