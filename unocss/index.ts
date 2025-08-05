/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - index
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { defineConfig } from 'unocss'
import { contentConfig } from './config/content'
import { presets } from './presets'
import { rules } from './rules'
import { shortcuts } from './shortcuts'
import { transformers } from './transformers'
import { getDynamicSafelist } from './utils/icons'
import { themeConfig } from './utils/theme'
import { variants } from './variants'

export default defineConfig({
  // 内容扫描配置 - 优化性能
  content: contentConfig,

  // 预设配置
  presets,

  // 安全列表 - 优化性能，只包含必要的类
  safelist: getDynamicSafelist(),

  // 变换器
  transformers,

  // 自定义变体 - 只保留实际使用的
  variants,

  // 快捷方式配置
  shortcuts: shortcuts as any,

  // 自定义规则
  rules,

  // 主题配置
  theme: themeConfig,
})
