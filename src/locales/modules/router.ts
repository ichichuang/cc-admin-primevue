/**
 * 路由配置模块语言配置
 */
import type { RouterLocaleMessages } from '@/locales/types/modules/router'

/** 中文配置 */
export const routerZhCN: RouterLocaleMessages = {
  core: {
    root: '首页',
    login: '登录',
  },
  dashboard: {
    dashboard: '仪表盘',
  },
  example: {
    example: '示例',
    screen: '屏幕',
    fullscreen: '全屏',
  },
  error: {
    notFound: '页面未找到',
    forbidden: '访问被拒绝',
    serverError: '服务器错误',
  },
}

/** 英文配置 */
export const routerEnUS: RouterLocaleMessages = {
  core: {
    root: 'Home',
    login: 'Login',
  },
  dashboard: {
    dashboard: 'Dashboard',
  },
  example: {
    example: 'Example',
    fullscreen: 'Fullscreen',
    screen: 'Screen',
  },
  error: {
    notFound: 'Page Not Found',
    forbidden: 'Forbidden',
    serverError: 'Server Error',
  },
}

/** 繁体中文配置 */
export const routerZhTW: RouterLocaleMessages = {
  core: {
    root: '首頁',
    login: '登錄',
  },
  dashboard: {
    dashboard: '儀表板',
  },
  example: {
    example: '示例',
    fullscreen: '全屏',
    screen: '屏幕',
  },
  error: {
    notFound: '頁面未找到',
    forbidden: '訪問被拒絕',
    serverError: '服務器錯誤',
  },
}
