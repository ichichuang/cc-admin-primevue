const exampleRoutes: RouteConfig[] = [
  {
    path: '/example',
    name: 'Example',
    component: () => import('@/views/example/index.vue'),
    meta: {
      titleKey: 'router.example.example',
      rank: 1,
      parent: 'fullscreen',
    },
  },
  {
    path: '/example/animate',
    name: 'ExampleAnimate',
    component: () => import('@/views/example/animate-example.vue'),
    meta: {
      titleKey: 'router.example.animate',
      rank: 2,
      parent: 'fullscreen',
    },
  },
]

export default exampleRoutes
