/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - index
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { autoImportModulesSync, env } from '@/utils'
import type { MockMethod } from './types'

// 自动导入所有 Mock 模块
const mockModules = import.meta.glob('./modules/**/*.ts', { eager: true })
const importedMocks = autoImportModulesSync<MockMethod[]>(mockModules)

/**
 * Mock 服务配置
 * 统一管理所有的 Mock 接口
 */
export const mockServices: MockMethod[] = Object.values(importedMocks).flat()

/**
 * 初始化 Mock 服务
 * 根据环境变量决定是否启用 Mock
 */
export function initMockService() {
  if (env.mockEnable) {
    // 使用自定义 Mock 服务，支持生产环境
    import('./mock-service')
      .then(() => {
        // Mock服务已启动
      })
      .catch(error => {
        console.error('❌ Mock 服务启动失败:', error)
      })
  }
}

// 导出所有 Mock 模块
export * from './modules/auth'
export * from './modules/router'

// 导出所有 Mock
export default importedMocks

// 类型定义
export type MockModules = typeof importedMocks
