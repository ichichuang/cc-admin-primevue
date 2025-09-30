import type { PartialOptions } from 'overlayscrollbars'
import type { ColorScheme, ScrollbarWrapperProps } from './types'

// ==================== 默认颜色方案 ====================

/**
 * 默认颜色方案配置
 * 使用固定的颜色值，确保滚动条可见
 * 所有属性都是必需的，提供完整的颜色配置
 */
export const defaultColorScheme: Required<ColorScheme> = {
  /** 滚动条滑块默认颜色 */
  // thumbColor: 'var(--bg300)',
  thumbColor: 'var(--bg300)',
  /** 滚动条滑块悬停颜色 */
  thumbHoverColor: 'var(--primary200)',
  /** 滚动条滑块激活颜色   */
  thumbActiveColor: 'var(--primary100)',
  /** 滚动条轨道默认颜色 */
  trackColor: 'var(--bg100)',
  /** 滚动条轨道悬停颜色 */
  trackHoverColor: 'var(--bg200)',
  /** 滚动条轨道激活颜色 */
  trackActiveColor: 'var(--bg300)',
  /** 滚动条边框默认颜色 */
  borderColor: 'transparent',
  /** 滚动条悬停边框颜色 */
  borderHoverColor: 'var(--bg200)',
  /** 滚动条激活边框颜色 */
  borderActiveColor: 'var(--bg300)',
}

/**
 * 应用颜色方案到 CSS 变量
 * 将 JS 颜色方案对象映射到 CSS 变量，供样式消费
 * @param scheme 颜色方案对象
 * @param element 目标元素，默认为根元素
 */
export const applyColorScheme = (
  scheme: ColorScheme,
  element: HTMLElement = document.documentElement
) => {
  // 映射到与 CSS 中使用的变量名一致的 CSS 变量名
  element.style.setProperty('--os-thumb-bg', scheme.thumbColor || defaultColorScheme.thumbColor)
  element.style.setProperty(
    '--os-thumb-bg-hover',
    scheme.thumbHoverColor || defaultColorScheme.thumbHoverColor
  )
  element.style.setProperty(
    '--os-thumb-bg-active',
    scheme.thumbActiveColor || defaultColorScheme.thumbActiveColor
  )
  element.style.setProperty('--os-track-bg', scheme.trackColor || defaultColorScheme.trackColor)
  element.style.setProperty(
    '--os-track-bg-hover',
    scheme.trackHoverColor || defaultColorScheme.trackHoverColor
  )
  element.style.setProperty(
    '--os-track-bg-active',
    scheme.trackActiveColor || defaultColorScheme.trackActiveColor
  )
  element.style.setProperty(
    '--os-thumb-border',
    scheme.borderColor || defaultColorScheme.borderColor
  )
  element.style.setProperty(
    '--os-thumb-border-hover',
    scheme.borderHoverColor || defaultColorScheme.borderHoverColor
  )
  element.style.setProperty(
    '--os-thumb-border-active',
    scheme.borderActiveColor || defaultColorScheme.borderActiveColor
  )
  element.style.setProperty(
    '--os-track-border',
    scheme.borderColor || defaultColorScheme.borderColor
  )
  element.style.setProperty(
    '--os-track-border-hover',
    scheme.borderHoverColor || defaultColorScheme.borderHoverColor
  )
  element.style.setProperty(
    '--os-track-border-active',
    scheme.borderActiveColor || defaultColorScheme.borderActiveColor
  )
}

/**
 * 获取颜色方案对应的 CSS 变量映射
 * 返回一个对象，包含所有颜色方案对应的 CSS 变量值
 * @param scheme 颜色方案对象
 * @returns CSS 变量映射对象
 */
export const getColorSchemeVars = (scheme: ColorScheme) => {
  return {
    '--os-thumb-bg': scheme.thumbColor || defaultColorScheme.thumbColor,
    '--os-thumb-bg-hover': scheme.thumbHoverColor || defaultColorScheme.thumbHoverColor,
    '--os-thumb-bg-active': scheme.thumbActiveColor || defaultColorScheme.thumbActiveColor,
    '--os-track-bg': scheme.trackColor || defaultColorScheme.trackColor,
    '--os-track-bg-hover': scheme.trackHoverColor || defaultColorScheme.trackHoverColor,
    '--os-track-bg-active': scheme.trackActiveColor || defaultColorScheme.trackActiveColor,
    '--os-thumb-border': scheme.borderColor || defaultColorScheme.borderColor,
    '--os-thumb-border-hover': scheme.borderHoverColor || defaultColorScheme.borderHoverColor,
    '--os-thumb-border-active': scheme.borderActiveColor || defaultColorScheme.borderActiveColor,
    '--os-track-border': scheme.borderColor || defaultColorScheme.borderColor,
    '--os-track-border-hover': scheme.borderHoverColor || defaultColorScheme.borderHoverColor,
    '--os-track-border-active': scheme.borderActiveColor || defaultColorScheme.borderActiveColor,
  }
}

// ==================== 默认组件属性 ====================

/**
 * 默认组件属性配置
 * 定义 ScrollbarWrapper 组件的默认 props 值
 * 这些值会在组件未传入对应属性时使用
 */
export const defaultProps: ScrollbarWrapperProps = {
  /** 滚动方向，默认为垂直滚动 */
  direction: 'vertical',
  /** 滚动条尺寸，0 表示使用动态计算（根据设备类型） */
  size: 0,
  /** 滚动条轴垂直填充，0 表示使用动态计算 */
  paddingPerpendicular: 0,
  /** 滚动条轴填充，0 表示使用动态计算 */
  paddingAxis: 0,
  /** 启用点击滚动功能 */
  clickScroll: true,
  /** 点击滚动步长，每次点击滚动 1 页 */
  clickScrollStep: 1,
  /** 点击滚动动画持续时间，300ms */
  clickScrollDuration: 300,
  /** 点击滚动缓动函数，使用 ease-out */
  clickScrollEasing: 'ease-out',
  /** 启用自动隐藏功能 */
  autoHide: true,
  /** 自动隐藏延迟时间，0ms 表示立即显示 */
  autoHideDelay: 0,
  /** 启用自动展开功能 */
  autoExpand: true,
  /** 不固定滚动条滑块 */
  fixedThumb: false,
  /** 使用节流模式处理滚动事件，提供更好的性能 */
  throttleType: 'throttle',
  /** 节流等待时间，16ms（约60fps） */
  throttleWait: 16,
  /** 不模拟滚动行为 */
  simulateScroll: false,
  /** 使用默认颜色方案 */
  colorScheme: defaultColorScheme,
}

// ==================== 默认 OverlayScrollbars 选项 ====================

/**
 * 默认 OverlayScrollbars 选项配置
 * 直接传递给 OverlayScrollbars 实例的配置选项
 * 这些配置会与组件 props 合并后使用
 */
export const defaultOverlayScrollbarsOptions: PartialOptions = {
  /** 滚动条相关配置 */
  scrollbars: {
    /** 滚动条可见性，auto 表示自动显示/隐藏 */
    visibility: 'auto',
    /** 自动隐藏行为，leave 表示鼠标离开时隐藏 */
    autoHide: 'leave',
    /** 自动隐藏延迟时间，设置为 0 表示立即显示 */
    autoHideDelay: 0,
    /** 启用点击滚动 */
    clickScroll: true,
    /** 启用拖拽滚动 */
    dragScroll: true,
    /** 支持的输入设备类型 */
    pointers: ['mouse', 'touch', 'pen'],
  },
  /** 溢出行为配置 */
  overflow: {
    /** 水平方向溢出处理 */
    x: 'scroll',
    /** 垂直方向溢出处理 */
    y: 'scroll',
  },
  /** 不使用绝对定位填充 */
  paddingAbsolute: false,
  /** 不显示原生覆盖滚动条 */
  showNativeOverlaidScrollbars: false,
  /** 更新配置 */
  update: {
    /** 监听图片加载事件以更新滚动条 */
    elementEvents: [['img', 'load']],
    /** 防抖配置：[初始延迟, 最小延迟, 最大延迟] */
    debounce: [0, 33, 100] as any,
    /** 监听的属性变化 */
    attributes: [['data-overlayscrollbars', '']] as any,
    /** 忽略的 DOM 变化 */
    ignoreMutation: null,
  },
}

// ==================== 设备适配配置 ====================

/**
 * 移动端滚动条配置
 * 针对移动设备的优化配置，滚动条更细，动画更快
 */
export const mobileScrollbarConfig = {
  /** 滚动条尺寸，移动端使用较小的尺寸 */
  size: 4,
  /** 滚动条轴垂直填充 */
  paddingPerpendicular: 2,
  /** 滚动条轴填充 */
  paddingAxis: 2,
  /** 点击滚动步长 */
  clickScrollStep: 1,
  /** 点击滚动动画持续时间，移动端使用更快的动画 */
  clickScrollDuration: 200,
}

/**
 * PC端滚动条配置
 * 针对桌面设备的配置，滚动条稍大，动画稍慢
 */
export const desktopScrollbarConfig = {
  /** 滚动条尺寸，桌面端使用较大的尺寸 */
  size: 6,
  /** 滚动条轴垂直填充 */
  paddingPerpendicular: 3,
  /** 滚动条轴填充 */
  paddingAxis: 3,
  /** 点击滚动步长 */
  clickScrollStep: 1,
  /** 点击滚动动画持续时间，桌面端使用较慢的动画 */
  clickScrollDuration: 300,
}

// ==================== 预设配置 ====================

/**
 * 预设配置集合
 * 提供常用的滚动条配置预设，方便快速使用
 */
export const presetConfigs = {
  /** 默认配置，使用基础配置 */
  default: defaultOverlayScrollbarsOptions,
  /** 移动端配置，针对移动设备优化 */
  mobile: {
    ...defaultOverlayScrollbarsOptions,
    scrollbars: {
      ...defaultOverlayScrollbarsOptions.scrollbars,
      ...mobileScrollbarConfig,
    },
  },
  /** PC端配置，针对桌面设备优化 */
  desktop: {
    ...defaultOverlayScrollbarsOptions,
    scrollbars: {
      ...defaultOverlayScrollbarsOptions.scrollbars,
      ...desktopScrollbarConfig,
    },
  },
  /** 最小化配置，隐藏滚动条但保持功能 */
  minimal: {
    ...defaultOverlayScrollbarsOptions,
    scrollbars: {
      ...defaultOverlayScrollbarsOptions.scrollbars,
      visibility: 'hidden',
      autoHide: 'never',
    },
  },
  /** 始终显示配置，滚动条始终可见 */
  always: {
    ...defaultOverlayScrollbarsOptions,
    scrollbars: {
      ...defaultOverlayScrollbarsOptions.scrollbars,
      visibility: 'visible',
      autoHide: 'never',
    },
  },
} as const

// ==================== CSS 样式配置 ====================

/**
 * 默认 CSS 样式配置
 * 定义滚动条的基础样式属性
 */
export const defaultCssConfig = {
  /** 滚动条轨道边框圆角 */
  trackBorderRadius: '0px',
  /** 滚动条轨道边框颜色 */
  trackBorder: 'transparent',
  /** 滚动条轨道悬停边框颜色 */
  trackBorderHover: 'transparent',
  /** 滚动条轨道激活边框颜色 */
  trackBorderActive: 'transparent',
  /** 滚动条滑块边框圆角 */
  thumbBorderRadius: '0px',
  /** 滚动条滑块最小尺寸 */
  thumbMinSize: '20px',
  /** 滚动条滑块最大尺寸 */
  thumbMaxSize: 'none',
  /** 滚动条过渡动画 */
  transition: 'all 0.2s ease',
  /** 滚动条基础样式 */
  baseStyles: {
    padding: '0',
    cursor: 'pointer',
  },
}

/**
 * 默认视口样式配置
 */
export const defaultViewportConfig = {
  /** 水平溢出处理 */
  overflowX: 'auto',
  /** 垂直溢出处理 */
  overflowY: 'auto',
}

/**
 * 默认内容区域样式配置
 */
export const defaultContentConfig = {
  /** 内容区域填充 */
  padding: '0',
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
