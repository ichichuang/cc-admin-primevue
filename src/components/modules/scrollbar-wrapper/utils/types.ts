// types/scrollbar.ts

export interface Rect {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
  x: number
  y: number
}

export interface ColorScheme {
  /** 滚动条颜色 */
  thumbColor?: string
  /** 滚动条悬停颜色 */
  thumbHoverColor?: string
  /** 滚动轨道颜色 */
  trackColor?: string
  /** 滚动条占位容器颜色 */
  thumbPlaceholderColor?: string
}

export interface ScrollbarProps {
  /** 容器类名 */
  class?: string
  /** 容器样式 */
  style?: Record<string, any>
  /** 包装器类名 */
  wrapperClass?: string
  /** 包装器样式 */
  wrapperStyle?: Record<string, any>
  /** 内容容器类名 */
  contentClass?: string
  /** 内容容器样式 */
  contentStyle?: Record<string, any>
  /** 滚动方向 horizontal 水平 vertical 垂直 */
  direction?: 'horizontal' | 'vertical'
  /** 滚动条宽度 */
  thumbWidth?: number
  /** 自动隐藏 */
  autoHide?: boolean
  /** 自动隐藏延迟时间(ms) */
  autoHideDelay?: number
  /** 自动展开 */
  autoExpand?: boolean
  /** 固定滚动条 */
  fixedThumb?: boolean
  /** 节流类型 */
  throttleType?: 'throttle' | 'debounce' | 'none'
  /** 节流等待时间 */
  throttleWait?: number
  /** 模拟滚动 */
  simulateScroll?: boolean
  /** 自定义颜色方案 */
  colorScheme?: ColorScheme
}

export interface ScrollbarEmits {
  (e: 'wrapper-resize', rect: Rect): void
  (e: 'content-resize', rect: Rect): void
}

export interface ScrollbarExposed {
  /** 滚动条组件引用 */
  scrollbarRef: any
  /** 获取滚动元素 */
  getScrollEl: () => HTMLElement | null
  /** 滚动到指定位置 */
  scrollTo: (options: ScrollToOptions) => void
  /** 滚动到顶部 */
  scrollToTop: (behavior?: ScrollBehavior) => void
  /** 滚动到底部 */
  scrollToBottom: (behavior?: ScrollBehavior) => void
}
