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
        path: 'screen',
        name: 'ExampleScreen',
        component: () => import('@/views/example/views/example-screen.vue'),
        meta: {
          titleKey: 'router.example.screen',
          rank: 1,
          parent: 'screen',
        },
      },
      {
        path: 'fullscreen',
        name: 'ExampleFullscreen',
        component: () => import('@/views/example/views/example-fullscreen.vue'),
        meta: {
          titleKey: 'router.example.fullscreen',
          rank: 1,
          parent: 'fullscreen',
        },
      },
      {
        path: 'test',
        name: 'ExampleTest',
        component: () => import('@/views/example/views/example-test.vue'),
        meta: {
          titleKey: 'router.example.test',
          rank: 3,
          parent: 'fullscreen',
        },
      },
    ],
  },
]

export default exampleRoutes
