import type { PartialOptions } from 'overlayscrollbars'
import type { ScrollbarWrapperProps } from './types'

// ==================== 默认组件属性 ====================

/**
 * 默认组件属性配置
 * 定义 ScrollbarWrapper 组件的默认 props 值
 * 这些值会在组件未传入对应属性时使用
 */
export const defaultProps: ScrollbarWrapperProps = {
  /** 滚动方向，默认为垂直滚动 */
  direction: 'vertical',
  /** 滚动条滑块尺寸（--os-handle-perpendicular-size），0 表示使用动态计算（桌面: 6px, 移动: 4px） */
  size: 0,
  /** 鼠标悬停时的滑块尺寸（--os-handle-perpendicular-size-hover），0 表示使用 size 的值 */
  sizeHover: 0,
  /** 激活/拖拽时的滑块尺寸（--os-handle-perpendicular-size-active），0 表示使用 sizeHover 或 size 的值 */
  sizeActive: 0,
  /** 整个滚动条区域尺寸（--os-size），0 表示自动计算为 size + 4px */
  trackSize: 0,
  /** 滚动条垂直于滚动方向的内边距（--os-padding-perpendicular），0 表示使用动态计算 */
  paddingPerpendicular: 0,
  /** 滚动条沿滚动方向的内边距（--os-padding-axis），0 表示使用动态计算 */
  paddingAxis: 0,
  /** 启用点击滚动功能 */
  clickScroll: true,
  /** 启用自动隐藏功能 */
  autoHide: true,
  /** 自动隐藏延迟时间，0ms 表示立即显示 */
  autoHideDelay: 0,
  /** 使用节流模式处理滚动事件，提供更好的性能 */
  throttleType: 'throttle',
  /** 节流等待时间，16ms（约60fps） */
  throttleWait: 16,
  /** 颜色方案（可选，不传则使用系统主题色） */
  colorScheme: {},
  /** 当内容增加时自动滚动到底部，默认开启 */
  autoScrollToBottom: true,
  /** 是否记住滚动位置，默认开启 */
  rememberScrollPosition: false,
  /** 滚动位置存储的唯一标识符，如果不提供则使用组件实例的自动生成ID */
  scrollPositionKey: '',
}

// ==================== 设备适配配置 ====================

/**
 * 移动端滚动条配置
 * 针对移动设备的优化配置，滚动条更细
 */
export const mobileScrollbarConfig = {
  /** 滑块尺寸（--os-handle-perpendicular-size），移动端使用较小的尺寸 */
  size: 4,
  /** 垂直于滚动方向的内边距（--os-padding-perpendicular） */
  paddingPerpendicular: 2,
  /** 沿滚动方向的内边距（--os-padding-axis） */
  paddingAxis: 2,
}

/**
 * PC端滚动条配置
 * 针对桌面设备的配置，滚动条稍大
 */
export const desktopScrollbarConfig = {
  /** 滑块尺寸（--os-handle-perpendicular-size），桌面端使用较大的尺寸 */
  size: 8,
  /** 垂直于滚动方向的内边距（--os-padding-perpendicular） */
  paddingPerpendicular: 2,
  /** 沿滚动方向的内边距（--os-padding-axis） */
  paddingAxis: 2,
}

// ==================== 工具函数 ====================

/**
 * 根据设备类型获取配置
 * @param isMobile 是否为移动设备
 * @returns 对应的设备配置
 */
export const getDeviceConfig = (isMobile: boolean) => {
  return isMobile ? mobileScrollbarConfig : desktopScrollbarConfig
}

/**
 * 合并配置选项
 * 深度合并基础配置和自定义配置，确保所有配置项都被正确合并
 * @param baseOptions 基础配置选项
 * @param customOptions 自定义配置选项
 * @returns 合并后的配置选项
 */
export const mergeOptions = (
  baseOptions: PartialOptions,
  customOptions?: PartialOptions
): PartialOptions => {
  if (!customOptions) {
    return baseOptions
  }

  return {
    ...baseOptions,
    ...customOptions,
    // 深度合并 scrollbars 配置
    scrollbars: {
      ...baseOptions.scrollbars,
      ...customOptions.scrollbars,
    },
    // 深度合并 overflow 配置
    overflow: {
      ...baseOptions.overflow,
      ...customOptions.overflow,
    },
    // 深度合并 update 配置
    update: {
      ...baseOptions.update,
      ...customOptions.update,
    },
  }
}
