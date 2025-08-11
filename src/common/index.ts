// Common 统一管理入口
import { autoImportModulesSync } from '@/utils'

// 自动导入所有公共模块
const commonModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedCommons = autoImportModulesSync(commonModules)

// 导出所有公共模块
export * from './modules/date'
export * from './modules/function'
export * from './modules/lodashes'
export * from './modules/router'

// 导出所有公共模块
export default importedCommons

// 类型定义
export type CommonModules = typeof importedCommons
