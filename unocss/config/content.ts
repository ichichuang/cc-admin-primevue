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
    exclude: [
      // 排除 node_modules 中的所有文件
      '**/node_modules/**',
      // 排除构建产物
      '**/dist/**',
      '**/build/**',
      '**/.vite/**',
      // 排除版本控制
      '**/.git/**',
      // 排除框架特定目录
      '**/.nuxt/**',
      '**/.next/**',
      '**/.vercel/**',
      '**/.netlify/**',
      // 排除测试文件
      '**/*.test.*',
      '**/*.spec.*',
      // 排除文档文件
      '**/docs/**',
      '**/README.md',
      // 排除配置文件
      '**/vite.config.*',
      '**/rollup.config.*',
      '**/webpack.config.*',
      // 排除类型定义文件
      '**/*.d.ts',
      // 排除锁文件
      '**/package-lock.json',
      '**/yarn.lock',
      '**/pnpm-lock.yaml',
    ],
  },
}
