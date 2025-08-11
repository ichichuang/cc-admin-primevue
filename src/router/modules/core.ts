const coreRoutes: RouteConfig[] = [
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
