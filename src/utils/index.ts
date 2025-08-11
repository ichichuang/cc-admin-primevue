// Utils 统一管理入口
import { autoImportModulesSync } from './modules/moduleLoader'

// 自动导入所有工具模块
const utilModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedUtils = autoImportModulesSync(utilModules)

// 导出所有工具模块
export * from './modules/colorUtils'
export * from './modules/deviceInfo'
export * from './modules/env'
export * from './modules/http'
export * from './modules/moduleLoader'
export * from './modules/remAdapter'

// 导出所有工具
export default importedUtils

// 类型定义
export type UtilModules = typeof importedUtils
