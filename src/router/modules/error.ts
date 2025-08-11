const errorRoutes: RouteConfig[] = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/notfound/not-found-page.vue'),
    meta: {
      titleKey: 'router.error.notFound',
      showLink: false,
      parent: 'fullscreen',
    },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/notfound/forbidden-page.vue'),
    meta: {
      titleKey: 'router.error.forbidden',
      showLink: false,
      parent: 'fullscreen',
    },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/notfound/server-error-page.vue'),
    meta: {
      titleKey: 'router.error.serverError',
      showLink: false,
      parent: 'fullscreen',
    },
  },
  // 捕获所有未匹配的路由，重定向到404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'CatchAll',
    redirect: '/404',
  },
]

export default errorRoutes
