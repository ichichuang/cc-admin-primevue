import { env } from '@/utils'
const coreRoutes: RouteConfig[] = [
  {
    path: '/',
    name: 'Root',
    redirect: env.rootRedirect,
    meta: {
      titleKey: 'router.core.root',
      rank: 0,
      showLink: false,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      titleKey: 'router.core.login',
      rank: 1,
      parent: 'fullscreen',
    },
  },
]

export default coreRoutes
