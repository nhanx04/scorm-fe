import type { Route } from './+types/home'
import { ProfilePage } from '../../src/features/profile'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Profile' }, { name: 'description', content: 'Profile' }]
}

export default function Organizations() {
  return <ProfilePage />
}
