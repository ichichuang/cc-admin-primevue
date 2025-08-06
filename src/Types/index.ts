/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 全局类型声明入口
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// Types 统一管理入口
import { autoImportModulesSync } from '@/utils'

// 自动导入所有类型声明模块
const typeModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedTypes = autoImportModulesSync(typeModules)

// 导入所有类型声明模块
import './modules/app'
import './modules/device'
import './modules/layout'
import './modules/locale'
import './modules/router'
import './modules/theme'
import './modules/user'
import './modules/utils'
import './modules/vue'

// 导出所有类型声明模块
export * from './modules/app'
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
