import type { VNode } from 'vue'
import { h } from 'vue'
import type { RenderError } from './types'

/**
 * 创建错误回退组件
 */
export function createErrorFallback(error?: Error, showDetails = false): VNode {
  const errorContent = [
    h(
      'div',
      {
        style: {
          color: '#f56c6c',
          padding: '8px',
          border: '1px solid #f56c6c',
          borderRadius: '4px',
          backgroundColor: '#fef0f0',
        },
      },
      '渲染失败'
    ),
  ]

  if (showDetails && error) {
    errorContent.push(
      h('details', { style: { marginTop: '8px' } }, [
        h('summary', { style: { cursor: 'pointer' } }, '错误详情'),
        h(
          'pre',
          {
            style: {
              fontSize: '12px',
              marginTop: '8px',
              color: '#666',
              backgroundColor: '#f5f5f5',
              padding: '8px',
              borderRadius: '4px',
              overflow: 'auto',
            },
          },
          error.message
        ),
      ])
    )
  }

  return h('div', { class: 'render-tsx-error-container' }, errorContent)
}

/**
 * 创建加载状态组件
 */
export function createLoadingFallback(): VNode {
  return h(
    'div',
    {
      class: 'render-tsx-loading',
      style: {
        padding: '16px',
        textAlign: 'center',
        color: '#909399',
      },
    },
    '加载中...'
  )
}

/**
 * 验证渲染函数
 */
export function validateRenderFunction(fn: any): boolean {
  return typeof fn === 'function'
}

/**
 * 安全执行渲染函数
 */
export function safeRender(
  renderFn: (params?: any) => VNode | VNode[],
  params?: any
): VNode | VNode[] {
  try {
    return renderFn(params)
  } catch (error) {
    console.error('TSX 渲染函数执行错误:', error)
    throw error
  }
}

/**
 * 格式化错误信息
 */
export function formatRenderError(error: RenderError): string {
  return `渲染错误 [${new Date(error.timestamp).toLocaleTimeString()}]: ${error.error.message}`
}

/**
 * 检查是否为开发环境
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}
