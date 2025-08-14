/**
 * @description cc-admin 企业级后台管理框架 - 初始化脚本
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

// 修复 ES 模块问题
const filename = fileURLToPath(import.meta.url)
const _dirname = join(filename, '..')
const projectRoot = join(_dirname, '..')

/* -------------------- 导入统一日志工具 -------------------- */
import { logError, logInfo, logSection, logSuccess, logTitle, logWarning } from './utils/logger.js'

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
function executeStep(step: InitStep): boolean {
  logSection(`正在执行: ${step.name}`)
  logInfo(`📝 描述: ${step.description}`)

  try {
    logInfo(`⚡ 执行命令: ${step.command}`)
    execSync(step.command, {
      stdio: 'inherit',
      cwd: projectRoot,
      encoding: 'utf-8',
    })
    logSuccess(`${step.name} 执行成功`)
    return true
  } catch (error) {
    logError(`${step.name} 执行失败`)
    if (error instanceof Error) {
      logError(`错误信息: ${error.message}`)
    }

    if (step.required && !step.skipIfFailed) {
      logWarning(`${step.name} 是必需步骤，初始化终止`)
      return false
    } else {
      logWarning(`${step.name} 执行失败，但将继续执行后续步骤`)
      return true
    }
  }
}

/**
 * 检查项目环境
 */
function checkProjectEnvironment(): boolean {
  logSection('检查项目环境...')

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
function showSummary(successSteps: string[], failedSteps: string[]): void {
  logTitle('初始化总结')

  if (successSteps.length > 0) {
    logSuccess('\n成功执行的步骤:')
    successSteps.forEach((step, index) => {
      logSuccess(`  ${index + 1}. ${step}`)
    })
  }

  if (failedSteps.length > 0) {
    logError('\n失败的步骤:')
    failedSteps.forEach((step, index) => {
      logError(`  ${index + 1}. ${step}`)
    })
  }

  logInfo('\n📋 后续建议:')
  logInfo('1. 运行 pnpm dev 启动开发服务器')
  logInfo('2. 运行 pnpm check 进行完整检查')
  logInfo('3. 查看 docs/ 目录了解项目文档')
  logInfo('4. 运行 pnpm monitor:setup 设置监控')

  if (failedSteps.length === 0) {
    logSuccess('\n🎉 初始化完成！项目已准备就绪')
  } else {
    logWarning('\n⚠️  初始化部分完成，请检查失败的步骤')
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

  const successSteps: string[] = []
  const failedSteps: string[] = []

  // 执行初始化步骤
  for (const step of INIT_STEPS) {
    const success = executeStep(step)
    if (success) {
      successSteps.push(step.name)
    } else {
      failedSteps.push(step.name)
      if (step.required && !step.skipIfFailed) {
        break
      }
    }
  }

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
