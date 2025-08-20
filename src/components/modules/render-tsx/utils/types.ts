import type { VNode } from 'vue'

/** TSX 渲染函数类型 */
export type TSXRenderFunction = (params?: any) => VNode | VNode[]

/** RenderTSX 组件 Props 类型 */
export interface RenderTSXProps {
  /** TSX 渲染函数 */
  dom: TSXRenderFunction
  /** 传递给渲染函数的参数 */
  params?: any
  /** 是否启用错误边界 */
  errorBoundary?: boolean
  /** 错误时的回退组件 */
  fallback?: VNode | (() => VNode)
  /** 组件类名 */
  class?: string
  /** 组件样式 */
  style?: Record<string, any>
}

/** 渲染错误信息类型 */
export interface RenderError {
  error: Error
  info: string
  params?: any
  timestamp: number
}

/** 组件状态类型 */
export interface RenderTSXState {
  hasError: boolean
  error: Error | null
  lastRenderTime: number
}
