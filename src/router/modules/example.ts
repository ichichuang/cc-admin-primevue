/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 路由管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

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
