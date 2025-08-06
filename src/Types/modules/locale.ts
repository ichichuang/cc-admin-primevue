/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 多语言类型声明
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 声明全局类型
declare global {
  /** 多语言状态接口 */
  interface LocaleState {
    locale: SupportedLocale
    loading: boolean
  }
}

// 导出空对象使其成为外部模块
export {}
