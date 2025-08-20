#!/usr/bin/env node

/**
 * 🔥 组件监控脚本
 * 用于手动触发组件类型声明更新
 */

import { execSync } from 'child_process'
import { existsSync, watch } from 'fs'
import { join } from 'path'

const COMPONENT_DIRS = ['src/components', 'src/layouts/components']

const DTS_FILES = ['components.d.ts', 'auto-imports.d.ts']

/**
 * 触发类型声明重新生成
 */
function regenerateTypeDeclarations() {
  try {
    console.log('🔄 正在重新生成类型声明文件...')

    // 删除现有的类型声明文件
    DTS_FILES.forEach(file => {
      if (existsSync(file)) {
        execSync(`rm -f ${file}`)
        console.log(`🗑️ 已删除: ${file}`)
      }
    })

    // 重启开发服务器以重新生成
    console.log('🚀 重启开发服务器...')
    execSync('npm run dev', { stdio: 'inherit' })
  } catch (error) {
    console.error('❌ 重新生成失败:', error)
  }
}

/**
 * 监控组件目录变化
 */
function watchComponents() {
  console.log('👀 开始监控组件目录...')
  console.log('📁 监控目录:', COMPONENT_DIRS.join(', '))
  console.log('📝 监控文件类型: .vue, .ts, .tsx')
  console.log('⏹️  按 Ctrl+C 停止监控\n')

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
        console.log(`🔄 [${eventType}] ${filePath}`)

        // 延迟执行，避免频繁触发
        setTimeout(() => {
          // 只删除文件，不重启服务器（避免循环重启）
          DTS_FILES.forEach(file => {
            if (existsSync(file)) {
              unlinkSync(file)
              console.log(`🗑️ 已删除: ${file}`)
            }
          })
        }, 500)
      }
    })
  })
}

/**
 * 手动触发更新
 */
function manualUpdate() {
  console.log('🔧 手动触发组件类型声明更新...')
  regenerateTypeDeclarations()
}

// 命令行参数处理
const args = process.argv.slice(2)

if (args.includes('--watch') || args.includes('-w')) {
  watchComponents()
} else if (args.includes('--update') || args.includes('-u')) {
  manualUpdate()
} else {
  console.log('🔥 组件监控工具')
  console.log('')
  console.log('用法:')
  console.log('  npm run watch:components -- --watch  # 监控模式')
  console.log('  npm run watch:components -- --update # 手动更新')
  console.log('')
  console.log('选项:')
  console.log('  -w, --watch   监控组件目录变化')
  console.log('  -u, --update  手动触发类型声明更新')
}
