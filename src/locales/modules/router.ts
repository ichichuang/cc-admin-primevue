/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 国际化
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 路由配置模块语言配置
 */
import type { RouterLocaleMessages } from '../types'

/** 中文配置 */
export const routerZhCN: RouterLocaleMessages = {
  core: {
    login: '登录',
  },
  dashboard: {
    dashboard: '仪表盘',
  },
  example: {
    example: '示例',
    animate: '动画组件',
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
    login: 'Login',
  },
  dashboard: {
    dashboard: 'Dashboard',
  },
  example: {
    example: 'Example',
    animate: 'Animate Component',
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
    login: '登錄',
  },
  dashboard: {
    dashboard: '儀表板',
  },
  example: {
    example: '示例',
    animate: '動畫組件',
  },
  error: {
    notFound: '頁面未找到',
    forbidden: '訪問被拒絕',
    serverError: '服務器錯誤',
  },
}
