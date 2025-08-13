// Router 统一管理入口
import { createDynamicRouteManager, createRouteUtils, sortRoutes } from '@/router/utils/common'
import { autoImportModulesSync, env } from '@/utils'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { registerRouterGuards } from './utils/helper'

// 自动导入所有路由模块
const routeModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedRoutes = autoImportModulesSync<RouteConfig[]>(routeModules)

// 将所有路由模块合并为一个数组并排序
const staticRoutes: RouteConfig[] = (Object.values(importedRoutes).flat() as any[]).filter(
  (r): r is RouteConfig => r && typeof r.path === 'string'
)
const sortedStaticRoutes: RouteConfig[] = sortRoutes(staticRoutes)

// 创建路由工具集（用于菜单渲染、面包屑等）
export const routeUtils = createRouteUtils(sortedStaticRoutes)

// 转换为 Vue Router 兼容格式
const initialRoutes: RouteRecordRaw[] = sortedStaticRoutes.map(route => route as RouteRecordRaw)

// 创建路由实例
const router = createRouter({
  // history 模式
  history: createWebHistory(env.publicPath),
  // history: createWebHashHistory(env.publicPath),
  routes: initialRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 创建动态路由管理器
export const dynamicRouteManager = createDynamicRouteManager(router)

// 注册路由
registerRouterGuards({ router, debug: env.debug, routeUtils })

export default router
