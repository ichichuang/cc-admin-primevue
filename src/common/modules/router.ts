import {
  errorPagesNameList,
  errorPagesPathList,
  routeWhiteNameList,
  routeWhitePathList,
} from '@/constants'
import router, { routeUtils } from '@/router'
import { usePermissionStore } from '@/stores'
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

  const result: any[] = []

  const flattenRoutes = (routeList: any[], parentPath = '') => {
    routeList.forEach(route => {
      // 创建当前路由的副本
      const currentRoute = { ...route }

      // 如果有父路径，则拼接路径
      if (parentPath) {
        currentRoute.path = `${parentPath}/${route.path}`.replace(/\/+/g, '/')
      }

      // 添加到结果数组
      result.push(currentRoute)

      // 如果有子路由，递归处理
      if (route.children && route.children.length > 0) {
        flattenRoutes(route.children, currentRoute.path)
      }
    })
  }

  flattenRoutes(routes)
  return result
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
 * @param name - 路由名称
 * @param query - 查询参数
 * @param newWindow - 是否强制新窗口打开（可选，默认根据路由parent属性自动判断）
 * @param checkPermission - 是否检查权限
 */
export const goToRoute = (
  name?: string | null,
  query?: LocationQueryRaw,
  newWindow?: boolean,
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

  // 外链处理：优先根据 meta.isLink/linkUrl 处理
  const isLink = targetRoute?.meta?.isLink === true
  const linkUrl = targetRoute?.meta?.linkUrl as string | undefined
  if (isLink) {
    const url = linkUrl || targetRoute.path
    try {
      window.open(url, '_blank')
    } catch {
      console.warn('外链打开失败：', url)
    }
    return
  }

  // 权限检查（如需集成可在此处）
  if (checkPermission) {
    // ...
  }

  // 判断是否需要新窗口打开
  // 1. 如果明确指定了 newWindow 参数，则按指定值执行
  // 2. 如果未指定，则根据路由的 parent 属性自动判断
  let shouldOpenNewWindow = newWindow

  if (!newWindow) {
    // 获取路由的 parent 属性，默认为 'admin'
    const parent = (targetRoute.meta?.parent as LayoutMode) || 'admin'

    // screen 和 fullscreen 模式需要新窗口打开
    shouldOpenNewWindow = parent === 'screen' || parent === 'fullscreen' || parent === 'ratio'
  }

  if (shouldOpenNewWindow) {
    if (env.routerMode === 'hash') {
      const location = window.location
      const path = location.origin + '/#' + targetRoute.path
      window.open(path, '_blank')
    } else {
      window.open(targetRoute.path, '_blank')
    }
    // window.open(path, '_blank')
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
 * 获取菜单树结构
 */
export const getMenuTree = (): MenuItem[] => {
  return routeUtils.menuTree
}

/**
 * 获取扁平化菜单树结构
 */
export const getFlatMenuTree = (): any[] => {
  return getFlatRouteList().filter(route => route.meta?.showLink !== false)
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

/**
 * 获取路由的完整路径（包含父级路径）
 * @param route 路由配置
 * @returns 完整的路径字符串
 */
export function getFullRoutePath(route: RouteConfig): string {
  if (!route.meta?.parentPaths || route.meta.parentPaths.length === 0) {
    return route.path
  }

  // 拼接父级路径和当前路径
  const parentPath = route.meta.parentPaths.join('')
  return `${parentPath}${route.path}`.replace(/\/+/g, '/')
}

/**
 * 检查路由是否为叶子节点（最底层路由）
 * @param route 路由配置
 * @returns 是否为叶子节点
 */
export function isLeafRoute(route: RouteConfig): boolean {
  return !route.children || route.children.length === 0
}

/**
 * 获取所有叶子节点路由
 * @param routes 路由配置数组
 * @returns 所有叶子节点路由数组
 */
export function getLeafRoutes(routes: RouteConfig[]): RouteConfig[] {
  const leafRoutes: RouteConfig[] = []

  function collectLeafRoutes(routeList: RouteConfig[]) {
    routeList.forEach(route => {
      if (isLeafRoute(route)) {
        leafRoutes.push(route)
      } else if (route.children) {
        collectLeafRoutes(route.children)
      }
    })
  }

  collectLeafRoutes(routes)
  return leafRoutes
}

/**
 * 获取全部路由列表
 */
export function getAllRoutes(): RouteConfig[] {
  const permissionStore = usePermissionStore()
  return permissionStore.getAllRoutes as RouteConfig[]
}
