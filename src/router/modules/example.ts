const exampleRoutes: RouteConfig[] = [
  {
    path: '/example',
    name: 'Example',
    component: () => import('@/views/example/index.vue'),
    meta: {
      titleKey: 'router.example.title',
      rank: 1,
      icon: 'icon-line-md:marker-filled',
    },
    children: [
      {
        path: 'layout',
        name: 'ExampleLayout',
        meta: {
          titleKey: 'router.example.layout.title',
          rank: 2,
          icon: 'icon-line-md:folder-filled',
        },
        children: [
          {
            path: 'screen',
            name: 'ExampleLayoutScreen',
            component: () => import('@/views/example/layout/example-screen.vue'),
            meta: {
              titleKey: 'router.example.layout.screen',
              rank: 1,
              parent: 'screen',
              icon: 'icon-line-md:monitor-screenshot-twotone',
            },
          },
          {
            path: 'fullscreen',
            name: 'ExampleLayoutFullscreen',
            component: () => import('@/views/example/layout/example-fullscreen.vue'),
            meta: {
              titleKey: 'router.example.layout.fullscreen',
              rank: 1,
              parent: 'fullscreen',
              icon: 'icon-line-md:monitor-twotone',
            },
          },
          {
            path: 'test',
            name: 'ExampleLayoutTest',
            component: () => import('@/views/example/layout/example-test.vue'),
            meta: {
              titleKey: 'router.example.layout.test',
              rank: 3,
              parent: 'fullscreen',
              icon: 'icon-line-md:clipboard-check-twotone-to-clipboard-twotone-transition',
            },
          },
          {
            path: 'ratio',
            name: 'ExampleLayoutRatio',
            component: () => import('@/views/example/layout/example-ratio.vue'),
            meta: {
              titleKey: 'router.example.layout.ratio',
              rank: 4,
              parent: 'ratio',
              icon: 'icon-line-md:monitor-twotone',
              ratio: '16:9',
            },
          },
        ],
      },
      {
        path: 'components',
        name: 'ExampleComponents',
        meta: {
          titleKey: 'router.example.components.title',
          rank: 1,
          icon: 'icon-line-md:beer-alt-filled-loop',
        },
        children: [
          {
            path: 'menu',
            name: 'ExampleComponentsMenu',
            component: () => import('@/views/example/views/example-menu.vue'),
            meta: {
              titleKey: 'router.example.components.menu',
              rank: 1,
              icon: 'icon-line-md:list',
            },
          },
          {
            path: 'dialog',
            name: 'ExampleComponentsDialog',
            component: () => import('@/views/example/views/example-dialog.vue'),
            meta: {
              titleKey: 'router.example.components.dialog',
              rank: 2,
              icon: 'icon-line-md:chevron-up-square-twotone',
            },
          },
        ],
      },
    ],
  },
]

export default exampleRoutes
