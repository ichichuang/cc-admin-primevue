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
  {
    path: '/dashboards',
    name: 'Dashboards',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      icon: 'icon-line-md:speed-twotone',
      titleKey: 'router.dashboard.dashboard',
    },
    children: [
      {
        path: 'dashboards1',
        name: 'Dashboards1',
        meta: {
          title: 'Dashboards1',
        },
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: 'dashboards2',
        name: 'Dashboards2',
        meta: {
          title: 'Dashboards2',
        },
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: 'dashboards3',
        name: 'Dashboards3',
        meta: {
          title: 'Dashboards3',
        },
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: 'dashboards4',
        name: 'Dashboards4',
        meta: {
          title: 'Dashboards4',
        },
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: 'dashboards5',
        name: 'Dashboards5',
        meta: {
          title: 'Dashboards5',
        },
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: 'dashboards6',
        name: 'Dashboards6',
        meta: {
          title: 'Dashboards6',
        },
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: 'dashboards7',
        name: 'Dashboards7',
        meta: {
          title: 'Dashboards7',
        },
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: 'dashboards8',
        name: 'Dashboards8',
        meta: {
          title: 'Dashboards8',
        },
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: 'dashboards9',
        name: 'Dashboards9',
        meta: {
          title: 'Dashboards9',
        },
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: 'dashboards10',
        name: 'Dashboards10',
        meta: {
          title: 'Dashboards10',
        },
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: 'dashboards11',
        name: 'Dashboards11',
        meta: {
          title: 'Dashboards11',
        },
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: 'dashboards12',
        name: 'Dashboards12',
        meta: {
          title: 'Dashboards12',
        },
        component: () => import('@/views/dashboard/index.vue'),
      },
    ],
  },
]

export default homeRoutes
