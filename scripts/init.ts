/**
 * @description cc-admin 企业级后台管理框架 - 初始化脚本
 */

import { existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

// 修复 ES 模块问题
const filename = fileURLToPath(import.meta.url)
const _dirname = join(filename, '..')
const projectRoot = join(_dirname, '..')

/* -------------------- 导入统一日志工具 -------------------- */
import {
  logError,
  logInfo,
  logRocket,
  logSearch,
  logSparkles,
  logSuccess,
  logTitle,
  logWarning,
} from './utils/logger.js'

/* -------------------- 初始化步骤配置 -------------------- */
interface InitStep {
  name: string
  command: string
  description: string
  required: boolean
  skipIfFailed: boolean
}

const INIT_STEPS: InitStep[] = [
  {
    name: '环境检查',
    command: 'pnpm env-check',
    description: '检查环境变量配置是否正确',
    required: true,
    skipIfFailed: false,
  },
  {
    name: '命名规范检查',
    command: 'pnpm naming-check',
    description: '检查项目命名规范是否符合要求',
    required: true,
    skipIfFailed: false,
  },
  {
    name: '代码格式检查',
    command: 'pnpm lint',
    description: '检查并修复代码格式问题',
    required: false,
    skipIfFailed: true,
  },
  {
    name: '类型检查',
    command: 'pnpm type-check',
    description: '检查 TypeScript 类型定义',
    required: false,
    skipIfFailed: true,
  },
  {
    name: '依赖安装',
    command: 'pnpm install',
    description: '安装项目依赖包',
    required: true,
    skipIfFailed: false,
  },
  {
    name: 'Git Hooks 设置',
    command: 'pnpm prepare',
    description: '设置 Git Hooks（husky）',
    required: false,
    skipIfFailed: true,
  },
]

/* -------------------- 执行函数 -------------------- */

/**
 * 执行单个初始化步骤
 */
function executeStep(
  step: InitStep,
  stepIndex: number,
  totalSteps: number
): { success: boolean; error?: string } {
  logInfo(`[${stepIndex}/${totalSteps}] ${step.name}...`)

  try {
    logSuccess(`${step.name} 完成`)
    return { success: true }
  } catch (error: any) {
    logError(`${step.name} 失败`)

    // 提取更详细的错误信息
    let errorMessage = ''
    if (error.stdout) {
      // 优先使用 stdout 中的错误信息（ESLint 输出到 stdout）
      errorMessage = error.stdout.toString().trim()
    } else if (error.stderr) {
      // 如果没有 stdout，使用 stderr
      errorMessage = error.stderr.toString().trim()
    } else if (error.message) {
      // 最后使用通用错误消息
      errorMessage = error.message
    } else {
      errorMessage = String(error)
    }

    // 如果错误信息为空，提供默认信息
    if (!errorMessage) {
      errorMessage = `命令 "${step.command}" 执行失败，退出码: ${error.status || 'unknown'}`
    }

    if (step.required && !step.skipIfFailed) {
      logWarning(`${step.name} 是必需步骤，初始化终止`)
      return { success: false, error: errorMessage }
    } else {
      logWarning(`${step.name} 失败，但将继续执行后续步骤`)
      return { success: false, error: errorMessage }
    }
  }
}

/**
 * 检查项目环境
 */
function checkProjectEnvironment(): boolean {
  logSearch('检查项目环境...')

  // 检查 package.json
  if (!existsSync(join(projectRoot, 'package.json'))) {
    logError('未找到 package.json 文件')
    return false
  }

  // 检查 pnpm-lock.yaml
  if (!existsSync(join(projectRoot, 'pnpm-lock.yaml'))) {
    logWarning('未找到 pnpm-lock.yaml 文件，可能需要安装依赖')
  }

  // 检查 .env 文件
  const envFiles = ['.env', '.env.local', '.env.development', '.env.production']
  const foundEnvFiles = envFiles.filter(file => existsSync(join(projectRoot, file)))

  if (foundEnvFiles.length === 0) {
    logWarning('未找到环境变量文件，建议创建 .env 文件')
  } else {
    logSuccess(`找到环境变量文件: ${foundEnvFiles.join(', ')}`)
  }

  logSuccess('项目环境检查完成')
  return true
}

/**
 * 显示初始化总结
 */
function showSummary(
  successSteps: string[],
  failedSteps: Array<{ name: string; error: string }>
): void {
  logTitle('初始化总结')

  // 显示统计信息
  const totalSteps = successSteps.length + failedSteps.length
  const successRate = Math.round((successSteps.length / totalSteps) * 100)

  logInfo(`执行统计: ${successSteps.length}/${totalSteps} 步骤成功 (${successRate}%)`)

  if (successSteps.length > 0) {
    logSuccess('\n成功执行的步骤:')
    successSteps.forEach((step, index) => {
      logSuccess(`   ${index + 1}. ${step}`)
    })
  }

  if (failedSteps.length > 0) {
    logError('\n失败的步骤:')
    failedSteps.forEach((step, index) => {
      logError(`   ${index + 1}. ${step.name}`)

      // 显示关键错误信息，便于快速定位
      if (step.error) {
        // 提取包含文件路径和行号的错误行
        const lines = step.error.split('\n')
        const errorLines: string[] = []

        // 处理 ESLint 的两行格式错误输出
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          const trimmed = line.trim()

          // 跳过 pnpm 和 eslint 的命令信息
          if (trimmed.startsWith('> ') || trimmed.startsWith('WARN') || trimmed.includes('ccd@')) {
            continue
          }

          // 检查是否是文件路径行
          if (trimmed.match(/^\/Users\/.+\.(ts|tsx|js|jsx|vue)$/)) {
            // 检查下一行是否是错误信息
            const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : ''
            if (nextLine && nextLine.includes('error')) {
              // 解析错误行: "95:11  error  message"
              const errorMatch = nextLine.match(/^(\d+):(\d+)\s+(error|warning)\s+(.+)$/)
              if (errorMatch) {
                const [, lineNum, colNum, errorType, message] = errorMatch
                errorLines.push(`${trimmed}:${lineNum}:${colNum} ${errorType} ${message}`)
                i++ // 跳过下一行，因为已经处理了
              }
            }
          }
        }

        if (errorLines.length > 0) {
          errorLines.forEach(errorLine => {
            logError(`      ${errorLine}`)
          })
        } else {
          // 如果没有找到具体的错误行，显示简化的错误信息
          logError(`      命令执行失败，请运行 pnpm lint 查看详细错误`)
        }
      }
    })
  }

  logInfo('\n后续建议:')
  logInfo('   • 运行 pnpm dev 启动开发服务器')
  logInfo('   • 运行 pnpm check 进行完整检查')
  logInfo('   • 查看 README.md 了解项目文档')
  logInfo('   • 运行 pnpm build 测试构建流程')

  if (failedSteps.length === 0) {
    logSparkles('初始化完成！项目已准备就绪')
  } else {
    logWarning('初始化部分完成，请检查失败的步骤')
  }
}

/**
 * 主函数
 */
function main(): void {
  logTitle('cc-admin 项目初始化脚本')

  // 检查项目环境
  if (!checkProjectEnvironment()) {
    logError('项目环境检查失败，初始化终止')
    process.exit(1)
  }

  logRocket(`开始执行 ${INIT_STEPS.length} 个初始化步骤...`)

  const successSteps: string[] = []
  const failedSteps: Array<{ name: string; error: string }> = []

  // 执行初始化步骤
  for (let i = 0; i < INIT_STEPS.length; i++) {
    const step = INIT_STEPS[i]
    const result = executeStep(step, i + 1, INIT_STEPS.length)

    if (result.success) {
      successSteps.push(step.name)
    } else {
      failedSteps.push({
        name: step.name,
        error: result.error || '未知错误',
      })
      // 只有必需步骤失败才终止，可选步骤失败继续执行
      if (step.required && !step.skipIfFailed) {
        logError('\n初始化终止：必需步骤失败')
        break
      }
    }
  }

  logInfo('') // 空行分隔
  // 显示总结
  showSummary(successSteps, failedSteps)

  // 根据结果设置退出码
  if (failedSteps.length > 0) {
    process.exit(1)
  }
}

// 执行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main }
