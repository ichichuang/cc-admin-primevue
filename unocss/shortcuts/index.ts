/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - index
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { layoutShortcuts } from './modules/layout'
import { sizeShortcuts } from './modules/size'
import { textShortcuts } from './modules/text'

/**
 * 合并所有快捷方式
 */
export const shortcuts = [
  // 布局快捷方式
  layoutShortcuts,

  // 文本快捷方式
  textShortcuts,

  // 尺寸快捷方式
  sizeShortcuts,
]
