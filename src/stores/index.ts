/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 状态管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// Stores 统一管理入口
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 创建 Pinia 实例并配置持久化插件
const store = createPinia()
store.use(piniaPluginPersistedstate)

// 导出默认store实例
export default store

// 导出所有 Store 模块
export * from './modules/app'
export * from './modules/color'
export * from './modules/layout'
export * from './modules/permission'
export * from './modules/postcss'
export * from './modules/size'
export * from './modules/user'

// 按需导出常用 Store，便于使用
export { useAppStore, useAppStoreWithOut } from './modules/app'
export { useLayoutStore, useLayoutStoreWithOut } from './modules/layout'
export { useLocaleStore, useLocaleStoreWithOut } from './modules/locale'
export { usePermissionStore, usePermissionStoreWithOut } from './modules/permission'
export { useUserStore, useUserStoreWithOut } from './modules/user'
