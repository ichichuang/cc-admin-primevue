/**
 * 实时监听文件命名规范检查脚本
 * 监听 src/ 目录下的文件变化，自动执行命名规范检查
 */

import { exec } from 'child_process'
import chokidar, { FSWatcher } from 'chokidar'
import { basename, dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'util'
import {
  formatDuration,
  logError,
  logFile,
  logFolder,
  logInfo,
  logSection,
  logSuccess,
  logTime,
  logTitle,
  logWarning,
} from './utils/logger.js'

const _dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(_dirname, '..')
const execAsync = promisify(exec)

// 配置选项
const CONFIG = {
  // 监听目录
  watchDir: join(projectRoot, 'src'),
  // 忽略的文件/目录
  ignored: [
    /node_modules/,
    /\.git/,
    /\.vscode/,
    /\.husky/,
    /dist/,
    /coverage/,
    /public/,
    /\.DS_Store/,
    /\.log$/,
    /\.tmp$/,
  ],
  // 检查间隔（毫秒）- 防止频繁触发
  debounceDelay: 1000,
  // 是否显示详细日志
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
}

// 防抖定时器
let debounceTimer: NodeJS.Timeout | null = null

/**
 * 执行命名规范检查
 */
async function runNamingCheck(triggerFile?: string) {
  try {
    const startTime = Date.now()

    if (CONFIG.verbose) {
      logSection('执行命名规范检查...')
      if (triggerFile) {
        logFile(`触发文件: ${triggerFile.replace(projectRoot, '')}`)
      }
    }

    const { stdout, stderr } = await execAsync('pnpm exec tsx scripts/naming-rules.ts')

    const duration = Date.now() - startTime

    if (stderr) {
      logError(`检查过程中出现错误:\n${stderr}`)
      return false
    }

    // 解析输出结果
    const hasErrors = stdout.includes('❌ 发现') || stdout.includes('个命名规范问题')

    if (hasErrors) {
      console.log(`\n${stdout}`)
      logTime(`检查耗时: ${formatDuration(duration)}`)
      return false
    } else {
      if (CONFIG.verbose) {
        logSuccess('命名规范检查通过')
        logTime(`检查耗时: ${formatDuration(duration)}`)
      } else {
        logSuccess(`命名规范检查通过 (${formatDuration(duration)})`)
      }
      return true
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logError(`执行检查失败: ${errorMessage}`)
    return false
  }
}

/**
 * 防抖执行检查
 */
function debouncedCheck(triggerFile?: string) {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    runNamingCheck(triggerFile)
  }, CONFIG.debounceDelay)
}

/**
 * 检查文件类型是否需要监听
 */
function shouldWatchFile(filePath: string): boolean {
  const ext = extname(filePath)
  const fileName = basename(filePath)

  // 只监听特定类型的文件
  const watchableExtensions = ['.vue', '.ts', '.tsx']
  const isWatchableExt = watchableExtensions.includes(ext)

  // 排除特殊文件
  const skipFiles = ['index.vue', 'index.ts', 'types.ts', 'types.d.ts', '.DS_Store']

  return isWatchableExt && !skipFiles.includes(fileName)
}

/**
 * 检查目录类型是否需要监听
 */
function shouldWatchDirectory(dirPath: string): boolean {
  const dirName = basename(dirPath)

  // 排除特殊目录
  const skipDirs = [
    'node_modules',
    '.git',
    '.vscode',
    '.husky',
    'dist',
    'coverage',
    'public',
    '.DS_Store',
  ]

  return !skipDirs.includes(dirName)
}

/**
 * 启动监听器
 */
function startWatcher() {
  logTitle('启动文件命名规范实时监听')
  logInfo(`📁 监听目录: ${CONFIG.watchDir.replace(projectRoot, '')}`)
  logInfo(`⚙️  防抖延迟: ${CONFIG.debounceDelay}ms`)
  logInfo(`🔍 详细模式: ${CONFIG.verbose ? '开启' : '关闭'}`)
  logInfo('💡 提示: 使用 --verbose 或 -v 参数开启详细日志')

  const watcher = chokidar.watch(CONFIG.watchDir, {
    ignored: CONFIG.ignored,
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100,
    },
  })

  // 文件添加事件
  watcher.on('add', filePath => {
    if (shouldWatchFile(filePath)) {
      logFile(`新增文件: ${filePath.replace(projectRoot, '')}`)
      debouncedCheck(filePath)
    }
  })

  // 目录添加事件
  watcher.on('addDir', dirPath => {
    if (shouldWatchDirectory(dirPath)) {
      logFolder(`新增目录: ${dirPath.replace(projectRoot, '')}`)
      debouncedCheck(dirPath)
    }
  })

  // 文件重命名事件
  watcher.on('unlink', filePath => {
    if (shouldWatchFile(filePath)) {
      logFile(`删除文件: ${filePath.replace(projectRoot, '')}`)
      debouncedCheck()
    }
  })

  // 目录删除事件
  watcher.on('unlinkDir', dirPath => {
    if (shouldWatchDirectory(dirPath)) {
      logFolder(`删除目录: ${dirPath.replace(projectRoot, '')}`)
      debouncedCheck()
    }
  })

  // 文件修改事件
  watcher.on('change', filePath => {
    if (shouldWatchFile(filePath)) {
      logFile(`修改文件: ${filePath.replace(projectRoot, '')}`)
      debouncedCheck(filePath)
    }
  })

  // 错误处理
  watcher.on('error', (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logError(`监听器错误: ${errorMessage}`)
  })

  // 监听器就绪
  watcher.on('ready', () => {
    logSuccess('监听器已就绪，开始监听文件变化...\n')

    // 初始检查
    runNamingCheck()
  })

  return watcher
}

/**
 * 优雅关闭
 */
function gracefulShutdown(watcher: FSWatcher) {
  logWarning('\n正在停止监听器...')

  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  watcher
    .close()
    .then(() => {
      logSuccess('监听器已停止')
      process.exit(0)
    })
    .catch(error => {
      logError(`停止监听器时出错: ${error.message}`)
      process.exit(1)
    })
}

/**
 * 主函数
 */
async function main() {
  try {
    // 检查依赖
    try {
      await execAsync('pnpm --version')
    } catch {
      logError('未找到 pnpm，请确保已安装 pnpm')
      process.exit(1)
    }

    // 检查命名规则脚本是否存在
    const namingRulesPath = join(_dirname, 'naming-rules.ts')
    try {
      await import('fs').then(fs => fs.promises.access(namingRulesPath))
    } catch {
      logError('未找到 scripts/naming-rules.ts 文件')
      process.exit(1)
    }

    // 启动监听器
    const watcher = startWatcher()

    // 处理进程信号
    process.on('SIGINT', () => gracefulShutdown(watcher))
    process.on('SIGTERM', () => gracefulShutdown(watcher))
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logError(`启动失败: ${errorMessage}`)
    process.exit(1)
  }
}

// 运行主函数
main().catch(console.error)
