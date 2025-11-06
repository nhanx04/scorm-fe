import type { Route } from './+types/home'
import { RegisterPage } from '../../src/features/auth'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Welcome to SCORM' }, { name: 'description', content: 'Welcome to SCORM' }]
}

export default function Home() {
  return <RegisterPage />
}
