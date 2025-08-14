/**
 * 全局错误处理模块
 * 支持 Vue 应用、Pug 模板和 TSX 组件的错误处理
 */
import { env, isDev } from '@/utils'
import type { App, ComponentPublicInstance } from 'vue'
import { h } from 'vue'

/**
 * 错误类型枚举
 */
export enum ErrorType {
  JavascriptError = 'javascript_error',
  VueError = 'vue_error',
  PromiseRejection = 'promise_rejection',
  ResourceError = 'resource_error',
  NetworkError = 'network_error',
  TemplateError = 'template_error', // Pug 模板错误
  ComponentError = 'component_error', // 组件错误
}

/**
 * 错误信息接口
 */
interface ErrorInfo {
  type: ErrorType
  message: string
  stack?: string
  componentName?: string
  fileName?: string
  lineNumber?: number
  columnNumber?: number
  url?: string
  userAgent?: string
  timestamp: number
  userId?: string
  sessionId?: string
  buildVersion: string
  environment: string
}

/**
 * 错误处理配置
 */
interface ErrorHandlerConfig {
  enableConsoleLog: boolean
  enableReporting: boolean
  maxErrorCount: number
  reportUrl?: string
  ignoreErrors: string[]
  enableLocalStorage: boolean
}

/**
 * 默认配置
 */
const defaultConfig: ErrorHandlerConfig = {
  enableConsoleLog: env.debug || isDev(),
  enableReporting: !isDev(),
  maxErrorCount: 10,
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Script error',
    'Non-Error promise rejection captured',
  ],
  enableLocalStorage: true,
}

/**
 * 错误收集器类
 */
class ErrorCollector {
  private config: ErrorHandlerConfig
  private errorQueue: ErrorInfo[] = []
  private errorCount = 0
  private sessionId: string

  constructor(config: ErrorHandlerConfig) {
    this.config = { ...defaultConfig, ...config }
    this.sessionId = this.generateSessionId()
  }

  /**
   * 生成会话 ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 检查是否应该忽略错误
   */
  private shouldIgnoreError(message: string): boolean {
    return this.config.ignoreErrors.some(ignore => message.includes(ignore))
  }

  /**
   * 收集错误信息
   */
  collect(errorInfo: Partial<ErrorInfo>): void {
    if (this.errorCount >= this.config.maxErrorCount) {
      return
    }

    if (errorInfo.message && this.shouldIgnoreError(errorInfo.message)) {
      return
    }

    const fullErrorInfo: ErrorInfo = {
      type: ErrorType.JavascriptError,
      message: 'Unknown error',
      timestamp: Date.now(),
      buildVersion: env.appVersion || '0.0.0',
      environment: env.appEnv,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...errorInfo,
    }

    this.errorQueue.push(fullErrorInfo)
    this.errorCount++

    // 控制台输出
    if (this.config.enableConsoleLog) {
      this.logError(fullErrorInfo)
    }

    // 本地存储
    if (this.config.enableLocalStorage) {
      this.saveToLocalStorage(fullErrorInfo)
    }

    // 错误上报
    if (this.config.enableReporting) {
      this.reportError(fullErrorInfo)
    }
  }

  /**
   * 控制台日志输出
   */
  private logError(errorInfo: ErrorInfo): void {
    const style = 'color: #ff4757; font-weight: bold; padding: 2px 4px; border-radius: 2px;'

    console.group(`%c🚨 ${errorInfo.type.toUpperCase()}`, style)
    console.error('Message:', errorInfo.message)

    if (errorInfo.componentName) {
      console.error('Component:', errorInfo.componentName)
    }

    if (errorInfo.fileName) {
      console.error(
        'File:',
        `${errorInfo.fileName}:${errorInfo.lineNumber}:${errorInfo.columnNumber}`
      )
    }

    if (errorInfo.stack) {
      console.error('Stack:', errorInfo.stack)
    }

    console.error('Environment:', errorInfo.environment)
    console.error('Timestamp:', new Date(errorInfo.timestamp).toISOString())
    console.groupEnd()
  }

  /**
   * 保存到本地存储
   */
  private saveToLocalStorage(errorInfo: ErrorInfo): void {
    try {
      const key = `${env.piniaKeyPrefix}-errors`
      const existingErrors = JSON.parse(localStorage.getItem(key) || '[]')
      existingErrors.push(errorInfo)

      // 保持最近的 50 条错误记录
      if (existingErrors.length > 50) {
        existingErrors.splice(0, existingErrors.length - 50)
      }

      localStorage.setItem(key, JSON.stringify(existingErrors))
    } catch (error) {
      console.warn('Failed to save error to localStorage:', error)
    }
  }

  /**
   * 错误上报
   */
  private async reportError(errorInfo: ErrorInfo): Promise<void> {
    if (!this.config.reportUrl) {
      return
    }

    try {
      await fetch(this.config.reportUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo),
      })
    } catch (error) {
      console.warn('Failed to report error:', error)
    }
  }

  /**
   * 获取错误统计信息
   */
  getStats() {
    return {
      totalErrors: this.errorCount,
      queuedErrors: this.errorQueue.length,
      sessionId: this.sessionId,
    }
  }

  /**
   * 清空错误队列
   */
  clear(): void {
    this.errorQueue = []
    this.errorCount = 0
  }
}

// 全局错误收集器实例
let errorCollector: ErrorCollector

/**
 * 创建错误收集器
 */
function createErrorCollector(config?: Partial<ErrorHandlerConfig>): ErrorCollector {
  return new ErrorCollector({ ...defaultConfig, ...config })
}

/**
 * Vue 错误处理器
 */
function handleVueError(
  err: unknown,
  instance: ComponentPublicInstance | null,
  info: string
): void {
  const error = err as Error
  const componentName = instance?.$options?.name || instance?.$?.type?.name || 'Unknown'

  errorCollector.collect({
    type: ErrorType.VueError,
    message: error.message,
    stack: error.stack,
    componentName,
    fileName: info,
  })
}

/**
 * 全局 JavaScript 错误处理
 */
function handleGlobalError(event: ErrorEvent): void {
  errorCollector.collect({
    type: ErrorType.JavascriptError,
    message: event.message,
    fileName: event.filename,
    lineNumber: event.lineno,
    columnNumber: event.colno,
    stack: event.error?.stack,
  })
}

/**
 * Promise 拒绝处理
 */
function handlePromiseRejection(event: PromiseRejectionEvent): void {
  const error = event.reason

  errorCollector.collect({
    type: ErrorType.PromiseRejection,
    message: error?.message || String(error),
    stack: error?.stack,
  })
}

/**
 * 资源加载错误处理
 */
function handleResourceError(event: Event): void {
  const target = event.target as HTMLElement

  errorCollector.collect({
    type: ErrorType.ResourceError,
    message: `Failed to load resource: ${target.getAttribute('src') || target.getAttribute('href')}`,
    fileName: target.tagName,
  })
}

/**
 * 网络错误处理
 */
function handleNetworkError(error: any): void {
  errorCollector.collect({
    type: ErrorType.NetworkError,
    message: error.message || 'Network request failed',
    stack: error.stack,
  })
}

/**
 * Pug 模板错误处理
 * 专门处理 Pug 模板编译或运行时错误
 */
function handleTemplateError(error: Error, templateName?: string): void {
  errorCollector.collect({
    type: ErrorType.TemplateError,
    message: error.message,
    stack: error.stack,
    componentName: templateName,
    fileName: templateName ? `${templateName}.pug` : undefined,
  })
}

/**
 * 组件错误处理
 * 处理各种组件类型（Vue、TSX）的错误
 */
function handleComponentError(
  error: Error,
  componentName?: string,
  componentType?: 'vue' | 'tsx'
): void {
  errorCollector.collect({
    type: ErrorType.ComponentError,
    message: error.message,
    stack: error.stack,
    componentName,
    fileName: componentName ? `${componentName}.${componentType || 'vue'}` : undefined,
  })
}

/**
 * 设置全局错误处理
 */
export function setupErrorHandler(app: App, config?: Partial<ErrorHandlerConfig>): void {
  // 创建错误收集器
  errorCollector = createErrorCollector(config)

  // Vue 应用错误处理
  app.config.errorHandler = handleVueError

  // 全局 JavaScript 错误
  window.addEventListener('error', handleGlobalError)

  // Promise 拒绝错误
  window.addEventListener('unhandledrejection', handlePromiseRejection)

  // 资源加载错误
  window.addEventListener('error', handleResourceError, true)

  // 监听 Vue 警告（开发环境）
  if (isDev()) {
    app.config.warnHandler = (msg: string, instance: any, trace: string) => {
      console.warn(`Vue Warning: ${msg}`)
      if (trace) {
        console.warn('Component trace:', trace)
      }
    }
  }

  // 在全局对象上暴露错误处理函数，供模板和组件使用
  if (typeof window !== 'undefined') {
    ;(window as any).__ERROR_HANDLER__ = {
      handleTemplateError,
      handleComponentError,
      handleNetworkError,
      getStats: () => errorCollector.getStats(),
      clear: () => errorCollector.clear(),
    }
  }
}

/**
 * 手动报告错误的便捷函数
 */
export function reportError(
  error: Error | string,
  type: ErrorType = ErrorType.JavascriptError,
  extra?: any
): void {
  if (!errorCollector) {
    console.warn('Error collector not initialized')
    return
  }

  const message = typeof error === 'string' ? error : error.message
  const stack = typeof error === 'object' ? error.stack : undefined

  errorCollector.collect({
    type,
    message,
    stack,
    ...extra,
  })
}

/**
 * 创建错误边界高阶组件（用于 TSX）
 */
export function createErrorBoundary(fallbackComponent?: any) {
  return {
    name: 'ErrorBoundary',
    data() {
      return {
        hasError: false,
        error: null as Error | null,
      }
    },
    errorCaptured(error: Error, instance: any, info: string) {
      // 使用 any 类型解决 this 访问问题
      const vm = this as any
      vm.hasError = true
      vm.error = error

      handleVueError(error, instance as ComponentPublicInstance, info)

      // 阻止错误继续向上传播
      return false
    },
    render() {
      const vm = this as any
      if (vm.hasError) {
        return fallbackComponent
          ? h(fallbackComponent, { error: vm.error })
          : h('div', { class: 'error-boundary' }, [
              h('h3', '页面出现错误'),
              h('p', '请刷新页面重试'),
            ])
      }

      return vm.$slots.default?.()
    },
  }
}

/**
 * 错误恢复功能
 */
export function recoverFromError(): void {
  if (errorCollector) {
    errorCollector.clear()
  }

  // 清理本地存储中的错误记录
  const key = `${env.piniaKeyPrefix}-errors`
  localStorage.removeItem(key)

  console.log('🔄 已清理错误记录')
}

/**
 * 获取错误统计
 */
export function getErrorStats() {
  return errorCollector?.getStats() || { totalErrors: 0, queuedErrors: 0, sessionId: '' }
}

// ErrorType 已在文件开头导出
