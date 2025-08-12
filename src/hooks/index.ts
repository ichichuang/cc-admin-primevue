// Hooks 统一管理入口
import { autoImportModulesSync } from '@/utils'

// 自动导入所有 Hook 模块
const hookModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedHooks = autoImportModulesSync(hookModules)

const hookLayoutModules = import.meta.glob('./layout/**/*.ts', { eager: true })
const importedHookLayouts = autoImportModulesSync(hookLayoutModules)

// 导出所有 Hook 模块
export * from './layout/useLoading'
export * from './layout/useNprogress'
export * from './layout/usePageTitle'
export * from './modules/useLocale'

// 导出所有 Hooks
export default {
  ...importedHooks,
  ...importedHookLayouts,
}

// 类型定义
export type HookModules = typeof importedHooks
export type HookLayoutModules = typeof importedHookLayouts
