#!/usr/bin/env tsx

/**
 * @description cc-admin 企业级后台管理框架 - 统一检查脚本
 */

import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dirname = fileURLToPath(new URL('.', import.meta.url))
const projectRoot = join(_dirname, '..')

/* -------------------- 类型定义 -------------------- */
interface CheckResult {
  name: string
  success: boolean
  error?: string
  duration: number
}

interface Colors {
  red: string
  green: string
  yellow: string
  blue: string
  magenta: string
  cyan: string
  reset: string
}

/* -------------------- 导入统一日志工具 -------------------- */
import {
  formatDuration,
  logError,
  logInfo,
  logSection,
  logStats,
  logSuccess,
  logTitle,
  logWarning,
} from './utils/logger.js'

/* -------------------- 检查配置 -------------------- */
const CHECKS = [
  {
    name: 'TypeScript 类型检查',
    command: 'pnpm',
    args: ['type-check'],
    description: '检查 TypeScript 类型错误',
  },
  {
    name: 'ESLint 代码规范检查',
    command: 'pnpm',
    args: ['lint'],
    description: '检查代码规范和潜在问题',
  },
  {
    name: '命名规范检查',
    command: 'pnpm',
    args: ['naming-check'],
    description: '检查文件和目录命名规范',
  },
  {
    name: '环境变量检查',
    command: 'pnpm',
    args: ['env-check'],
    description: '检查环境变量配置',
  },
]

/* -------------------- 工具函数 -------------------- */
/**
 * 执行命令并返回结果
 */
function executeCommand(command: string, args: string[]): Promise<CheckResult> {
  return new Promise(resolve => {
    const startTime = Date.now()
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'pipe',
      shell: true,
    })

    let stdout = ''
    let stderr = ''

    child.stdout?.on('data', data => {
      stdout += data.toString()
    })

    child.stderr?.on('data', data => {
      stderr += data.toString()
    })

    child.on('close', code => {
      const duration = Date.now() - startTime
      const success = code === 0

      resolve({
        name: command,
        success,
        error: success ? undefined : stderr || stdout,
        duration,
      })
    })

    child.on('error', error => {
      const duration = Date.now() - startTime
      resolve({
        name: command,
        success: false,
        error: error.message,
        duration,
      })
    })
  })
}

/**
 * 检查 pnpm 是否可用
 */
async function checkPnpmAvailable(): Promise<boolean> {
  try {
    const { execSync } = await import('child_process')
    execSync('pnpm --version', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

/**
 * 检查项目依赖是否已安装
 */
function checkDependencies(): boolean {
  const nodeModulesPath = join(projectRoot, 'node_modules')
  const pnpmLockPath = join(projectRoot, 'pnpm-lock.yaml')

  return existsSync(nodeModulesPath) && existsSync(pnpmLockPath)
}

/* -------------------- 主函数 -------------------- */
async function runChecks(): Promise<void> {
  logTitle('开始执行 cc-admin 框架检查')

  // 检查环境
  if (!(await checkPnpmAvailable())) {
    logError('错误: 未找到 pnpm，请先安装 pnpm')
    logWarning('   安装命令: npm install -g pnpm')
    process.exit(1)
  }

  if (!checkDependencies()) {
    logError('错误: 项目依赖未安装，请先运行 pnpm install')
    process.exit(1)
  }

  logSuccess('环境检查通过')
  console.log('')

  // 执行检查
  const results: CheckResult[] = []

  for (const check of CHECKS) {
    logSection(`正在执行: ${check.name}`)
    logInfo(`   描述: ${check.description}`)

    const result = await executeCommand(check.command, check.args)
    // 使用检查名称而不是命令名称
    result.name = check.name
    results.push(result)

    if (result.success) {
      logSuccess(`${check.name} 通过 (${formatDuration(result.duration)})`)
    } else {
      logError(`${check.name} 失败 (${formatDuration(result.duration)})`)
      if (result.error) {
        logError(`   错误信息: ${result.error}`)
      }
    }

    console.log('')
  }

  // 输出结果摘要
  logTitle('检查结果摘要')

  const successCount = results.filter(r => r.success).length
  const totalCount = results.length
  const failedCount = totalCount - successCount

  results.forEach(result => {
    const duration = formatDuration(result.duration)
    if (result.success) {
      logSuccess(`${result.name} - ${duration}`)
    } else {
      logError(`${result.name} - ${duration}`)
    }
  })

  console.log('')
  logStats({
    总计: totalCount,
    通过: successCount,
    失败: failedCount,
  })

  if (failedCount > 0) {
    console.log('')
    logWarning('💡 修复建议:')
    logWarning('   1. 查看上方错误信息，了解具体问题')
    logWarning('   2. 根据错误提示修复代码或配置')
    logWarning('   3. 重新运行 pnpm check 验证修复结果')
    console.log('')
    process.exit(1)
  } else {
    console.log('')
    logSuccess('🎉 所有检查通过！代码质量良好。')
    console.log('')
  }
}

/* -------------------- 错误处理 -------------------- */
process.on('unhandledRejection', (reason, promise) => {
  logError('未处理的 Promise 拒绝:')
  logError(`   Promise: ${promise}`)
  logError(`   原因: ${reason}`)
  process.exit(1)
})

process.on('uncaughtException', error => {
  logError('未捕获的异常:')
  logError(`   错误: ${error.message}`)
  logError(`   堆栈: ${error.stack}`)
  process.exit(1)
})

/* -------------------- 执行入口 -------------------- */
if (import.meta.url === `file://${process.argv[1]}`) {
  runChecks().catch(error => {
    logError('检查过程中发生错误:')
    logError(`   ${error.message}`)
    process.exit(1)
  })
}
