/* 注册路由 */
import type { Router } from 'vue-router'
import { createDynamicRouteManager } from './common'

// 创建路由管理器

// 注册路由守卫
export const registerRouterGuards = (router: Router) => {
  const dynamicRouteManager = createDynamicRouteManager(router)
  console.log('🪒 创建路由工具', dynamicRouteManager)

  return dynamicRouteManager
}
