/**
 * 断点配置（与 UnoCSS 保持一致）
 * 注意：这里使用数字格式，UnoCSS theme.ts 会自动转换为字符串格式
 */
export const breakpoints = {
  xs: 375, // 超小屏幕 - 手机端 (375px+)
  sm: 768, // 小屏幕 - 平板竖屏 (768px+)
  md: 1024, // 中等屏幕 - 平板横屏/小笔记本 (1024px+)
  lg: 1400, // 大屏幕 - 桌面端 (1400px+)
  xl: 1660, // 超大屏幕 - 大桌面 (1660px+)
  xls: 1920, // 特大屏幕 - 全高清显示器 (1920px+)
  xxl: 2560, // 超宽屏 - 2K显示器 (2560px+)
  xxxl: 3840, // 4K屏 - 4K显示器 (3840px+)
} as const

/**
 * 设备类型定义
 */
export const deviceTypes = {
  mobile: 'Mobile', // 手机端
  tablet: 'Tablet', // 平板端
  desktop: 'Desktop', // 桌面端
  largeScreen: 'LargeScreen', // 大屏显示器
  ultraWide: 'UltraWide', // 超宽屏
  fourK: 'FourK', // 4K屏
} as const

/**
 * 适配策略
 */
export const adapterStrategies = {
  mobileFirst: 'mobile-first',
  desktopFirst: 'desktop-first',
  largeScreenFirst: 'large-screen-first',
  adaptive: 'adaptive',
} as const

/**
 * 统一的设备配置接口
 */
export interface DeviceConfig {
  minWidth: number
  maxWidth?: number
  designWidth: number
  baseFontSize: number
  minFontSize: number
  maxFontSize: number
  name: string
}

/**
 * 统一的设备配置映射
 * 基于断点值精确匹配，确保与 getDeviceType 逻辑一致
 */
export const deviceConfigs: Record<string, DeviceConfig> = {
  mobile: {
    minWidth: 0,
    maxWidth: breakpoints.sm, // 768
    designWidth: 375, // 基于iPhone设计稿
    baseFontSize: 14,
    minFontSize: 12,
    maxFontSize: 18,
    name: '移动端',
  },
  tablet: {
    minWidth: breakpoints.sm, // 768
    maxWidth: breakpoints.md, // 1024
    designWidth: 768, // 基于iPad设计稿
    baseFontSize: 15,
    minFontSize: 12,
    maxFontSize: 20,
    name: '平板端',
  },
  desktop: {
    minWidth: breakpoints.md, // 1024
    maxWidth: breakpoints.xls, // 1920
    designWidth: 1440, // 基于主流桌面设计稿
    baseFontSize: 16,
    minFontSize: 14,
    maxFontSize: 24,
    name: '桌面端',
  },
  largeScreen: {
    minWidth: breakpoints.xls, // 1920
    maxWidth: breakpoints.xxl, // 2560
    designWidth: 1920, // 基于全高清设计稿
    baseFontSize: 18,
    minFontSize: 16,
    maxFontSize: 28,
    name: '大屏显示器',
  },
  ultraWide: {
    minWidth: breakpoints.xxl, // 2560
    maxWidth: breakpoints.xxxl, // 3840
    designWidth: 2560, // 基于2K设计稿
    baseFontSize: 20,
    minFontSize: 18,
    maxFontSize: 32,
    name: '超宽屏',
  },
  fourK: {
    minWidth: breakpoints.xxxl, // 3840
    designWidth: 3840, // 基于4K设计稿
    baseFontSize: 24,
    minFontSize: 20,
    maxFontSize: 48,
    name: '4K屏',
  },
} as const

/**
 * REM 适配系统配置
 */
export const remConfig = {
  // 默认策略
  strategy: 'adaptive' as keyof typeof adapterStrategies,

  // 是否启用移动端优先策略（兼容性）
  mobileFirst: false,

  // PostCSS root 值（与基准字体大小保持一致）
  postcssRootValue: 16,

  // 设备配置
  deviceConfigs,

  // 断点配置
  breakpoints,
} as const

/**
 * 调试配置
 * 🎯 优化：提供更丰富的调试选项
 */
export const debugConfig = {
  // 是否启用调试模式
  enabled: false,

  // 调试信息显示间隔（毫秒）
  logInterval: 1000,

  // 是否在控制台显示适配信息
  showAdapterInfo: false,

  // 是否显示断点信息
  showBreakpointInfo: false,

  // 是否显示字体适配信息
  showFontAdaptInfo: false,

  // 是否显示设备检测信息
  showDeviceDetection: false,

  // 是否在页面上显示调试信息（开发环境）
  showOnPageDebugInfo: false,
} as const

/**
 * 工具函数：根据屏幕宽度获取设备配置
 * 优化后的算法，直接匹配设备类型
 */
export const getDeviceConfig = (width: number): DeviceConfig => {
  const deviceType = getDeviceType(width)

  // 直接根据设备类型返回配置
  switch (deviceType) {
    case 'mobile':
      return deviceConfigs.mobile
    case 'tablet':
      return deviceConfigs.tablet
    case 'desktop':
      return deviceConfigs.desktop
    case 'largeScreen':
      return deviceConfigs.largeScreen
    case 'ultraWide':
      return deviceConfigs.ultraWide
    case 'fourK':
      return deviceConfigs.fourK
    default:
      return deviceConfigs.desktop // 默认返回桌面端配置
  }
}

/**
 * 工具函数：根据屏幕宽度获取设备类型
 * 优化后的逻辑，与 deviceConfigs 配置保持一致
 */
export const getDeviceType = (width: number): keyof typeof deviceTypes => {
  // 按照从大到小的顺序判断，确保精确匹配
  if (width >= breakpoints.xxxl) {
    // >= 3840
    return 'fourK'
  }
  if (width >= breakpoints.xxl) {
    // >= 2560
    return 'ultraWide'
  }
  if (width >= breakpoints.xls) {
    // >= 1920
    return 'largeScreen'
  }
  if (width >= breakpoints.md) {
    // >= 1024
    return 'desktop'
  }
  if (width >= breakpoints.sm) {
    // >= 768
    return 'tablet'
  }
  return 'mobile' // < 768
}

/**
 * 尺寸选项配置
 */
export const sizeOptions = [
  { label: '紧凑', value: 'compact' },
  { label: '舒适', value: 'comfortable' },
  { label: '宽松', value: 'loose' },
] as const

/**
 * 间距选项配置
 */
export const paddingOptions = [
  { label: '小', key: 'sm', value: 8 },
  { label: '中', key: 'md', value: 12 },
  { label: '大', key: 'lg', value: 16 },
] as const

/**
 * 圆角选项配置
 */
export const roundedOptions = [
  { label: '尖锐', key: 'sharp', value: 0 },
  { label: '平滑', key: 'smooth', value: 6 },
  { label: '圆滑', key: 'round', value: 12 },
  { label: '圆润', key: 'soft', value: 24 },
] as const

/**
 * 字体尺寸选项配置
 * 与设备配置的 baseFontSize 保持一致
 */
export const fontSizeOptions = [
  { label: '迷你', key: 'xs', value: 10 }, // 适用于紧凑模式
  { label: '小号', key: 'sm', value: 12 },
  { label: '中号', key: 'md', value: 14 }, // 移动端默认
  { label: '大号', key: 'lg', value: 16 }, // 桌面端默认
  { label: '特大号', key: 'xl', value: 18 }, // 大屏默认
  { label: '超特大号', key: 'xls', value: 20 }, // 超宽屏默认
  { label: '超超特大号', key: 'xxl', value: 22 },
  { label: '超超超特大号', key: 'xxxl', value: 24 }, // 4K屏默认
] as const

/**
 * 断点与字体大小的映射关系
 * 用于自动设置字体大小
 */
export const breakpointFontSizeMap = {
  mobile: 'xs', // < 768px 使用迷你字体
  tablet: 'sm', // 768-1023px 使用小字体
  desktop: 'md', // 1024-1919px 使用中等字体
  largeScreen: 'lg', // 1920-2559px 使用大字体
  ultraWide: 'xl', // 2560-3839px 使用特大字体
  fourK: 'xxl', // >= 3840px 使用超大字体
} as const

/**
 * 工具函数：根据设备类型获取推荐的字体大小
 */
export const getRecommendedFontSize = (deviceType: keyof typeof deviceTypes): string => {
  return breakpointFontSizeMap[deviceType] || 'md'
}

/**
 * 注意：布局相关配置（compactSizes, comfortableSizes, looseSizes, sizePresetsMap）
 * 仍在 theme.ts 中定义，因为它们依赖浏览器环境（window对象）
 * 如需使用这些配置，请直接从 '@/constants/modules/theme' 导入
 */

// 向后兼容的导出
export const mobileConfig = deviceConfigs.mobile
export const desktopConfig = deviceConfigs.desktop
export const largeScreenConfig = deviceConfigs.largeScreen
export const ultraWideConfig = deviceConfigs.ultraWide
export const fourKConfig = deviceConfigs.fourK
export const adaptiveConfig = {
  strategies: deviceConfigs,
}
