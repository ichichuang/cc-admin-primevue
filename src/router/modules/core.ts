/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 路由管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

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
