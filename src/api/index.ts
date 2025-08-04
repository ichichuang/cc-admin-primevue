/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - API接口
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// API 统一管理入口
import { autoImportModulesSync } from '@/utils/moduleLoader'

// 自动导入所有 API 模块
const apiModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedAPIs = autoImportModulesSync(apiModules)

// 导出所有 API 模块
export * from './modules/auth'

// 导出所有 API
export default importedAPIs

// 类型定义
export type APIModules = typeof importedAPIs

// 按需导出常用 API 函数，便于使用
export { getAuthRoutes, getUserInfo, login } from './modules/auth'
