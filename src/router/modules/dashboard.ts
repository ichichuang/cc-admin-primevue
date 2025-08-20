const homeRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      titleKey: 'router.dashboard.dashboard',
      rank: 1,
      roles: ['admin', 'user'],
      icon: 'icon-line-md:speed-twotone',
    },
  },
]

export default homeRoutes
