/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - content
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 内容扫描配置 - 优化性能
 */
export const contentConfig = {
  pipeline: {
    include: [
      /\.(vue|js|ts|jsx|tsx|md|mdx|html)($|\?)/,
      // 包含样式文件以支持 @apply 指令
      /\.(css|scss|sass|less|styl|stylus)($|\?)/,
    ],
    exclude: ['node_modules', 'dist', '.git', '.nuxt', '.next', '.vercel', '.netlify'],
  },
}
