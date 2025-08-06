/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description 插件配置文件索引
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// Plugins 统一管理入口
import { autoImportModulesSync } from '@/utils'

// 自动导入所有插件模块
const pluginModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedPlugins = autoImportModulesSync(pluginModules)

// 导出所有插件模块
export * from './modules/core'
export * from './modules/primevue'

// 导出所有插件
export default importedPlugins

// 类型定义
export type PluginModules = typeof importedPlugins
