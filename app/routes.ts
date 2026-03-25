import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/welcome.tsx'),
  route('/home', 'routes/home.tsx'),
  route('/signup', 'routes/register.tsx'),
  route('/my-course', 'routes/my-course.tsx'),
  route('/my-course/editor/:courseId', 'routes/course-editor.tsx'),
  route('/library', 'routes/library.tsx'),
  route('/organization', 'routes/organizations.tsx'),
  route('/organizations/:orgId', 'routes/organization-detail.tsx')
] satisfies RouteConfig
