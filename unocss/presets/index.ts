/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - presets
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { presetAttributify, presetIcons, presetTypography, presetUno } from 'unocss'
import { getCustomCollections } from '../utils/icons'

/**
 * 预设配置
 */
export const presets = [
  presetUno({
    // 启用深色模式支持
    dark: 'class',
    // 启用所有变体
    variablePrefix: '--un-',
  }),
  // 注意：不使用 presetRemToPx，因为它与 rem 适配系统冲突
  // presetRemToPx 会生成固定 px 值，无法实现响应式缩放
  presetIcons({
    prefix: 'icon-',
    // 开发时警告未找到的图标
    warn: process.env.NODE_ENV === 'development',
    // 图标属性
    extraProperties: {
      display: 'inline-block',
      'vertical-align': 'middle',
      'flex-shrink': '0',
    },
    // 自定义图标集合
    collections: {
      ...getCustomCollections(),
    },
  }),
  presetAttributify({
    // 属性化前缀
    prefix: 'un-',
    prefixedOnly: false,
  }),
  presetTypography({
    // 排版样式配置
    cssExtend: {
      code: {
        color: 'var(--theme-color)',
      },
      blockquote: {
        'border-left-color': 'var(--theme-color)',
      },
    },
  }),
]
