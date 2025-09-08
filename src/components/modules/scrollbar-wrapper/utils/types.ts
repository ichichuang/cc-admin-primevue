import type { OverlayScrollbars, PartialOptions } from 'overlayscrollbars'
import type { Ref } from 'vue'

// ==================== 基础类型定义 ====================

/**
 * 矩形区域信息接口
 * 用于描述元素的位置和尺寸信息，通常由 ResizeObserver 或 getBoundingClientRect 返回
 */
export interface Rect {
  /** 左边界位置 */
  left: number
  /** 上边界位置 */
  top: number
  /** 右边界位置 */
  right: number
  /** 下边界位置 */
  bottom: number
  /** 宽度 */
  width: number
  /** 高度 */
  height: number
  /** X 坐标（等同于 left） */
  x: number
  /** Y 坐标（等同于 top） */
  y: number
}

/**
 * 滚动事件数据接口
 * 包含滚动时的所有相关信息，用于滚动事件回调
 */
export interface ScrollEvent {
  /** 水平滚动距离（像素） */
  scrollLeft: number
  /** 垂直滚动距离（像素） */
  scrollTop: number
  /** 内容总宽度（包含不可见部分） */
  scrollWidth: number
  /** 内容总高度（包含不可见部分） */
  scrollHeight: number
  /** 可视区域宽度 */
  clientWidth: number
  /** 可视区域高度 */
  clientHeight: number
  /** 主要滚动方向，基于滚动增量计算 */
  direction: 'horizontal' | 'vertical' | 'both'
  /** 水平滚动增量（相对于上次滚动位置的变化量） */
  deltaX?: number
  /** 垂直滚动增量（相对于上次滚动位置的变化量） */
  deltaY?: number
}

// ==================== OverlayScrollbars 配置类型 ====================

/**
 * 滚动条尺寸配置接口
 * 定义滚动条的尺寸和填充相关属性
 */
export interface ScrollbarSize {
  /** 滚动条宽度/高度（像素） */
  size?: number
  /** 滚动条轴垂直填充（水平滚动条为上下填充，垂直滚动条为左右填充） */
  paddingPerpendicular?: number
  /** 滚动条轴填充（水平滚动条为左右填充，垂直滚动条为上下填充） */
  paddingAxis?: number
}

// ==================== 组件 Props 类型 ====================

/**
 * 滚动条组件属性接口
 * 定义 ScrollbarWrapper 组件接受的所有 props
 */
export interface ScrollbarWrapperProps {
  /** 容器类名 */
  class?: string
  /** 容器样式对象 */
  style?: Record<string, any>
  /** 包装器类名 */
  wrapperClass?: string
  /** 包装器样式对象 */
  wrapperStyle?: Record<string, any>
  /** 内容容器类名 */
  contentClass?: string
  /** 内容容器样式对象 */
  contentStyle?: Record<string, any>
  /** 滚动方向：水平、垂直或双向 */
  direction?: 'horizontal' | 'vertical' | 'both'
  /** 滚动条尺寸（像素），0 表示使用动态计算 */
  size?: number
  /** 滚动条轴垂直填充（像素），0 表示使用动态计算 */
  paddingPerpendicular?: number
  /** 滚动条轴填充（像素），0 表示使用动态计算 */
  paddingAxis?: number
  /** 是否启用点击滚动功能 */
  clickScroll?: boolean
  /** 点击滚动时的步长（页面数） */
  clickScrollStep?: number
  /** 点击滚动的动画持续时间（毫秒） */
  clickScrollDuration?: number
  /** 点击滚动的缓动函数（CSS easing 值） */
  clickScrollEasing?: string
  /** 是否自动隐藏滚动条，或指定自动隐藏行为 */
  autoHide?: boolean | 'scroll' | 'leave' | 'move' | 'never'
  /** 自动隐藏延迟时间（毫秒） */
  autoHideDelay?: number
  /** 是否自动展开滚动条 */
  autoExpand?: boolean
  /** 是否固定滚动条滑块 */
  fixedThumb?: boolean
  /** 滚动事件节流类型 */
  throttleType?: 'throttle' | 'debounce' | 'none'
  /** 节流等待时间（毫秒） */
  throttleWait?: number
  /** 是否模拟滚动行为 */
  simulateScroll?: boolean
  /** 自定义颜色方案 */
  colorScheme?: ColorScheme
  /** 自定义 OverlayScrollbars 选项配置 */
  options?: PartialOptions
}

// ==================== 事件类型 ====================

/**
 * 滚动组件事件接口
 * 定义 ScrollbarWrapper 组件发出的所有事件
 */
export interface ScrollbarEmits {
  /** 包装器大小改变事件，当包装器尺寸发生变化时触发 */
  wrapperResize: (rect: Rect) => void
  /** 内容大小改变事件，当内容尺寸发生变化时触发 */
  contentResize: (rect: Rect) => void
  /** 通用滚动事件，每次滚动时都会触发 */
  scroll: (event: ScrollEvent) => void
  /** 水平滚动事件，仅在水平方向滚动时触发 */
  scrollHorizontal: (event: ScrollEvent) => void
  /** 垂直滚动事件，仅在垂直方向滚动时触发 */
  scrollVertical: (event: ScrollEvent) => void
  /** 滚动开始事件，滚动开始时触发一次 */
  scrollStart: () => void
  /** 滚动结束事件，滚动停止后触发 */
  scrollEnd: () => void
  /** OverlayScrollbars 初始化完成事件，组件初始化完成后触发 */
  initialized: (instance: OverlayScrollbars) => void
  /** OverlayScrollbars 更新事件，配置更新后触发 */
  updated: (instance: OverlayScrollbars) => void
  /** OverlayScrollbars 销毁事件，组件销毁时触发 */
  destroyed: () => void
}

// ==================== 暴露方法类型 ====================

/**
 * 滚动组件暴露的方法接口
 * 定义 ScrollbarWrapper 组件通过 defineExpose 暴露给父组件的方法和属性
 */
export interface ScrollbarExposed {
  /** OverlayScrollbars 实例引用，用于直接访问 Vue 组件实例 */
  overlayScrollbarsRef: Ref<any>
  /** 获取 OverlayScrollbars 实例，返回当前滚动条实例或 null */
  getOverlayScrollbars: () => OverlayScrollbars | null
  /** 获取滚动元素，返回实际的滚动 DOM 元素 */
  getScrollEl: () => HTMLElement | null
  /** 获取视口元素，返回 OverlayScrollbars 的视口元素 */
  getViewport: () => HTMLElement | null
  /** 获取内容元素，返回 OverlayScrollbars 的内容元素 */
  getContent: () => HTMLElement | null
  /** 滚动到指定位置，支持 ScrollToOptions 参数 */
  scrollTo: (options: ScrollToOptions) => void
  /** 滚动到顶部，可选择滚动行为（smooth/instant/auto） */
  scrollToTop: (behavior?: ScrollBehavior) => void
  /** 滚动到底部，可选择滚动行为 */
  scrollToBottom: (behavior?: ScrollBehavior) => void
  /** 滚动到左侧，可选择滚动行为 */
  scrollToLeft: (behavior?: ScrollBehavior) => void
  /** 滚动到右侧，可选择滚动行为 */
  scrollToRight: (behavior?: ScrollBehavior) => void
  /** 添加滚动监听器，手动添加滚动事件监听 */
  addScrollListener: () => void
  /** 移除滚动监听器，手动移除滚动事件监听 */
  removeScrollListener: () => void
  /** 更新 OverlayScrollbars 选项，动态修改滚动条配置 */
  updateOptions: (options: PartialOptions) => void
  /** 销毁 OverlayScrollbars 实例，清理资源 */
  destroy: () => void
}

// ==================== 颜色方案类型 ====================

/**
 * 自定义颜色方案接口
 * 定义滚动条各个状态下的颜色配置
 */
export interface ColorScheme {
  /** 滚动条滑块默认颜色（CSS 颜色值） */
  thumbColor?: string
  /** 滚动条滑块悬停时的颜色 */
  thumbHoverColor?: string
  /** 滚动条滑块激活时的颜色 */
  thumbActiveColor?: string
  /** 滚动条轨道默认颜色 */
  trackColor?: string
  /** 滚动条轨道悬停时的颜色 */
  trackHoverColor?: string
  /** 滚动条轨道激活时的颜色 */
  trackActiveColor?: string
  /** 滚动条边框默认颜色 */
  borderColor?: string
  /** 滚动条悬停时的边框颜色 */
  borderHoverColor?: string
  /** 滚动条激活时的边框颜色 */
  borderActiveColor?: string
}
