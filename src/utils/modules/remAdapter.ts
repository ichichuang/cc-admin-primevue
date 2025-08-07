/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import {
  adapterStrategies,
  breakpoints,
  debugConfig,
  deviceConfigs,
  getDeviceConfig,
  getDeviceType,
  remConfig,
} from '@/constants'
import { useSizeStoreWithOut } from '@/stores'
import { debounce } from 'lodash-es'

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

  constructor(config?: Partial<RemAdapterConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.currentFontSize = this.config.postcssRootValue
    this.currentDeviceConfig = deviceConfigs.desktop
  }

  /**
   * 根据设备信息计算合适的根字体大小
   */
  calculateRootFontSize(deviceInfo: DeviceInfo): number {
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
  }

  /**
   * 移动端优先计算策略
   */
  private calculateMobileFirstSize(viewportWidth: number): number {
    const deviceConfig = getDeviceConfig(viewportWidth)
    const scale = viewportWidth / deviceConfig.designWidth

    // 基于缩放比例计算字体大小
    let fontSize = deviceConfig.baseFontSize * scale

    // 限制字体大小范围
    const minScale = deviceConfig.minFontSize / deviceConfig.baseFontSize
    const maxScale = deviceConfig.maxFontSize / deviceConfig.baseFontSize
    const clampedScale = Math.max(minScale, Math.min(maxScale, scale))
    fontSize = deviceConfig.baseFontSize * clampedScale

    if (debugConfig.enabled) {
      console.log(
        `📱 ${adapterStrategies.mobileFirst} 缩放计算: 屏幕${viewportWidth}px / 设计稿${deviceConfig.designWidth}px = ${scale.toFixed(4)} | 字体: ${fontSize.toFixed(2)}px | 设备: ${deviceConfig.name}`
      )
    }

    return fontSize
  }

  /**
   * 桌面端优先计算策略
   */
  private calculateDesktopFirstSize(viewportWidth: number): number {
    const deviceConfig = getDeviceConfig(viewportWidth)
    const scale = viewportWidth / deviceConfig.designWidth

    // 基于缩放比例计算字体大小
    let fontSize = deviceConfig.baseFontSize * scale

    // 限制字体大小范围
    const minScale = deviceConfig.minFontSize / deviceConfig.baseFontSize
    const maxScale = deviceConfig.maxFontSize / deviceConfig.baseFontSize
    const clampedScale = Math.max(minScale, Math.min(maxScale, scale))
    fontSize = deviceConfig.baseFontSize * clampedScale

    if (debugConfig.enabled) {
      console.log(
        `🖥️ ${adapterStrategies.desktopFirst} 缩放计算: 屏幕${viewportWidth}px / 设计稿${deviceConfig.designWidth}px = ${scale.toFixed(4)} | 字体: ${fontSize.toFixed(2)}px | 设备: ${deviceConfig.name}`
      )
    }

    return fontSize
  }

  /**
   * 大屏优先计算策略
   */
  private calculateLargeScreenFirstSize(viewportWidth: number): number {
    const deviceConfig = getDeviceConfig(viewportWidth)
    const scale = viewportWidth / deviceConfig.designWidth

    // 基于缩放比例计算字体大小
    let fontSize = deviceConfig.baseFontSize * scale

    // 限制字体大小范围
    const minScale = deviceConfig.minFontSize / deviceConfig.baseFontSize
    const maxScale = deviceConfig.maxFontSize / deviceConfig.baseFontSize
    const clampedScale = Math.max(minScale, Math.min(maxScale, scale))
    fontSize = deviceConfig.baseFontSize * clampedScale

    if (debugConfig.enabled) {
      console.log(
        `🖥️ ${adapterStrategies.largeScreenFirst} 缩放计算: 屏幕${viewportWidth}px / 设计稿${deviceConfig.designWidth}px = ${scale.toFixed(4)} | 字体: ${fontSize.toFixed(2)}px | 设备: ${deviceConfig.name}`
      )
    }

    return fontSize
  }

  /**
   * 自适应计算策略（推荐）
   */
  private calculateAdaptiveSize(viewportWidth: number): number {
    const deviceConfig = getDeviceConfig(viewportWidth)
    const scale = viewportWidth / deviceConfig.designWidth

    // 基于缩放比例计算字体大小
    let fontSize = deviceConfig.baseFontSize * scale

    // 限制字体大小范围
    const minScale = deviceConfig.minFontSize / deviceConfig.baseFontSize
    const maxScale = deviceConfig.maxFontSize / deviceConfig.baseFontSize
    const clampedScale = Math.max(minScale, Math.min(maxScale, scale))
    fontSize = deviceConfig.baseFontSize * clampedScale

    if (debugConfig.enabled) {
      console.log(
        `🎯 ${adapterStrategies.adaptive} 自适应策略: ${deviceConfig.name} | 屏幕${viewportWidth}px / 设计稿${deviceConfig.designWidth}px = ${scale.toFixed(4)} | 字体: ${fontSize.toFixed(2)}px`
      )
    }

    return fontSize
  }

  /**
   * 设置根元素字体大小
   */
  setRootFontSize(deviceInfo: DeviceInfo): void {
    const fontSize = this.calculateRootFontSize(deviceInfo)
    const rootElement = document.documentElement
    const deviceConfig = getDeviceConfig(deviceInfo.screen.width)

    if (rootElement) {
      rootElement.style.fontSize = `${fontSize}px`
      this.currentFontSize = fontSize
      this.currentDeviceConfig = deviceConfig

      // 设置 CSS 变量，供其他地方使用
      rootElement.style.setProperty('--root-font-size', `${fontSize}px`)
      rootElement.style.setProperty('--rem-base', fontSize.toString())
      rootElement.style.setProperty('--postcss-root-value', this.config.postcssRootValue.toString())

      // 🎯 更新断点相关的字体大小
      this.updateBreakpointFontSize(deviceInfo.screen.width)

      // 触发自定义事件，通知其他组件字体大小已变更
      window.dispatchEvent(
        new CustomEvent('fontSizeChanged', {
          detail: {
            fontSize,
            deviceInfo,
            deviceConfig,
          },
        })
      )
    }
  }

  /**
   * 更新断点相关的字体大小
   */
  private updateBreakpointFontSize(width: number): void {
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
    sizeStore.setFontSize(fontSize)

    if (debugConfig.enabled) {
      console.log(`🎯 断点更新: ${deviceType} (宽度: ${width}px, 字体: ${fontSize})`)
    }
  }

  /**
   * 获取当前根字体大小
   */
  getCurrentFontSize(): number {
    return this.currentFontSize
  }

  /**
   * px 转 rem （开发时辅助函数）
   */
  pxToRem(px: number): string {
    return `${(px / this.config.postcssRootValue).toFixed(4)}rem`
  }

  /**
   * rem 转 px （开发时辅助函数）
   */
  remToPx(rem: number): number {
    return rem * this.config.postcssRootValue
  }

  /**
   * 获取适配信息（调试用）
   */
  getAdapterInfo(deviceInfo: DeviceInfo) {
    const deviceConfig = getDeviceConfig(deviceInfo.screen.width)
    const deviceType = getDeviceType(deviceInfo.screen.width)

    return {
      deviceType: deviceType,
      screenWidth: deviceInfo.screen.width,
      screenHeight: deviceInfo.screen.height,
      orientation: deviceInfo.screen.orientation,
      currentFontSize: this.currentFontSize,
      remBase: this.currentFontSize,
      config: this.config,
      deviceConfig,
      strategy: this.config.strategy,
    }
  }

  /**
   * 初始化适配器（智能防抖策略）
   */
  init(getDeviceInfo: () => DeviceInfo, debounceTime: number = 300): () => void {
    try {
      // 立即设置一次
      const deviceInfo = getDeviceInfo()
      this.setRootFontSize(deviceInfo)

      // 🎯 初始化完成后打印设计稿信息
      const deviceConfig = getDeviceConfig(deviceInfo.screen.width)
      const _deviceType = getDeviceType(deviceInfo.screen.width)

      console.log(
        `✅📐 rem 适配器初始化完成: 设计稿宽度=${deviceConfig.designWidth}px | 基准字体=${deviceConfig.baseFontSize}px | 当前字体=${this.currentFontSize.toFixed(2)}px | 策略=${this.config.strategy} | 设备=${deviceConfig.name}`
      )
    } catch (error) {
      console.warn('rem 适配器初始化失败:', error)
      // 使用默认配置
      this.setRootFontSize({
        type: 'PC',
        screen: {
          width: 1920,
          height: 1080,
          orientation: 'horizontal',
          deviceWidth: 1920,
          deviceHeight: 1080,
          definitely: 1080,
          navHeight: 0,
          tabHeight: 0,
        },
        system: 'Unknown',
      })
    }

    // 记录上次执行的设备信息，避免重复计算
    let lastDeviceInfo: DeviceInfo | null = null
    let lastFontSize: number = 0
    let resizeCount: number = 0
    let lastResizeTime: number = Date.now()

    // 智能防抖函数：根据设备类型和变化幅度动态调整防抖时间
    const createSmartDebouncedResize = (baseDebounceTime: number) => {
      return debounce(() => {
        const currentDeviceInfo = getDeviceInfo()
        const currentFontSize = this.calculateRootFontSize(currentDeviceInfo)
        const now = Date.now()

        // 计算变化幅度
        const widthChange = lastDeviceInfo
          ? Math.abs(currentDeviceInfo.screen.width - lastDeviceInfo.screen.width)
          : 0

        // 动态调整防抖时间
        let adaptiveDebounceTime = baseDebounceTime

        // 移动端：更敏感的响应
        if (currentDeviceInfo.type === 'Mobile') {
          adaptiveDebounceTime = Math.min(baseDebounceTime, 150)
        }

        // 大屏幕变化：更快的响应
        if (widthChange > 100) {
          adaptiveDebounceTime = Math.min(baseDebounceTime, 100)
        }

        // 频繁变化：增加防抖时间
        const timeSinceLastResize = now - lastResizeTime
        if (timeSinceLastResize < 500 && resizeCount > 5) {
          adaptiveDebounceTime = Math.min(baseDebounceTime * 2, 600)
        }

        // 只有当设备信息或字体大小发生显著变化时才执行
        const shouldUpdate =
          !lastDeviceInfo ||
          lastDeviceInfo.screen.width !== currentDeviceInfo.screen.width ||
          lastDeviceInfo.screen.height !== currentDeviceInfo.screen.height ||
          lastDeviceInfo.type !== currentDeviceInfo.type ||
          Math.abs(lastFontSize - currentFontSize) > 0.5 // 字体大小变化超过0.5px

        if (shouldUpdate) {
          this.setRootFontSize(currentDeviceInfo)
          lastDeviceInfo = currentDeviceInfo
          lastFontSize = currentFontSize
          resizeCount++
          lastResizeTime = now

          if (debugConfig.enabled) {
            console.log(
              `🎯 rem 适配已更新: ${currentFontSize.toFixed(2)}px (设备: ${getDeviceType(currentDeviceInfo.screen.width)}, 宽度: ${currentDeviceInfo.screen.width}px, 变化: ${widthChange}px, 执行次数: ${resizeCount}, 防抖时间: ${adaptiveDebounceTime}ms)`
            )
          }
        }
      }, baseDebounceTime)
    }

    // 创建智能防抖函数
    const smartDebouncedResize = createSmartDebouncedResize(debounceTime)

    // 使用 RAF 优化性能的事件处理
    let rafId: number | null = null

    const handleResize = () => {
      try {
        // 使用 RequestAnimationFrame 确保在下一帧执行
        if (rafId) {
          cancelAnimationFrame(rafId)
        }

        rafId = requestAnimationFrame(() => {
          try {
            smartDebouncedResize()
          } catch (error) {
            console.warn('rem 适配器 resize 处理失败:', error)
          }
          rafId = null
        })
      } catch (error) {
        console.warn('rem 适配器 handleResize 失败:', error)
      }
    }

    // 监听必要的事件（减少事件监听数量，使用 passive 提升性能）
    const events = [
      'resize', // 窗口大小变化
      'orientationchange', // 设备方向变化（移动端）
    ]

    events.forEach(event => {
      window.addEventListener(event, handleResize, { passive: true })
    })

    // 返回清理函数
    return () => {
      smartDebouncedResize.cancel() // 取消 lodash debounce

      // 清理 RAF
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
      }

      events.forEach(event => {
        window.removeEventListener(event, handleResize)
      })
    }
  }
}

// 创建默认实例
export const remAdapter = new RemAdapter()

/**
 * 创建大屏优先的 rem 适配器
 */
export const createLargeScreenAdapter = (config?: Partial<RemAdapterConfig>) => {
  const baseConfig = parseRemConfigFromConfig()

  return new RemAdapter({
    ...baseConfig,
    strategy: 'large-screen-first',
    ...config,
  })
}

// 工具函数：获取当前 rem 基准值
export const getRemBase = (): number => {
  const rootElement = document.documentElement
  const fontSize = window.getComputedStyle(rootElement).fontSize
  return parseFloat(fontSize) || 16
}

// 工具函数：计算相对于当前基准的 rem 值
export const toRem = (px: number): string => {
  const base = getRemBase()
  return `${(px / base).toFixed(4)}rem`
}

// 工具函数：计算 rem 对应的 px 值
export const toPx = (rem: number): number => {
  const base = getRemBase()
  return rem * base
}
