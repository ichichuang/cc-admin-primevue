#!/usr/bin/env node

/**
 * 🔥 快速组件更新脚本
 * 用于手动触发组件类型声明更新
 */

import { execSync } from 'child_process'
import { existsSync, unlinkSync } from 'fs'

const DTS_FILES = ['components.d.ts', 'auto-imports.d.ts']

console.log('🔥 开始更新组件类型声明...')

try {
  // 1. 删除现有的类型声明文件
  DTS_FILES.forEach(file => {
    if (existsSync(file)) {
      unlinkSync(file)
      console.log(`🗑️ 已删除: ${file}`)
    }
  })

  // 2. 清除 Vite 缓存
  console.log('🧹 清除 Vite 缓存...')
  try {
    execSync('rm -rf node_modules/.vite', { stdio: 'ignore' })
  } catch (_error) {
    // 忽略错误，缓存可能不存在
  }

  // 3. 重新启动开发服务器
  console.log('🚀 重新启动开发服务器...')
  console.log('⏳ 请等待服务器启动完成...')

  execSync('npm run dev', { stdio: 'inherit' })
} catch (error) {
  console.error('❌ 更新失败:', error)
  process.exit(1)
}
