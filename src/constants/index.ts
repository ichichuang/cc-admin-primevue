/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 配置统一导出
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 配置统一管理入口
import { autoImportModulesSync } from '@/utils'

// 自动导入所有配置模块
const modules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedModules = autoImportModulesSync(modules)
export default importedModules

// 导出所有配置模块
export * from './modules/app'
export * from './modules/http'
export * from './modules/primevuetheme'
export * from './modules/primevuepreset'
export * from './modules/rem'
export * from './modules/router'
export * from './modules/theme'
