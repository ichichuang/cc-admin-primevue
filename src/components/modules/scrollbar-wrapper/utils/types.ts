import type { ComponentPublicInstance, Ref } from 'vue'

// 滚动事件数据接口
export interface ScrollEvent {
  /** 水平滚动距离 */
  scrollLeft: number
  /** 垂直滚动距离 */
  scrollTop: number
  /** 内容总宽度 */
  scrollWidth: number
  /** 内容总高度 */
  scrollHeight: number
  /** 可视区域宽度 */
  clientWidth: number
  /** 可视区域高度 */
  clientHeight: number
  /** 主要滚动方向 */
  direction: 'horizontal' | 'vertical' | 'both'
  /** 水平滚动增量 */
  deltaX?: number
  /** 垂直滚动增量 */
  deltaY?: number
}

// 滚动组件事件接口
export interface ScrollbarEmits {
  /** 包装器大小改变事件 */
  wrapperResize: (rect: Rect) => void
  /** 内容大小改变事件 */
  contentResize: (rect: Rect) => void
  /** 通用滚动事件 */
  scroll: (event: ScrollEvent) => void
  /** 水平滚动事件 */
  scrollHorizontal: (event: ScrollEvent) => void
  /** 垂直滚动事件 */
  scrollVertical: (event: ScrollEvent) => void
  /** 滚动开始事件 */
  scrollStart: () => void
  /** 滚动结束事件 */
  scrollEnd: () => void
}

// 滚动组件暴露的方法接口
export interface ScrollbarExposed {
  /** 滚动条组件引用 */
  scrollbarRef: Ref<ComponentPublicInstance<any> | undefined>
  /** 获取滚动元素 */
  getScrollEl: () => HTMLElement | null
  /** 滚动到指定位置 */
  scrollTo: (options: ScrollToOptions) => void
  /** 滚动到顶部 */
  scrollToTop: (behavior?: ScrollBehavior) => void
  /** 滚动到底部 */
  scrollToBottom: (behavior?: ScrollBehavior) => void
  /** 滚动到左侧 */
  scrollToLeft: (behavior?: ScrollBehavior) => void
  /** 滚动到右侧 */
  scrollToRight: (behavior?: ScrollBehavior) => void
  /** 添加滚动监听器 */
  addScrollListener: () => void
  /** 移除滚动监听器 */
  removeScrollListener: () => void
}

// 使用示例类型
export interface ScrollbarUsageExample {
  // 父组件中的事件处理函数示例
  onScroll: (event: ScrollEvent) => void
  onScrollHorizontal: (event: ScrollEvent) => void
  onScrollVertical: (event: ScrollEvent) => void
  onScrollStart: () => void
  onScrollEnd: () => void
}

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

export interface ScrollbarExposed {
  /** 滚动条组件引用 */
  scrollbarRef: Ref<ComponentPublicInstance<any> | undefined>
  /** 获取滚动元素 */
  getScrollEl: () => HTMLElement | null
  /** 滚动到指定位置 */
  scrollTo: (options: ScrollToOptions) => void
  /** 滚动到顶部 */
  scrollToTop: (behavior?: ScrollBehavior) => void
  /** 滚动到底部 */
  scrollToBottom: (behavior?: ScrollBehavior) => void
}
