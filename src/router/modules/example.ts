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
            },
          },
          {
            path: 'dialog',
            name: 'ExampleComponentsDialog',
            component: () => import('@/views/example/views/example-dialog.vue'),
            meta: {
              titleKey: 'router.example.components.dialog',
              rank: 2,
            },
          },
          {
            path: 'toast',
            name: 'ExampleComponentsToast',
            component: () => import('@/views/example/views/example-toast.vue'),
            meta: {
              titleKey: 'router.example.components.toast',
              rank: 3,
            },
          },
          {
            path: 'schema-form',
            name: 'ExampleComponentsSchemaForm',
            meta: {
              titleKey: 'router.example.components.schemaForm.title',
              rank: 4,
              icon: 'icon-line-md:text-box',
            },
            children: [
              {
                path: 'basic',
                name: 'ExampleComponentsSchemaFormBasic',
                component: () =>
                  import('@/views/example/views/example-shema-form/example-schema-form-basic.vue'),
                meta: {
                  titleKey: 'router.example.components.schemaForm.basic',
                  rank: 1,
                  icon: 'icon-line-md:text-box',
                  keepAlive: true,
                },
              },
              {
                path: 'step',
                name: 'ExampleComponentsSchemaFormStep',
                component: () =>
                  import('@/views/example/views/example-shema-form/example-schema-form-step.vue'),
                meta: {
                  titleKey: 'router.example.components.schemaForm.step',
                  rank: 2,
                  icon: 'icon-line-md:text-box',
                },
              },
              {
                path: 'section',
                name: 'ExampleComponentsSchemaFormSection',
                component: () =>
                  import(
                    '@/views/example/views/example-shema-form/example-schema-form-section.vue'
                  ),
                meta: {
                  titleKey: 'router.example.components.schemaForm.section',
                  rank: 3,
                  icon: 'icon-line-md:text-box',
                },
              },
            ],
          },
          {
            path: 'grid-table',
            name: 'ExampleComponentsGridTable',
            meta: {
              titleKey: 'router.example.components.gridTable.title',
              rank: 5,
              icon: 'icon-line-md:telegram',
            },
            children: [
              {
                path: 'default',
                name: 'ExampleComponentsGridTableDefault',
                component: () =>
                  import('@/views/example/views/example-grid-table/example-grid-table-default.vue'),
                meta: {
                  titleKey: 'router.example.components.gridTable.default',
                  rank: 1,
                  icon: 'icon-line-md:telegram',
                },
              },
              {
                path: 'basic',
                name: 'ExampleComponentsGridTableBasic',
                component: () =>
                  import('@/views/example/views/example-grid-table/example-grid-table-basic.vue'),
                meta: {
                  titleKey: 'router.example.components.gridTable.basic',
                  rank: 2,
                  icon: 'icon-line-md:telegram',
                },
              },
              {
                path: 'service',
                name: 'ExampleComponentsGridTableService',
                component: () =>
                  import('@/views/example/views/example-grid-table/example-grid-table-service.vue'),
                meta: {
                  titleKey: 'router.example.components.gridTable.service',
                  rank: 3,
                  icon: 'icon-line-md:telegram',
                },
              },
            ],
          },
          {
            path: 'echarts',
            name: 'ExampleComponentsEcharts',
            component: () => import('@/views/example/views/example-echarts.vue'),
            meta: {
              titleKey: 'router.example.components.echarts',
              rank: 6,
              icon: 'icon-line-md:telegram',
            },
          },
        ],
      },
    ],
  },
]

export default exampleRoutes
