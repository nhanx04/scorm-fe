import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/welcome.tsx'),
  route('/home', 'routes/home.tsx'),
  route('/signup', 'routes/register.tsx'),
  route('/my-course', 'routes/my-course.tsx'),
  route('/library', 'routes/library.tsx')
] satisfies RouteConfig
