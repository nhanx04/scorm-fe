import type { Route } from './+types/home'
import { MyCoursePage } from '../../src/features/my-course'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'My Courses' }, { name: 'description', content: 'Khóa học của tôi' }]
}

export default function Home() {
  return <MyCoursePage />
}
