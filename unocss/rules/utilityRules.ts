/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - utilityRules
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 工具规则
 */
export const utilityRules = [
  // 多行文本省略规则
  [
    /^line-clamp-(\d+)$/,
    ([, num]) => ({
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': num,
      'line-clamp': num,
    }),
  ],

  // 自定义透明度规则
  [
    /^bg-theme-(\d+)$/,
    ([, opacity]) => ({
      'background-color': `rgba(var(--theme-color-rgb), ${Number(opacity) / 100})`,
    }),
  ],

  // 渐变规则
  [
    /^bg-gradient-theme$/,
    () => ({
      'background-image': 'linear-gradient(135deg, var(--theme-color), var(--primary-color))',
    }),
  ],
]
