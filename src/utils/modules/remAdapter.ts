/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import {
  breakpoints,
  debugConfig,
  deviceConfigs,
  getDeviceConfig,
  getDeviceType,
  remConfig,
} from '@/constants'
import { useSizeStoreWithOut } from '@/stores'

// 导入类型定义
type FontSizeOptions = {
  label: string
  key: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xls' | 'xxl' | 'xxxl'
  value: number
}

// 从配置获取 rem 适配配置
export const parseRemConfigFromConfig = (): RemAdapterConfig => {
  return {
    strategy: remConfig.strategy as
      | 'mobile-first'
      | 'desktop-first'
      | 'large-screen-first'
      | 'adaptive',
    mobileFirst: remConfig.mobileFirst,
    postcssRootValue: remConfig.postcssRootValue,
    breakpoints: breakpoints,
  }
}

// rem 适配配置
export interface RemAdapterConfig {
  // 适配策略
  strategy: 'mobile-first' | 'desktop-first' | 'large-screen-first' | 'adaptive'
  // 是否启用移动端优先策略（兼容性）
  mobileFirst: boolean
  // PostCSS root 值
  postcssRootValue: number
  // 自定义断点配置 (与 UnoCSS 保持一致)
  breakpoints: {
    xs: number // 超小屏 (375px+)
    sm: number // 小屏 (768px+)
    md: number // 中屏 (1024px+)
    lg: number // 大屏 (1400px+)
    xl: number // 超大屏 (1660px+)
    xls: number // 特大屏 (1920px+)
    xxl: number // 超宽屏 (2560px+)
    xxxl: number // 4K屏 (3840px+)
  }
}

// 默认配置（从配置解析）
const DEFAULT_CONFIG: RemAdapterConfig = parseRemConfigFromConfig()

export class RemAdapter {
  private config: RemAdapterConfig
  private currentFontSize: number = 16
  private currentDeviceConfig: typeof deviceConfigs.mobile
  private isInitialized: boolean = false

  constructor(config?: Partial<RemAdapterConfig>) {
    try {
      this.config = { ...DEFAULT_CONFIG, ...config }
      this.currentFontSize = this.config.postcssRootValue
      this.currentDeviceConfig = deviceConfigs.desktop
    } catch (error) {
      console.error('RemAdapter 初始化失败:', error)
      // 使用默认配置
      this.config = DEFAULT_CONFIG
      this.currentFontSize = 16
      this.currentDeviceConfig = deviceConfigs.desktop
    }
  }

  /**
   * 根据设备信息计算合适的根字体大小
   */
  calculateRootFontSize(deviceInfo: DeviceInfo): number {
    try {
      const { screen } = deviceInfo
      const viewportWidth = screen.width

      // 🎯 根据适配策略选择计算方法
      switch (this.config.strategy) {
        case 'mobile-first':
          return this.calculateMobileFirstSize(viewportWidth)
        case 'desktop-first':
          return this.calculateDesktopFirstSize(viewportWidth)
        case 'large-screen-first':
          return this.calculateLargeScreenFirstSize(viewportWidth)
        case 'adaptive':
          return this.calculateAdaptiveSize(viewportWidth)
        default:
          // 兼容性：使用自适应策略
          return this.calculateAdaptiveSize(viewportWidth)
      }
    } catch (error) {
      console.error('计算根字体大小失败:', error)
      return this.config.postcssRootValue
    }
  }

  /**
   * 移动端优先计算策略
   */
  private calculateMobileFirstSize(viewportWidth: number): number {
    try {
      const deviceConfig = getDeviceConfig(viewportWidth)
      const scale = viewportWidth / deviceConfig.designWidth

      // 基于缩放比例计算字体大小
      let fontSize = deviceConfig.baseFontSize * scale

      // 限制字体大小范围
      fontSize = Math.max(deviceConfig.minFontSize, Math.min(deviceConfig.maxFontSize, fontSize))

      return Math.round(fontSize * 100) / 100 // 保留两位小数
    } catch (error) {
      console.error('移动端优先计算失败:', error)
      return this.config.postcssRootValue
    }
  }

  /**
   * 桌面端优先计算策略
   */
  private calculateDesktopFirstSize(viewportWidth: number): number {
    try {
      const deviceConfig = getDeviceConfig(viewportWidth)
      const scale = viewportWidth / deviceConfig.designWidth

      // 桌面端优先，从大屏开始计算
      let fontSize = deviceConfig.baseFontSize * scale

      // 限制字体大小范围
      fontSize = Math.max(deviceConfig.minFontSize, Math.min(deviceConfig.maxFontSize, fontSize))

      return Math.round(fontSize * 100) / 100
    } catch (error) {
      console.error('桌面端优先计算失败:', error)
      return this.config.postcssRootValue
    }
  }

  /**
   * 大屏优先计算策略
   */
  private calculateLargeScreenFirstSize(viewportWidth: number): number {
    try {
      const deviceConfig = getDeviceConfig(viewportWidth)
      const scale = viewportWidth / deviceConfig.designWidth

      // 大屏优先，适合大屏设备
      let fontSize = deviceConfig.baseFontSize * scale

      // 限制字体大小范围
      fontSize = Math.max(deviceConfig.minFontSize, Math.min(deviceConfig.maxFontSize, fontSize))

      return Math.round(fontSize * 100) / 100
    } catch (error) {
      console.error('大屏优先计算失败:', error)
      return this.config.postcssRootValue
    }
  }

  /**
   * 自适应计算策略（推荐）
   */
  private calculateAdaptiveSize(viewportWidth: number): number {
    try {
      const deviceConfig = getDeviceConfig(viewportWidth)
      const scale = viewportWidth / deviceConfig.designWidth

      // 自适应策略，根据设备类型智能调整
      let fontSize = deviceConfig.baseFontSize * scale

      // 限制字体大小范围
      fontSize = Math.max(deviceConfig.minFontSize, Math.min(deviceConfig.maxFontSize, fontSize))

      return Math.round(fontSize * 100) / 100
    } catch (error) {
      console.error('自适应计算失败:', error)
      return this.config.postcssRootValue
    }
  }

  /**
   * 设置根字体大小
   */
  setRootFontSize(deviceInfo: DeviceInfo): void {
    try {
      const newFontSize = this.calculateRootFontSize(deviceInfo)

      if (newFontSize !== this.currentFontSize) {
        this.currentFontSize = newFontSize
        this.currentDeviceConfig = getDeviceConfig(deviceInfo.screen.width)

        // 设置根元素字体大小
        document.documentElement.style.fontSize = `${newFontSize}px`

        // 设置 CSS 变量，供其他地方使用
        document.documentElement.style.setProperty('--root-font-size', `${newFontSize}px`)
        document.documentElement.style.setProperty('--rem-base', newFontSize.toString())
        document.documentElement.style.setProperty(
          '--postcss-root-value',
          this.config.postcssRootValue.toString()
        )

        // 🎯 更新断点相关的字体大小
        this.updateBreakpointFontSize(deviceInfo.screen.width)

        // 触发自定义事件，通知其他组件字体大小已变更
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('fontSizeChanged', {
              detail: {
                fontSize: newFontSize,
                deviceInfo,
                deviceConfig: this.currentDeviceConfig,
              },
            })
          )
        }

        if (debugConfig.enabled && debugConfig.showAdapterInfo) {
          console.log(`📏 RemAdapter: 字体大小已更新为 ${newFontSize}px`)
        }
      }
    } catch (error) {
      console.error('设置根字体大小失败:', error)
    }
  }

  /**
   * 更新断点字体大小 - 根据设备类型自动设置字号
   */
  private updateBreakpointFontSize(width: number): void {
    try {
      const sizeStore = useSizeStoreWithOut()
      const deviceType = getDeviceType(width)

      // 根据设备类型设置字体大小
      const fontSizeMap: Record<string, FontSizeOptions['key']> = {
        mobile: 'sm',
        tablet: 'md',
        pc: 'lg',
        largeScreen: 'xl',
        ultraWide: 'xls',
        fourK: 'xxl',
      }

      const fontSize = fontSizeMap[deviceType] || 'md'

      // 更新尺寸状态中的字体大小
      if (sizeStore && typeof sizeStore.setFontSize === 'function') {
        sizeStore.setFontSize(fontSize)
      }

      if (debugConfig.enabled && debugConfig.showBreakpointInfo) {
        console.log(`🎯 断点更新: ${deviceType} (宽度: ${width}px, 字体: ${fontSize})`)
      }
    } catch (error) {
      console.error('更新断点字体大小失败:', error)
    }
  }

  /**
   * 获取当前字体大小
   */
  getCurrentFontSize(): number {
    return this.currentFontSize
  }

  /**
   * px 转 rem
   */
  pxToRem(px: number): string {
    try {
      const rem = px / this.currentFontSize
      return `${rem}rem`
    } catch (error) {
      console.error('px转rem失败:', error)
      return `${px}px`
    }
  }

  /**
   * rem 转 px
   */
  remToPx(rem: number): number {
    try {
      return rem * this.currentFontSize
    } catch (error) {
      console.error('rem转px失败:', error)
      return rem * 16
    }
  }

  /**
   * 获取适配器信息
   */
  getAdapterInfo(deviceInfo: DeviceInfo) {
    try {
      return {
        currentFontSize: this.currentFontSize,
        deviceType: getDeviceType(deviceInfo.screen.width),
        deviceConfig: this.currentDeviceConfig,
        strategy: this.config.strategy,
        viewportWidth: deviceInfo.screen.width,
        viewportHeight: deviceInfo.screen.height,
      }
    } catch (error) {
      console.error('获取适配器信息失败:', error)
      return null
    }
  }

  /**
   * 初始化适配器
   */
  init(getDeviceInfo: () => DeviceInfo, debounceTime: number = 300): () => void {
    try {
      if (this.isInitialized) {
        console.warn('RemAdapter 已经初始化过了')
        return () => {}
      }

      this.isInitialized = true

      // 立即设置一次根字体大小和自动字号
      const deviceInfo = getDeviceInfo()
      this.setRootFontSize(deviceInfo)

      // 🎯 初始化完成后打印设计稿信息
      const deviceConfig = getDeviceConfig(deviceInfo.screen.width)
      const _deviceType = getDeviceType(deviceInfo.screen.width)

      if (debugConfig.enabled) {
        console.log(
          `✅📐 rem 适配器初始化完成: 设计稿宽度=${deviceConfig.designWidth}px | 基准字体=${deviceConfig.baseFontSize}px | 当前字体=${this.currentFontSize.toFixed(2)}px | 策略=${this.config.strategy} | 设备=${deviceConfig.name}`
        )
      }

      // 创建智能防抖函数
      const createSmartDebouncedResize = (baseDebounceTime: number) => {
        let lastWidth = deviceInfo.screen.width
        let lastHeight = deviceInfo.screen.height
        let resizeTimeout: NodeJS.Timeout | null = null
        let rafId: number | null = null

        return () => {
          const currentDeviceInfo = getDeviceInfo()
          const { width, height } = currentDeviceInfo.screen

          // 检查尺寸是否真的发生了变化
          if (width === lastWidth && height === lastHeight) {
            return
          }

          // 清除之前的定时器
          if (resizeTimeout) {
            clearTimeout(resizeTimeout)
          }

          // 使用 RAF 优化性能
          if (rafId) {
            cancelAnimationFrame(rafId)
          }

          rafId = requestAnimationFrame(() => {
            resizeTimeout = setTimeout(() => {
              try {
                // 更新根字体大小
                this.setRootFontSize(currentDeviceInfo)

                // 更新断点字体大小（自动设置字号）
                this.updateBreakpointFontSize(width)

                // 更新尺寸状态
                const sizeStore = useSizeStoreWithOut()
                if (sizeStore && typeof sizeStore.updateContentHeight === 'function') {
                  sizeStore.updateContentHeight()
                }

                // 更新最后记录的尺寸
                lastWidth = width
                lastHeight = height
              } catch (error) {
                console.error('处理窗口大小变化失败:', error)
              }
            }, baseDebounceTime)
          })
        }
      }

      const handleResize = createSmartDebouncedResize(debounceTime)

      // 监听窗口大小变化
      window.addEventListener('resize', handleResize, { passive: true })
      window.addEventListener('orientationchange', handleResize, { passive: true })

      // 返回清理函数
      return () => {
        try {
          this.isInitialized = false
          window.removeEventListener('resize', handleResize)
          window.removeEventListener('orientationchange', handleResize)

          if (debugConfig.enabled) {
            console.log('🧹 RemAdapter: 清理完成')
          }
        } catch (error) {
          console.error('清理 RemAdapter 失败:', error)
        }
      }
    } catch (error) {
      console.error('初始化 RemAdapter 失败:', error)
      return () => {}
    }
  }
}

/**
 * 创建大屏适配器
 */
export const createLargeScreenAdapter = (config?: Partial<RemAdapterConfig>) => {
  try {
    return new RemAdapter({
      ...config,
      strategy: 'large-screen-first',
    })
  } catch (error) {
    console.error('创建大屏适配器失败:', error)
    return new RemAdapter()
  }
}

/**
 * 获取当前 rem 基准值
 */
export const getRemBase = (): number => {
  try {
    const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    return isNaN(fontSize) ? 16 : fontSize
  } catch (error) {
    console.error('获取 rem 基准值失败:', error)
    return 16
  }
}

/**
 * px 转 rem 工具函数
 */
export const toRem = (px: number): string => {
  try {
    const remBase = getRemBase()
    return `${px / remBase}rem`
  } catch (error) {
    console.error('toRem 转换失败:', error)
    return `${px}px`
  }
}

/**
 * rem 转 px 工具函数
 */
export const toPx = (rem: number): number => {
  try {
    const remBase = getRemBase()
    return rem * remBase
  } catch (error) {
    console.error('toPx 转换失败:', error)
    return rem * 16
  }
}
