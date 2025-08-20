#!/usr/bin/env node

/**
 * 🔥 组件变化监听器
 * 专门用于开发环境，监控组件变化并删除类型声明文件
 */

import { existsSync, unlinkSync, watch } from 'fs'
import { join } from 'path'

const COMPONENT_DIRS = ['src/components', 'src/layouts/components']

const DTS_FILES = ['components.d.ts', 'auto-imports.d.ts']

// 🔥 新增：防抖机制，避免重复触发
let debounceTimer: NodeJS.Timeout | null = null
const DEBOUNCE_DELAY = 500 // 500ms 防抖延迟

console.log('🔥 组件变化监听器已启动')
console.log('📁 监控目录:', COMPONENT_DIRS.join(', '))
console.log('📝 监控文件类型: .vue, .ts, .tsx')

/**
 * 防抖函数：延迟执行，避免频繁触发
 */
function debounceUpdate(filePath: string, eventType: string) {
  // 清除之前的定时器
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // 设置新的定时器
  debounceTimer = setTimeout(() => {
    console.log(`🔄 [${eventType}] ${filePath}`)

    // 只在文件新增或删除时删除类型声明文件
    if (eventType === 'rename' || eventType === 'add' || eventType === 'unlink') {
      DTS_FILES.forEach(file => {
        if (existsSync(file)) {
          try {
            unlinkSync(file)
            console.log(`🗑️ 已删除: ${file}`)
          } catch (error) {
            console.warn(`⚠️ 删除文件失败: ${file}`, error)
          }
        }
      })

      // 等待 Vite 重新生成文件
      setTimeout(() => {
        DTS_FILES.forEach(file => {
          if (existsSync(file)) {
            console.log(`✅ 已重新生成: ${file}`)
          }
        })
      }, 1000)
    }
  }, DEBOUNCE_DELAY)
}

// 监控组件目录变化
COMPONENT_DIRS.forEach(dir => {
  if (!existsSync(dir)) {
    console.warn(`⚠️  目录不存在: ${dir}`)
    return
  }

  watch(dir, { recursive: true }, (eventType, filename) => {
    if (!filename) {
      return
    }

    const filePath = join(dir, filename)

    // 只监控相关文件类型
    if (filename.endsWith('.vue') || filename.endsWith('.ts') || filename.endsWith('.tsx')) {
      // 使用防抖函数
      debounceUpdate(filePath, eventType)
    }
  })
})

// 保持进程运行
process.on('SIGINT', () => {
  console.log('\n🔥 组件变化监听器已停止')
  process.exit(0)
})

console.log('✅ 监听器已就绪，开始监听文件变化...')
