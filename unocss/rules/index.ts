/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - rules
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { designRules } from './designRules'
import { createPixelRules } from './pixelRules'
import { safeAreaRules } from './safeAreaRules'
import { createThemeVariableRules } from './themeRules'
import { utilityRules } from './utilityRules'

/**
 * 统一导出所有规则
 */
export const rules = [
  // 工具规则
  ...utilityRules,

  // 🎯 设计稿映射规则 - 实现精确的设计稿到像素映射 + 响应式缩放
  ...designRules,

  // 安全区域规则 - 适配移动端
  ...safeAreaRules,

  // 像素值规则（保留原有功能）
  ...createPixelRules(),

  // 主题变量规则
  ...createThemeVariableRules(),
]
