/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - safeAreaRules
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 安全区域规则 - 适配移动端
 */
export const safeAreaRules = [
  ['safe-top', { 'padding-top': 'env(safe-area-inset-top)' }],
  ['safe-bottom', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
  ['safe-left', { 'padding-left': 'env(safe-area-inset-left)' }],
  ['safe-right', { 'padding-right': 'env(safe-area-inset-right)' }],
  [
    'safe-x',
    {
      'padding-left': 'env(safe-area-inset-left)',
      'padding-right': 'env(safe-area-inset-right)',
    },
  ],
  [
    'safe-y',
    {
      'padding-top': 'env(safe-area-inset-top)',
      'padding-bottom': 'env(safe-area-inset-bottom)',
    },
  ],
]
