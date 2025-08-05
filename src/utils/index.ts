/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// Utils 统一管理入口

// 导出环境变量工具
export * from './modules/env'

// 导出 HTTP 工具
export * from './modules/http'

// 导出设备信息工具
export * from './modules/deviceInfo'

// 导出模块加载器
export * from './modules/moduleLoader'

// 导出 REM 适配器
export * from './modules/remAdapter'

// 按需导出常用工具函数，便于使用
export { getDeviceInfo } from './modules/deviceInfo'
export { env, getAppEnv, isDev, isProd, toBool, toNumber } from './modules/env'
export { autoImportModulesSync } from './modules/moduleLoader'
export { getRemBase, remAdapter, toPx, toRem } from './modules/remAdapter'
