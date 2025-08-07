/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - REM 适配配置模块
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 断点配置（与 UnoCSS 保持一致）
 */
export const breakpoints = {
  xs: 375, // 超小屏 (375px+)
  sm: 768, // 小屏 (768px+)
  md: 1024, // 中屏 (1024px+)
  lg: 1400, // 大屏 (1400px+)
  xl: 1660, // 超大屏 (1660px+)
  xls: 1920, // 特大屏 (1920px+)
  xxl: 2560, // 超宽屏 (2560px+)
  xxxl: 3840, // 4K屏 (3840px+)
} as const

/**
 * 设备类型
 */
export const deviceTypes = {
  pc: 'PC',
  mobile: 'Mobile',
  tablet: 'Tablet',
  largeScreen: 'LargeScreen',
  ultraWide: 'UltraWide',
  fourK: 'FourK',
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
 */
export const deviceConfigs: Record<string, DeviceConfig> = {
  mobile: {
    minWidth: 0,
    maxWidth: 768,
    designWidth: 768,
    baseFontSize: 14,
    minFontSize: 12,
    maxFontSize: 18,
    name: '移动端',
  },
  tablet: {
    minWidth: 768,
    maxWidth: 1024,
    designWidth: 1024,
    baseFontSize: 15,
    minFontSize: 12,
    maxFontSize: 20,
    name: '平板',
  },
  desktop: {
    minWidth: 1024,
    maxWidth: 1920,
    designWidth: 1800,
    baseFontSize: 16,
    minFontSize: 12,
    maxFontSize: 28,
    name: '桌面端',
  },
  largeScreen: {
    minWidth: 1920,
    maxWidth: 2560,
    designWidth: 2560,
    baseFontSize: 18,
    minFontSize: 14,
    maxFontSize: 32,
    name: '大屏',
  },
  ultraWide: {
    minWidth: 2560,
    maxWidth: 3840,
    designWidth: 3200,
    baseFontSize: 20,
    minFontSize: 16,
    maxFontSize: 36,
    name: '超大屏',
  },
  fourK: {
    minWidth: 3840,
    designWidth: 3840,
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
} as const

/**
 * 工具函数：根据屏幕宽度获取设备配置
 */
export const getDeviceConfig = (width: number): DeviceConfig => {
  const configs = Object.values(deviceConfigs)

  // 按最小宽度降序排列，找到第一个匹配的配置
  const sortedConfigs = configs.sort((a, b) => b.minWidth - a.minWidth)

  for (const config of sortedConfigs) {
    if (width >= config.minWidth && (!config.maxWidth || width < config.maxWidth)) {
      return config
    }
  }

  // 默认返回桌面端配置
  return deviceConfigs.desktop
}

/**
 * 工具函数：获取设备类型
 */
export const getDeviceType = (width: number): keyof typeof deviceTypes => {
  if (width >= 3840) {
    return 'fourK'
  }
  if (width >= 2560) {
    return 'ultraWide'
  }
  if (width >= 1920) {
    return 'largeScreen'
  }
  if (width >= 1024) {
    return 'pc'
  }
  if (width >= 768) {
    return 'tablet'
  }
  return 'mobile'
}

// 向后兼容的导出
export const mobileConfig = deviceConfigs.mobile
export const desktopConfig = deviceConfigs.desktop
export const largeScreenConfig = deviceConfigs.largeScreen
export const ultraWideConfig = deviceConfigs.ultraWide
export const fourKConfig = deviceConfigs.fourK
export const adaptiveConfig = {
  strategies: deviceConfigs,
}
