import { spawn } from 'child_process'
import { logFile, logInfo, logTitle, logWarning } from './utils/logger.js'

logTitle('启动 cc-admin 开发环境')
logInfo('启动命名规范监听...')

// 启动 Vite 开发服务器
const viteProcess = spawn('pnpm', ['exec', 'vite'], {
  stdio: 'inherit',
  shell: false,
})

// 启动命名规范监听
const namingWatchProcess = spawn('pnpm', ['naming-watch'], {
  stdio: 'inherit',
  shell: false,
})

// 处理进程退出
process.on('SIGINT', () => {
  logWarning('\n正在停止开发环境...')
  viteProcess.kill('SIGINT')
  namingWatchProcess.kill('SIGINT')
  process.exit(0)
})

// 处理子进程退出
viteProcess.on('exit', code => {
  logFile(`Vite 开发服务器已退出 (代码: ${code})`)
  namingWatchProcess.kill('SIGINT')
  process.exit(code || 0)
})

namingWatchProcess.on('exit', code => {
  logInfo(`命名规范监听已退出 (代码: ${code})`)
  viteProcess.kill('SIGINT')
  process.exit(code || 0)
})
