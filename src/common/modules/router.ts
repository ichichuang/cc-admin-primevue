import router, { routeUtils } from '@/router'
import { env } from '@/utils'
import type { LocationQueryRaw, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

/**
 * @返回上一页
 *
 * @description 智能返回功能，如果有历史记录则返回上一页，否则跳转到首页
 * @returns void
 * @example
 * // 在组件中使用
 * goBack() // 返回上一页或首页
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
 *
 * @description 将嵌套的路由结构扁平化为一维数组，便于遍历和查找
 * @param menuList - 菜单列表，默认使用系统路由
 * @returns 扁平化的路由数组
 * @example
 * // 获取所有路由的扁平化列表
 * const flatRoutes = getFlatRouteList()
 * // 处理自定义菜单列表
 * const customFlatRoutes = getFlatRouteList(customMenuList)
 */
export const getFlatRouteList = (menuList?: RouteRecordRaw[]): RouteRecordRaw[] => {
  const routes = menuList || router.getRoutes()

  if (!Array.isArray(routes)) {
    return []
  }

  const addPath = (parent: RouteRecordRaw, children: RouteRecordRaw[]): RouteRecordRaw[] =>
    children.map(child => ({
      ...child,
      path: `${parent.path}/${child.path}`.replace(/\/+/g, '/'),
    }))

  return routes.flatMap(item => [
    item,
    ...(item.children ? getFlatRouteList(addPath(item, item.children as RouteRecordRaw[])) : []),
  ])
}

/**
 * 根据路由名称获取路由信息
 *
 * @description 通过路由名称查找对应的路由配置，支持从当前 URL 自动提取名称
 * @param name - 路由名称，如果不提供则从当前 URL 提取
 * @returns 匹配的路由数组
 * @example
 * // 根据名称查找路由
 * const routes = getRouteByName('dashboard')
 * // 从当前 URL 自动提取名称
 * const currentRoutes = getRouteByName()
 */
export const getRouteByName = (name?: string): RouteRecordRaw[] => {
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
 *
 * @description 通过路由路径查找对应的路由配置
 * @param path - 路由路径
 * @returns 匹配的路由信息，未找到则返回 null
 * @example
 * // 根据路径查找路由
 * const route = getRouteByPath('/user/profile')
 * if (route) {
 *   console.log('找到路由:', route.name)
 * }
 */
export const getRouteByPath = (path: string): RouteRecordRaw | null => {
  const flatRoutes = getFlatRouteList()
  return flatRoutes.find(route => route.path === path) || null
}

/**
 * 跳转到指定路由
 *
 * @description 智能路由跳转功能，支持权限检查和新窗口打开
 * @param name - 路由名称
 * @param query - 查询参数
 * @param newWindow - 是否新开窗口，默认 false
 * @param checkPermission - 是否检查权限，默认 false
 * @returns void
 * @example
 * // 基础跳转
 * goToRoute('dashboard')
 * // 带参数跳转
 * goToRoute('user', { id: 123 })
 * // 新窗口打开
 * goToRoute('external', {}, true)
 * // 带权限检查
 * goToRoute('admin', {}, false, true)
 */
export const goToRoute = (
  name?: string | null,
  query?: LocationQueryRaw,
  newWindow = false,
  checkPermission = false
): void => {
  // 如果目标路由名称为空，跳转到首页
  if (!name) {
    router.push(env.rootRedirect)
    return
  }

  // 如果当前路由就是目标路由，直接返回
  if (router.currentRoute.value.name === name) {
    return
  }

  const targetRoutes = getRouteByName(name)
  if (targetRoutes.length === 0) {
    // 尝试 path 跳转
    console.log('name', name)
    try {
      router.push(name)
    } catch {
      console.warn(`路由 "${name}" 未找到`)
      return
    }
  }

  const targetRoute = targetRoutes[0]

  // 权限检查
  if (checkPermission) {
    // 这里可以集成用户权限检查逻辑
    // const userStore = useUserStore()
    // const userRoles = userStore.roles || []
    // const hasPermission = checkRoutePermission(targetRoute, userRoles)
    // if (!hasPermission) {
    //   console.warn(`没有权限访问路由 "${name}"`)
    //   return
    // }
  }

  // 跳转逻辑
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
 *
 * @description 在运行时动态修改路由的配置信息，如标题、权限等
 * @param name - 路由名称
 * @param keyPath - 键路径（例如：meta.title、name）
 * @param value - 新值
 * @returns void
 * @example
 * // 更新路由标题
 * updateRoute('dashboard', 'meta.title', '新的仪表板')
 * // 更新路由权限
 * updateRoute('admin', 'meta.roles', ['admin', 'super'])
 * // 更新路由名称
 * updateRoute('user', 'name', 'new-user')
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

  // 遍历键路径，创建嵌套对象结构
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!current[key]) {
      current[key] = {}
    }
    current = current[key]
  }

  // 设置最终值
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
 *
 * @description 根据当前路由生成面包屑导航路径，支持多级嵌套路由
 * @param name - 路由名称，默认使用当前路由
 * @returns 面包屑路径数组
 * @example
 * // 获取当前路由的面包屑
 * const breadcrumbs = getBreadcrumbByRoute()
 * // 获取指定路由的面包屑
 * const userBreadcrumbs = getBreadcrumbByRoute('user-profile')
 */
export const getBreadcrumbByRoute = (name?: string): string[] => {
  const currentRouteName = name || (router.currentRoute.value.name as string)

  if (!currentRouteName) {
    return []
  }

  // 优先使用我们的面包屑映射
  const currentPath = router.currentRoute.value.path
  const breadcrumbMap = routeUtils.breadcrumbMap

  if (breadcrumbMap.has(currentPath)) {
    return breadcrumbMap.get(currentPath) || []
  }

  // 回退到原有的逻辑处理
  const allRoutes = router.getRoutes()
  const breadcrumbPaths: string[] = []

  // 处理包含分隔符"-"的路由名称
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

  // 处理普通路由名称
  const currentRoute = allRoutes.find(r => r.name === currentRouteName)
  if (currentRoute && currentRoute.meta?.title) {
    return [currentRoute.meta.title as string]
  }

  return [currentRouteName]
}

/**
 * 获取菜单树结构
 *
 * @description 获取系统完整的菜单树结构，用于侧边栏导航渲染
 * @returns 菜单树数组
 * @example
 * // 获取菜单树用于渲染侧边栏
 * const menuTree = getMenuTree()
 * // 在组件中使用
 * <Sidebar :menu-tree="menuTree" />
 */
export const getMenuTree = (): MenuItem[] => {
  return routeUtils.menuTree
}

/**
 * 根据权限过滤菜单
 *
 * @description 根据用户角色过滤菜单项，只显示用户有权限访问的菜单
 * @param userRoles - 用户角色数组
 * @param menuTree - 菜单树，默认使用系统菜单
 * @returns 过滤后的菜单树
 * @example
 * // 根据用户角色过滤菜单
 * const userRoles = ['admin', 'user']
 * const authorizedMenu = getAuthorizedMenuTree(userRoles)
 * // 使用自定义菜单树
 * const customAuthorizedMenu = getAuthorizedMenuTree(userRoles, customMenuTree)
 */
export const getAuthorizedMenuTree = (userRoles: string[], menuTree?: MenuItem[]): MenuItem[] => {
  const menus = menuTree || getMenuTree()

  return menus.filter(menu => {
    // 检查当前菜单项权限
    if (menu.roles && menu.roles.length > 0) {
      const hasPermission = menu.roles.some(role => userRoles.includes(role))
      if (!hasPermission) {
        return false
      }
    }

    // 递归过滤子菜单
    if (menu.children && menu.children.length > 0) {
      menu.children = getAuthorizedMenuTree(userRoles, menu.children)
    }

    return true
  })
}

/**
 * 检查当前路由权限
 *
 * @description 检查用户是否有权限访问当前路由或指定路由
 * @param userRoles - 用户角色数组
 * @param routeName - 路由名称，默认使用当前路由
 * @returns 是否有权限
 * @example
 * // 检查当前路由权限
 * const hasPermission = checkCurrentRoutePermission(['admin', 'user'])
 * // 检查指定路由权限
 * const canAccessAdmin = checkCurrentRoutePermission(['admin'], 'admin-panel')
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

  // 如果没有设置权限要求，则允许访问
  if (!roles || roles.length === 0) {
    return true
  }

  // 检查用户角色是否匹配
  return roles.some(role => userRoles.includes(role))
}

/**
 * 获取路由的完整信息（包含增强的 meta 信息）
 *
 * @description 获取路由的完整配置信息，包括增强的 meta 数据
 * @param name - 路由名称
 * @returns 路由配置信息，未找到则返回 null
 * @example
 * // 获取路由完整配置
 * const routeConfig = getRouteConfig('dashboard')
 * if (routeConfig) {
 *   console.log('路由标题:', routeConfig.meta?.title)
 *   console.log('路由权限:', routeConfig.meta?.roles)
 * }
 */
export const getRouteConfig = (name: string): RouteConfig | null => {
  const flatRoutes = routeUtils.flatRoutes
  return flatRoutes.find(route => route.name === name) || null
}

/**
 * 获取当前路由信息
 *
 * @description 获取当前激活路由的完整信息，包括路径、参数、查询等
 * @returns 当前路由的完整信息
 * @example
 * // 获取当前路由信息
 * const currentRoute = getCurrentRoute()
 * console.log('当前路径:', currentRoute.path)
 * console.log('路由参数:', currentRoute.params)
 * console.log('查询参数:', currentRoute.query)
 */
export const getCurrentRoute = (): RouteLocationNormalized => {
  return router.currentRoute.value
}

/**
 * 获取当前路由的 Meta 信息
 *
 * @description 获取当前路由的 meta 配置信息
 * @returns 当前路由的 meta 配置
 * @example
 * // 获取当前路由的 meta 信息
 * const meta = getCurrentRouteMeta()
 * console.log('页面标题:', meta.title)
 * console.log('页面权限:', meta.roles)
 * console.log('是否缓存:', meta.keepAlive)
 */
export const getCurrentRouteMeta = (): Record<string, any> => {
  return router.currentRoute.value.meta || {}
}

/**
 * 判断路由是否为外链
 *
 * @description 检查指定路由是否为外部链接
 * @param routeName - 路由名称
 * @returns 是否为外链
 * @example
 * // 检查路由是否为外链
 * const isExternal = isExternalLink('github')
 * if (isExternal) {
 *   // 处理外链逻辑
 * }
 */
export const isExternalLink = (routeName: string): boolean => {
  const routeConfig = getRouteConfig(routeName)
  return routeConfig?.meta?.isLink === true
}

/**
 * 获取外链地址
 *
 * @description 获取指定路由的外链地址
 * @param routeName - 路由名称
 * @returns 外链地址，如果不是外链则返回 null
 * @example
 * // 获取外链地址
 * const externalUrl = getExternalLinkUrl('github')
 * if (externalUrl) {
 *   window.open(externalUrl, '_blank')
 * }
 */
export const getExternalLinkUrl = (routeName: string): string | null => {
  const routeConfig = getRouteConfig(routeName)
  return routeConfig?.meta?.linkUrl || null
}

/**
 * 刷新当前路由
 *
 * @description 刷新当前页面，相当于 F5 刷新
 * @returns void
 * @example
 * // 刷新当前页面
 * refreshCurrentRoute()
 */
export const refreshCurrentRoute = (): void => {
  router.go(0)
}

/**
 * 替换当前路由（不会在历史记录中留下记录）
 *
 * @description 替换当前路由，不会在浏览器历史记录中留下记录
 * @param path - 目标路径
 * @param query - 查询参数
 * @returns void
 * @example
 * // 替换当前路由
 * replaceRoute('/new-path')
 * // 带参数替换
 * replaceRoute('/user', { id: 123 })
 */
export const replaceRoute = (path: string, query?: LocationQueryRaw): void => {
  router.replace({ path, query })
}

/**
 * 获取路由历史记录数量
 *
 * @description 获取浏览器历史记录的数量
 * @returns 历史记录数量
 * @example
 * // 获取历史记录数量
 * const historyLength = getHistoryLength()
 * console.log('历史记录数量:', historyLength)
 */
export const getHistoryLength = (): number => {
  return history.length
}

/**
 * 检查当前是否在指定路由
 *
 * @description 检查当前路由名称是否与指定的路由名称匹配
 * @param name - 要检查的路由名称
 * @returns 如果当前在指定路由则返回 true，否则返回 false
 * @example
 * // 检查当前是否在仪表板页面
 * const isOnDashboard = isCurrentRoute('dashboard')
 * if (isOnDashboard) {
 *   console.log('当前在仪表板页面')
 * }
 *
 * // 检查当前是否在用户页面
 * const isOnUserPage = isCurrentRoute('user')
 * if (isOnUserPage) {
 *   // 执行用户页面相关逻辑
 * }
 */
export const isCurrentRoute = (name: string): boolean => {
  const currentRouteName = router.currentRoute.value.name as string
  return currentRouteName === name
}
