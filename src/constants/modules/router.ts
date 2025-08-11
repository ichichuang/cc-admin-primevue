/**
 * 路由白名单配置
 * 不需要登录验证的页面路径
 */
export const routeWhiteList = ['/login', '/register'] as const

/**
 * 错误页面配置
 * 系统错误页面的路径
 */
export const errorPages = ['/404', '/403', '/500'] as const
