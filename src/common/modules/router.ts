import {
  errorPagesNameList,
  errorPagesPathList,
  routeWhiteNameList,
  routeWhitePathList,
} from '@/constants'
import router, { routeUtils } from '@/router'
import { env } from '@/utils'
import type { LocationQueryRaw, RouteLocationNormalized } from 'vue-router'

// ================= 默认变量 =================
export { errorPagesNameList, errorPagesPathList, routeWhiteNameList, routeWhitePathList }

// ================= 通用方法 =================

/**
 * @返回上一页
 * 智能返回功能，如果有历史记录则返回上一页，否则跳转到首页
 */
export const goBack = (): void => {
  if (history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}

/**
 * 获取扁平化的路由列表
 * @param menuList - 菜单列表，默认使用系统路由
 */
export const getFlatRouteList = (menuList?: any[]): any[] => {
  const routes = menuList || router.getRoutes()
  if (!Array.isArray(routes)) {
    return []
  }
  const addPath = (parent: any, children: any[]): any[] =>
    children.map(child => ({ ...child, path: `${parent.path}/${child.path}`.replace(/\/+/g, '/') }))
  return routes.flatMap(item => [
    item,
    ...(item.children ? getFlatRouteList(addPath(item, item.children as any[])) : []),
  ])
}

/**
 * 根据路由名称获取路由信息
 */
export const getRouteByName = (name?: string): any[] => {
  const parseNameFromURL = (): string => {
    const urlPath = location.pathname
    const pathSegments = urlPath.split('/').filter(Boolean)
    return pathSegments[pathSegments.length - 1] || ''
  }
  name = name || parseNameFromURL()
  const flatRoutes = getFlatRouteList()
  return flatRoutes.filter(
    route => typeof route.name === 'string' && route.name?.toLowerCase() === name?.toLowerCase()
  )
}

/**
 * 根据路径获取路由信息
 */
export const getRouteByPath = (path: string): any | null => {
  const flatRoutes = getFlatRouteList()
  return flatRoutes.find(route => route.path === path) || null
}

/**
 * 跳转到指定路由
 */
export const goToRoute = (
  name?: string | null,
  query?: LocationQueryRaw,
  newWindow = false,
  checkPermission = false
): void => {
  if (!name) {
    router.push(env.rootRedirect)
    return
  }
  if (router.currentRoute.value.name === name) {
    return
  }
  const targetRoutes = getRouteByName(name)
  if (targetRoutes.length === 0) {
    try {
      router.push(name)
    } catch {
      console.warn(`路由 "${name}" 未找到`)
      return
    }
  }
  const targetRoute = targetRoutes[0]
  // 权限检查（如需集成可在此处）
  if (checkPermission) {
    // ...
  }
  if (newWindow) {
    const location = window.location
    const path = location.origin + '/#' + targetRoute.path
    window.open(path, '_blank')
  } else {
    router.push({ path: targetRoute.path, query })
  }
}

/**
 * 动态更新路由信息
 */
export const updateRoute = (name: string, keyPath: string, value: unknown): void => {
  const targetRoutes = getRouteByName(name)
  const index = targetRoutes.findIndex(item => item.name === name)
  if (index === -1) {
    console.warn(`路由 "${name}" 未找到，无法更新`)
    return
  }
  const targetRoute = targetRoutes[index]
  const keys = keyPath.split('.')
  let current: any = targetRoute
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!current[key]) {
      current[key] = {}
    }
    current = current[key]
  }
  current[keys[keys.length - 1]] = value
  // 更新路由注册表
  const allRoutes = router.getRoutes()
  allRoutes.forEach(route => {
    if (route.name === name) {
      Object.assign(route, targetRoute)
    }
  })
}

/**
 * 获取路由面包屑路径
 */
export const getBreadcrumbByRoute = (name?: string): string[] => {
  const currentRouteName = name || (router.currentRoute.value.name as string)
  if (!currentRouteName) {
    return []
  }
  const currentPath = router.currentRoute.value.path
  const breadcrumbMap = routeUtils.breadcrumbMap
  if (breadcrumbMap.has(currentPath)) {
    return breadcrumbMap.get(currentPath) || []
  }
  // fallback
  const allRoutes = router.getRoutes()
  const breadcrumbPaths: string[] = []
  if (currentRouteName.includes('-')) {
    const parts = currentRouteName.split('-')
    let currentRouteNameBuilder = ''
    parts.forEach(part => {
      currentRouteNameBuilder = currentRouteNameBuilder
        ? `${currentRouteNameBuilder}-${part}`
        : part
      const matchedRoute = allRoutes.find(r => r.name === currentRouteNameBuilder)
      if (matchedRoute && matchedRoute.meta?.title) {
        breadcrumbPaths.push(matchedRoute.meta.title as string)
      }
    })
    return breadcrumbPaths.length > 0 ? breadcrumbPaths : [currentRouteName]
  }
  const currentRoute = allRoutes.find(r => r.name === currentRouteName)
  if (currentRoute && currentRoute.meta?.title) {
    return [currentRoute.meta.title as string]
  }
  return [currentRouteName]
}

/**
 * 获取菜单树结构
 */
export const getMenuTree = (): MenuItem[] => {
  return routeUtils.menuTree
}

/**
 * 根据权限过滤菜单
 */
export const getAuthorizedMenuTree = (userRoles: string[], menuTree?: MenuItem[]): MenuItem[] => {
  const menus = menuTree || getMenuTree()
  return menus.filter(menu => {
    if (menu.roles && menu.roles.length > 0) {
      const hasPermission = menu.roles.some(role => userRoles.includes(role))
      if (!hasPermission) {
        return false
      }
    }
    if (menu.children && menu.children.length > 0) {
      menu.children = getAuthorizedMenuTree(userRoles, menu.children)
    }
    return true
  })
}

/**
 * 检查当前路由权限
 */
export const checkCurrentRoutePermission = (userRoles: string[], routeName?: string): boolean => {
  const targetRouteName = routeName || (router.currentRoute.value.name as string)
  if (!targetRouteName) {
    return true
  }
  const targetRoutes = getRouteByName(targetRouteName)
  if (targetRoutes.length === 0) {
    return true
  }
  const targetRoute = targetRoutes[0]
  const roles = targetRoute.meta?.roles as string[] | undefined
  if (!roles || roles.length === 0) {
    return true
  }
  return roles.some(role => userRoles.includes(role))
}

/**
 * 获取路由的完整信息（包含增强的 meta 信息）
 */
export const getRouteConfig = (name: string): RouteConfig | null => {
  const flatRoutes = routeUtils.flatRoutes
  return flatRoutes.find(route => route.name === name) || null
}

/**
 * 获取当前路由信息
 */
export const getCurrentRoute = (): RouteLocationNormalized => {
  return router.currentRoute.value
}

/**
 * 获取当前路由的 Meta 信息
 */
export const getCurrentRouteMeta = (): Record<string, any> => {
  return router.currentRoute.value.meta || {}
}

/**
 * 判断路由是否为外链
 */
export const isExternalLink = (routeName: string): boolean => {
  const routeConfig = getRouteConfig(routeName)
  return routeConfig?.meta?.isLink === true
}

/**
 * 获取外链地址
 */
export const getExternalLinkUrl = (routeName: string): string | null => {
  const routeConfig = getRouteConfig(routeName)
  return routeConfig?.meta?.linkUrl || null
}

/**
 * 刷新当前路由
 */
export const refreshCurrentRoute = (): void => {
  router.go(0)
}

/**
 * 替换当前路由（不会在历史记录中留下记录）
 */
export const replaceRoute = (path: string, query?: LocationQueryRaw): void => {
  router.replace({ path, query })
}

/**
 * 获取路由历史记录数量
 */
export const getHistoryLength = (): number => {
  return history.length
}

/**
 * 检查当前是否在指定路由
 */
export const isCurrentRoute = (name: string): boolean => {
  const currentRouteName = router.currentRoute.value.name as string
  return currentRouteName === name
}
