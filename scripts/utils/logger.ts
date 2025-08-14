/**
 * @description cc-admin 企业级后台管理框架 - 统一日志样式工具
 */

/* -------------------- 类型定义 -------------------- */
export interface Colors {
  red: string
  green: string
  yellow: string
  blue: string
  magenta: string
  cyan: string
  white: string
  gray: string
  reset: string
  bold: string
  dim: string
  italic: string
  underline: string
}

export interface Icons {
  success: string
  error: string
  warning: string
  info: string
  loading: string
  check: string
  cross: string
  arrow: string
  folder: string
  file: string
  gear: string
  rocket: string
  search: string
  time: string
  star: string
  heart: string
  fire: string
  sparkles: string
}

export interface ProgressBarOptions {
  width: number
  filledChar: string
  emptyChar: string
  leftBorder: string
  rightBorder: string
}

export interface TableOptions {
  showHeaders: boolean
  align: 'left' | 'center' | 'right'
  padding: number
}

/* -------------------- 颜色定义 -------------------- */
export const colors: Colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
}

/* -------------------- 图标定义 -------------------- */
export const icons: Icons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  loading: '⏳',
  check: '✓',
  cross: '✗',
  arrow: '→',
  folder: '📁',
  file: '📄',
  gear: '⚙️',
  rocket: '🚀',
  search: '🔍',
  time: '⏱️',
  star: '⭐',
  heart: '❤️',
  fire: '🔥',
  sparkles: '✨',
}

/* -------------------- 基础日志函数 -------------------- */
export const log = (msg: string, color: keyof Colors = 'reset'): void => {
  console.log(`${colors[color]}${msg}${colors.reset}`)
}

export const logBold = (msg: string, color: keyof Colors = 'reset'): void => {
  console.log(`${colors.bold}${colors[color]}${msg}${colors.reset}`)
}

export const logDim = (msg: string, color: keyof Colors = 'reset'): void => {
  console.log(`${colors.dim}${colors[color]}${msg}${colors.reset}`)
}

export const logItalic = (msg: string, color: keyof Colors = 'reset'): void => {
  console.log(`${colors.italic}${colors[color]}${msg}${colors.reset}`)
}

/* -------------------- 带图标的日志函数 -------------------- */
export const logSuccess = (msg: string): void => {
  console.log(`${icons.success} ${colors.green}${msg}${colors.reset}`)
}

export const logError = (msg: string): void => {
  console.log(`${icons.error} ${colors.red}${msg}${colors.reset}`)
}

export const logWarning = (msg: string): void => {
  console.log(`${icons.warning} ${colors.yellow}${msg}${colors.reset}`)
}

export const logInfo = (msg: string): void => {
  console.log(`${icons.info} ${colors.blue}${msg}${colors.reset}`)
}

export const logLoading = (msg: string): void => {
  console.log(`${icons.loading} ${colors.cyan}${msg}${colors.reset}`)
}

export const logFile = (msg: string): void => {
  console.log(`${icons.file} ${colors.cyan}${msg}${colors.reset}`)
}

export const logFolder = (msg: string): void => {
  console.log(`${icons.folder} ${colors.blue}${msg}${colors.reset}`)
}

export const logGear = (msg: string): void => {
  console.log(`${icons.gear} ${colors.magenta}${msg}${colors.reset}`)
}

export const logRocket = (msg: string): void => {
  console.log(`${icons.rocket} ${colors.green}${msg}${colors.reset}`)
}

export const logSearch = (msg: string): void => {
  console.log(`${icons.search} ${colors.blue}${msg}${colors.reset}`)
}

export const logTime = (msg: string): void => {
  console.log(`${icons.time} ${colors.gray}${msg}${colors.reset}`)
}

export const logStar = (msg: string): void => {
  console.log(`${icons.star} ${colors.yellow}${msg}${colors.reset}`)
}

export const logHeart = (msg: string): void => {
  console.log(`${icons.heart} ${colors.red}${msg}${colors.reset}`)
}

export const logFire = (msg: string): void => {
  console.log(`${icons.fire} ${colors.red}${msg}${colors.reset}`)
}

export const logSparkles = (msg: string): void => {
  console.log(`${icons.sparkles} ${colors.yellow}${msg}${colors.reset}`)
}

/* -------------------- 分隔线和标题 -------------------- */
export const logDivider = (
  char: string = '=',
  length: number = 60,
  color: keyof Colors = 'cyan'
): void => {
  console.log(`${colors[color]}${char.repeat(length)}${colors.reset}`)
}

export const logTitle = (title: string, color: keyof Colors = 'magenta'): void => {
  const padding = Math.max(0, (60 - title.length - 4) / 2)
  const leftPad = ' '.repeat(Math.floor(padding))
  const rightPad = ' '.repeat(Math.ceil(padding))
  console.log('')
  console.log(`${colors[color]}${leftPad}${title}${rightPad}${colors.reset}`)
  logDivider('=', 60, color)
}

export const logSubtitle = (subtitle: string, color: keyof Colors = 'blue'): void => {
  console.log(`${colors[color]}${subtitle}${colors.reset}`)
  logDivider('-', subtitle.length, color)
}

export const logSection = (section: string, color: keyof Colors = 'cyan'): void => {
  console.log('')
  console.log(`${colors[color]}${icons.arrow} ${section}${colors.reset}`)
}

/* -------------------- 进度条 -------------------- */
export class ProgressBar {
  private options: ProgressBarOptions
  private current: number = 0
  private total: number = 100

  constructor(options: Partial<ProgressBarOptions> = {}) {
    this.options = {
      width: 30,
      filledChar: '█',
      emptyChar: '░',
      leftBorder: '[',
      rightBorder: ']',
      ...options,
    }
  }

  setTotal(total: number): void {
    this.total = total
  }

  update(current: number): void {
    this.current = Math.min(Math.max(0, current), this.total)
    this.render()
  }

  increment(amount: number = 1): void {
    this.update(this.current + amount)
  }

  private render(): void {
    const percentage = this.current / this.total
    const filledWidth = Math.round(this.options.width * percentage)
    const emptyWidth = this.options.width - filledWidth

    const filled = this.options.filledChar.repeat(filledWidth)
    const empty = this.options.emptyChar.repeat(emptyWidth)
    const percentText = `${Math.round(percentage * 100)}%`

    const bar = `${this.options.leftBorder}${filled}${empty}${this.options.rightBorder}`
    const text = `${bar} ${percentText} (${this.current}/${this.total})`

    process.stdout.write(`\r${colors.cyan}${text}${colors.reset}`)
  }

  complete(): void {
    this.update(this.total)
    console.log('')
  }
}

/* -------------------- 表格输出 -------------------- */
export const logTable = (
  data: (string | number)[][],
  headers?: string[],
  options: Partial<TableOptions> = {}
): void => {
  const opts: TableOptions = {
    showHeaders: true,
    align: 'left',
    padding: 2,
    ...options,
  }

  if (opts.showHeaders && headers) {
    data.unshift(headers)
  }

  if (data.length === 0) {
    return
  }

  // 计算每列的最大宽度
  const colWidths: number[] = []
  for (let col = 0; col < data[0].length; col++) {
    let maxWidth = 0
    for (let row = 0; row < data.length; row++) {
      if (data[row][col] !== undefined) {
        maxWidth = Math.max(maxWidth, String(data[row][col]).length)
      }
    }
    colWidths[col] = maxWidth + opts.padding
  }

  // 输出表格
  data.forEach((row, rowIndex) => {
    const isHeader = opts.showHeaders && headers && rowIndex === 0

    const formattedRow = row
      .map((cell, colIndex) => {
        const cellStr = String(cell || '')
        const padding = ' '.repeat(colWidths[colIndex] - cellStr.length)
        return `${cellStr}${padding}`
      })
      .join('')

    if (isHeader) {
      logBold(formattedRow, 'cyan')
      logDivider('-', formattedRow.length, 'cyan')
    } else {
      log(formattedRow, 'reset')
    }
  })
}

/* -------------------- 统计信息 -------------------- */
export const logStats = (stats: Record<string, number | string>, title?: string): void => {
  if (title) {
    logSubtitle(title, 'blue')
  }

  const maxKeyLength = Math.max(...Object.keys(stats).map(k => k.length))

  Object.entries(stats).forEach(([key, value]) => {
    const keyPadding = ' '.repeat(maxKeyLength - key.length)
    const formattedKey = `${key}${keyPadding}`

    if (typeof value === 'number') {
      console.log(
        `${colors.cyan}${formattedKey}${colors.reset}: ${colors.green}${value}${colors.reset}`
      )
    } else {
      console.log(
        `${colors.cyan}${formattedKey}${colors.reset}: ${colors.yellow}${value}${colors.reset}`
      )
    }
  })
}

/* -------------------- 时间格式化 -------------------- */
export const formatDuration = (ms: number): string => {
  if (ms < 1000) {
    return `${ms}ms`
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`
  }
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(1)
  return `${minutes}m ${seconds}s`
}

/* -------------------- 状态指示器 -------------------- */
export const logStatus = (
  status: 'success' | 'error' | 'warning' | 'info',
  message: string,
  details?: string
): void => {
  const statusMap = {
    success: () => logSuccess(message),
    error: () => logError(message),
    warning: () => logWarning(message),
    info: () => logInfo(message),
  }

  statusMap[status]()

  if (details) {
    logDim(`   ${details}`, 'gray')
  }
}

/* -------------------- 导出所有函数 -------------------- */
export default {
  // 基础日志
  log,
  logBold,
  logDim,
  logItalic,

  // 带图标的日志
  logSuccess,
  logError,
  logWarning,
  logInfo,
  logLoading,
  logFile,
  logFolder,
  logGear,
  logRocket,
  logSearch,
  logTime,
  logStar,
  logHeart,
  logFire,
  logSparkles,

  // 布局和分隔
  logDivider,
  logTitle,
  logSubtitle,
  logSection,

  // 进度条
  progressBar: ProgressBar,

  // 表格
  logTable,

  // 统计
  logStats,

  // 工具
  formatDuration,
  logStatus,

  // 颜色和图标
  colors,
  icons,
}
