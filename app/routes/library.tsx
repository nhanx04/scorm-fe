import type { Route } from './+types/home'
import { MyLibraryPage } from '../../src//features/my-library'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'My Library' }, { name: 'description', content: 'Thư viện của tôi' }]
}

export default function Library() {
  return <MyLibraryPage />
}
