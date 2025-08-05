/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - transformers
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { transformerDirectives, transformerVariantGroup } from 'unocss'

/**
 * 变换器配置
 */
export const transformers = [
  // 支持 @apply、@screen 和 theme() 指令
  transformerDirectives({
    // 强制转换未知的CSS指令
    enforce: 'pre',
  }),
  // 支持变体组语法，如 hover:(bg-red-400 text-white)
  transformerVariantGroup(),
]
