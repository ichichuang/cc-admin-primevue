const exampleRoutes: RouteConfig[] = [
  {
    path: '/example',
    name: 'Example',
    component: () => import('@/views/example/index.vue'),
    meta: {
      titleKey: 'router.example.example',
      rank: 1,
    },
    children: [
      {
        path: 'example-screen',
        name: 'ExampleScreen',
        component: () => import('@/views/example/views/example-screen.vue'),
        meta: {
          titleKey: 'router.example.screen',
          rank: 1,
          parent: 'screen',
        },
      },
      {
        path: 'example-fullscreen',
        name: 'ExampleFullscreen',
        component: () => import('@/views/example/views/example-fullscreen.vue'),
        meta: {
          titleKey: 'router.example.fullscreen',
          rank: 1,
          parent: 'fullscreen',
        },
      },
    ],
  },
]

export default exampleRoutes
