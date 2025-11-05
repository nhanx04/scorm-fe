import type { Route } from './+types/home'
import { HomePage } from '../../src/features/home'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Home Page' }, { name: 'description', content: 'Trang chủ' }]
}

export default function Home() {
  return <HomePage />
}
