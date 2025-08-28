// Utils 统一管理入口
import { autoImportModulesSync } from './modules/moduleLoader'

// 自动导入所有工具模块
const utilModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedUtils = autoImportModulesSync(utilModules)

// 导出所有工具模块
export * from '@/utils/modules/colorUtils'
export * from '@/utils/modules/deviceInfo'
export * from '@/utils/modules/env'
export * from '@/utils/modules/http'
export * from '@/utils/modules/moduleLoader'
export * from '@/utils/modules/remAdapter'
export * from '@/utils/modules/mitt'

// 导出所有工具
export default importedUtils

// 类型定义
export type UtilModules = typeof importedUtils
