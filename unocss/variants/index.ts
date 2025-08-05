/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - variants
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { themeConfig } from '../utils/theme'

/**
 * 自定义变体 - 只保留实际使用的
 */
export const variants = [
  // 深色模式变体
  matcher => {
    if (!matcher.startsWith('dark:')) {
      return matcher
    }
    return {
      matcher: matcher.slice(5),
      selector: s => `.dark ${s}`,
    }
  },

  // 悬停变体
  matcher => {
    if (!matcher.startsWith('hover:')) {
      return matcher
    }
    return {
      matcher: matcher.slice(6),
      selector: s => `${s}:hover`,
    }
  },

  // 焦点变体
  matcher => {
    if (!matcher.startsWith('focus:')) {
      return matcher
    }
    return {
      matcher: matcher.slice(6),
      selector: s => `${s}:focus`,
    }
  },

  // 激活变体
  matcher => {
    if (!matcher.startsWith('active:')) {
      return matcher
    }
    return {
      matcher: matcher.slice(7),
      selector: s => `${s}:active`,
    }
  },

  // 🎯 响应式断点变体 - 确保与 rem 适配系统断点一致
  matcher => {
    const breakpointVariants = ['xs:', 'sm:', 'md:', 'lg:', 'xl:', 'xls:', 'xxl:', 'xxxl:']
    for (const variant of breakpointVariants) {
      if (matcher.startsWith(variant)) {
        return {
          matcher: matcher.slice(variant.length),
          selector: s =>
            `@media (min-width: ${themeConfig.breakpoints[variant.slice(0, -1)]}) { ${s} }`,
        }
      }
    }
    return matcher
  },
]
