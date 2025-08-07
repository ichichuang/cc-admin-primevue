/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - HTTP 配置模块
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 从constants中导入HTTP配置
export { HTTP_CONFIG } from '@/constants/modules/http'

// 导出所有HTTP相关功能
export * from './http/index'
export { default } from './http/index'
