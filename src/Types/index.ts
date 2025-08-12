// Types 统一管理入口
import { autoImportModulesSync } from '@/utils'

// 自动导入所有类型声明模块
const typeModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedTypes = autoImportModulesSync(typeModules)

// 导出所有类型声明模块
export * from './modules/device'
export * from './modules/layout'
export * from './modules/locale'
export * from './modules/router'
export * from './modules/theme'
export * from './modules/user'
export * from './modules/utils'
export * from './modules/vue'

// 导出所有类型
export default importedTypes

// 类型定义
export type TypeModules = typeof importedTypes
