/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - designRules
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 🎯 设计稿映射规则 - 实现精确的设计稿到像素映射 + 响应式缩放
 * 这些规则生成的 px 值会被 postcss-pxtorem 转换为 rem，从而实现响应式
 */
export const designRules = [
  [/^w-(\d+)$/, ([, d]) => ({ width: `${d}px` }), { layer: 'design-mapping' }],
  [/^h-(\d+)$/, ([, d]) => ({ height: `${d}px` }), { layer: 'design-mapping' }],
  [/^text-(\d+)$/, ([, d]) => ({ 'font-size': `${d}px` }), { layer: 'design-mapping' }],
  [/^p-(\d+)$/, ([, d]) => ({ padding: `${d}px` }), { layer: 'design-mapping' }],
  [/^m-(\d+)$/, ([, d]) => ({ margin: `${d}px` }), { layer: 'design-mapping' }],
  [/^pt-(\d+)$/, ([, d]) => ({ 'padding-top': `${d}px` }), { layer: 'design-mapping' }],
  [/^pb-(\d+)$/, ([, d]) => ({ 'padding-bottom': `${d}px` }), { layer: 'design-mapping' }],
  [/^pl-(\d+)$/, ([, d]) => ({ 'padding-left': `${d}px` }), { layer: 'design-mapping' }],
  [/^pr-(\d+)$/, ([, d]) => ({ 'padding-right': `${d}px` }), { layer: 'design-mapping' }],
  [
    /^px-(\d+)$/,
    ([, d]) => ({ 'padding-left': `${d}px`, 'padding-right': `${d}px` }),
    { layer: 'design-mapping' },
  ],
  [
    /^py-(\d+)$/,
    ([, d]) => ({ 'padding-top': `${d}px`, 'padding-bottom': `${d}px` }),
    { layer: 'design-mapping' },
  ],
  [/^mt-(\d+)$/, ([, d]) => ({ 'margin-top': `${d}px` }), { layer: 'design-mapping' }],
  [/^mb-(\d+)$/, ([, d]) => ({ 'margin-bottom': `${d}px` }), { layer: 'design-mapping' }],
  [/^ml-(\d+)$/, ([, d]) => ({ 'margin-left': `${d}px` }), { layer: 'design-mapping' }],
  [/^mr-(\d+)$/, ([, d]) => ({ 'margin-right': `${d}px` }), { layer: 'design-mapping' }],
  [
    /^my-(\d+)$/,
    ([, d]) => ({ 'margin-top': `${d}px`, 'margin-bottom': `${d}px` }),
    { layer: 'design-mapping' },
  ],
  [
    /^mx-(\d+)$/,
    ([, d]) => ({ 'margin-left': `${d}px`, 'margin-right': `${d}px` }),
    { layer: 'design-mapping' },
  ],
  [/^gap-(\d+)$/, ([, d]) => ({ gap: `${d}px` }), { layer: 'design-mapping' }],
  [/^gapx-(\d+)$/, ([, d]) => ({ 'gap-x': `${d}px` }), { layer: 'design-mapping' }],
  [/^gapy-(\d+)$/, ([, d]) => ({ 'gap-y': `${d}px` }), { layer: 'design-mapping' }],
  [/^lh-(\d+)$/, ([, d]) => ({ 'line-height': `${d}px` }), { layer: 'design-mapping' }],
  [/^fs-(\d+)$/, ([, d]) => ({ 'font-size': `${d}px` }), { layer: 'design-mapping' }],
]
