import { useSizeStoreWithOut } from '@/stores'
import { env } from '@/utils'

// 内联配置，避免循环依赖
const breakpoints = {
  xs: 375, // 超小屏
  sm: 768, // 小屏（平板）
  md: 1024, // 中等屏（小桌面）
  lg: 1400, // 大屏（桌面）
  xl: 1660, // 超大屏
  xls: 1920, // 大屏显示器
  xxl: 2560, // 超宽屏
  xxxl: 3840, // 4K屏
} as const

const deviceConfigs = {
  mobile: {
    minWidth: 0,
    maxWidth: breakpoints.sm - 1, // 0-767px
    designWidth: 375,
    baseFontSize: 14,
    minFontSize: 12,
    maxFontSize: 18,
    name: '移动端',
  },
  tablet: {
    minWidth: breakpoints.sm,
    maxWidth: breakpoints.md - 1, // 768-1023px
    designWidth: 768,
    baseFontSize: 15,
    minFontSize: 12,
    maxFontSize: 20,
    name: '平板端',
  },
  desktop: {
    minWidth: breakpoints.md,
    maxWidth: breakpoints.xls - 1, // 1024-1919px
    designWidth: 1440,
    baseFontSize: 16,
    minFontSize: 14,
    maxFontSize: 24,
    name: '桌面端',
  },
  largeScreen: {
    minWidth: breakpoints.xls,
    maxWidth: breakpoints.xxl - 1, // 1920-2559px
    designWidth: 1920,
    baseFontSize: 18,
    minFontSize: 16,
    maxFontSize: 28,
    name: '大屏显示器',
  },
  ultraWide: {
    minWidth: breakpoints.xxl,
    maxWidth: breakpoints.xxxl - 1, // 2560-3839px
    designWidth: 2560,
    baseFontSize: 20,
    minFontSize: 18,
    maxFontSize: 32,
    name: '超宽屏',
  },
  fourK: {
    minWidth: breakpoints.xxxl,
    maxWidth: Infinity, // 3840px+
    designWidth: 3840,
    baseFontSize: 24,
    minFontSize: 20,
    maxFontSize: 48,
    name: '4K屏',
  },
} as const

// 设备类型与尺寸模式的映射
const deviceSizeMap = {
  mobile: 'compact', // 移动端默认紧凑模式
  tablet: 'comfortable', // 平板端默认舒适模式
  desktop: 'comfortable', // 桌面端默认舒适模式
  largeScreen: 'loose', // 大屏端默认宽松模式
  ultraWide: 'loose', // 超宽屏端默认宽松模式
  fourK: 'loose', // 4K屏端默认宽松模式
} as const

// 工具函数
const getDeviceType = (width: number): keyof typeof deviceConfigs => {
  // 从大到小检查，确保正确的优先级
  if (width >= breakpoints.xxxl) {
    if (env.debug) {
      console.log(`📱 设备类型检测: ${width}px >= ${breakpoints.xxxl}px -> fourK`)
    }
    return 'fourK'
  }
  if (width >= breakpoints.xxl) {
    if (env.debug) {
      console.log(`📱 设备类型检测: ${width}px >= ${breakpoints.xxl}px -> ultraWide`)
    }
    return 'ultraWide'
  }
  if (width >= breakpoints.xls) {
    if (env.debug) {
      console.log(`📱 设备类型检测: ${width}px >= ${breakpoints.xls}px -> largeScreen`)
    }
    return 'largeScreen'
  }
  if (width >= breakpoints.md) {
    if (env.debug) {
      console.log(`📱 设备类型检测: ${width}px >= ${breakpoints.md}px -> desktop`)
    }
    return 'desktop'
  }
  if (width >= breakpoints.sm) {
    if (env.debug) {
      console.log(`📱 设备类型检测: ${width}px >= ${breakpoints.sm}px -> tablet`)
    }
    return 'tablet'
  }
  if (env.debug) {
    console.log(`📱 设备类型检测: ${width}px < ${breakpoints.sm}px -> mobile`)
  }
  return 'mobile'
}

const getDeviceConfig = (width: number) => {
  const deviceType = getDeviceType(width)
  return deviceConfigs[deviceType as keyof typeof deviceConfigs]
}

const getRecommendedSize = (deviceType: keyof typeof deviceConfigs): Size => {
  const recommendedSize = deviceSizeMap[deviceType as keyof typeof deviceSizeMap] || 'comfortable'
  if (env.debug) {
    console.log(`📏 尺寸推荐: ${deviceType} -> ${recommendedSize}`)
  }
  return recommendedSize
}

// 调试函数：打印设备类型检测的详细信息
const _debugDeviceTypeDetection = (width: number) => {
  if (!env.debug) {
    return
  }

  console.log(`🔍 设备类型检测调试 - 屏幕宽度: ${width}px`)
  console.log(`📊 断点配置:`, breakpoints)

  const deviceType = getDeviceType(width)
  const deviceConfig = deviceConfigs[deviceType]
  const recommendedSize = getRecommendedSize(deviceType)

  console.log(`📱 检测结果:`, {
    deviceType,
    deviceConfig: {
      name: deviceConfig.name,
      minWidth: deviceConfig.minWidth,
      maxWidth: deviceConfig.maxWidth,
      designWidth: deviceConfig.designWidth,
    },
    recommendedSize,
  })
}

// rem 适配配置
export interface RemAdapterConfig {
  strategy: 'mobile-first' | 'desktop-first' | 'large-screen-first' | 'adaptive'
  mobileFirst: boolean
  postcssRootValue: number
  breakpoints: typeof breakpoints
}

// 默认配置
const DEFAULT_CONFIG: RemAdapterConfig = {
  strategy: 'adaptive',
  mobileFirst: false,
  postcssRootValue: 16,
  breakpoints,
}

export class RemAdapter {
  private config: RemAdapterConfig
  private currentFontSize: number = 16
  private currentDeviceConfig: any
  private isInitialized: boolean = false

  constructor(config?: Partial<RemAdapterConfig>) {
    try {
      this.config = { ...DEFAULT_CONFIG, ...config }
      this.currentFontSize = this.config.postcssRootValue
      this.currentDeviceConfig = deviceConfigs.desktop
    } catch (error) {
      console.error('RemAdapter 初始化失败:', error)
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

      switch (this.config.strategy) {
        case 'mobile-first':
          if (env.debug) {
            console.log('📐 适配策略: mobile-first-移动端优先 ✅')
          }
          return this.calculateMobileFirstSize(viewportWidth)
        case 'desktop-first':
          if (env.debug) {
            console.log('📐 适配策略: desktop-first-桌面端优先 ✅')
          }
          return this.calculateDesktopFirstSize(viewportWidth)
        case 'large-screen-first':
          if (env.debug) {
            console.log('📐 适配策略: large-screen-first-大屏优先 ✅')
          }
          return this.calculateLargeScreenFirstSize(viewportWidth)
        case 'adaptive':
          if (env.debug) {
            console.log('📐 适配策略: adaptive-自适应 ✅')
          }
          return this.calculateAdaptiveSize(viewportWidth)
        default:
          if (env.debug) {
            console.log('📐 适配策略: 默认自适应 ✅')
          }
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
      let fontSize = deviceConfig.baseFontSize * scale
      fontSize = Math.max(deviceConfig.minFontSize, Math.min(deviceConfig.maxFontSize, fontSize))
      return Math.round(fontSize * 100) / 100
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
      let fontSize = deviceConfig.baseFontSize * scale
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
      let fontSize = deviceConfig.baseFontSize * scale
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
      let fontSize = deviceConfig.baseFontSize * scale
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
      if (env.debug) {
        console.log(
          `📐 setRootFontSize 调用 - 设备宽度: ${deviceInfo.screen.width}px, 窗口宽度: ${window.innerWidth}px`
        )
      }

      const newFontSize = this.calculateRootFontSize(deviceInfo)

      if (newFontSize !== this.currentFontSize) {
        this.currentFontSize = newFontSize
        this.currentDeviceConfig = getDeviceConfig(deviceInfo.screen.width)

        document.documentElement.style.fontSize = `${newFontSize}px`
        document.documentElement.style.setProperty('--root-font-size', `${newFontSize}px`)
        document.documentElement.style.setProperty('--rem-base', newFontSize.toString())
        document.documentElement.style.setProperty(
          '--postcss-root-value',
          this.config.postcssRootValue.toString()
        )

        this.updateSizeByDevice(deviceInfo.screen.width)

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
      }
    } catch (error) {
      console.error('设置根字体大小失败:', error)
    }
  }

  /**
   * 根据设备类型更新尺寸模式
   */
  private updateSizeByDevice(width: number): void {
    try {
      // 调试设备类型检测
      _debugDeviceTypeDetection(width)

      const sizeStore = useSizeStoreWithOut()
      const deviceType = getDeviceType(width)
      const recommendedSize = getRecommendedSize(deviceType)

      // 注意：最大尺寸限制在 theme.ts 中通过 setSizeMaxLimits 实现
      // 这里只负责根据设备类型推荐合适的尺寸模式

      if (sizeStore && typeof sizeStore.setSize === 'function') {
        const currentSize = (sizeStore as any).getSize
        if (currentSize !== recommendedSize) {
          if (env.debug) {
            console.log('📐 更新尺寸模式:', recommendedSize)
          }
          sizeStore.setSize(recommendedSize)
        }
      }
    } catch (error) {
      console.error('更新尺寸模式失败:', error)
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

      const deviceInfo = getDeviceInfo()
      const deviceConfig = getDeviceConfig(deviceInfo.screen.width)
      const _deviceType = getDeviceType(deviceInfo.screen.width)

      const initInfo = {
        designWidth: deviceConfig.designWidth,
        baseFontSize: deviceConfig.baseFontSize,
        currentFontSize: this.currentFontSize.toFixed(2),
        strategy: this.config.strategy,
        deviceName: deviceConfig.name,
        deviceType: _deviceType,
        screenSize: `${deviceInfo.screen.width}x${deviceInfo.screen.height}`,
        recommendedSize: getRecommendedSize(_deviceType),
      }
      if (env.debug) {
        console.log(`📐 rem 适配器初始化完成 ✅:`, initInfo)
      }

      const createSmartDebouncedResize = (baseDebounceTime: number) => {
        let lastWidth = deviceInfo.screen.width
        let lastHeight = deviceInfo.screen.height
        let resizeTimeout: NodeJS.Timeout | null = null
        let rafId: number | null = null

        return () => {
          // 直接使用最新的窗口尺寸，避免使用可能过期的设备信息
          const currentWidth = window.innerWidth
          const currentHeight = window.innerHeight

          if (currentWidth === lastWidth && currentHeight === lastHeight) {
            return
          }

          if (resizeTimeout) {
            clearTimeout(resizeTimeout)
          }

          if (rafId) {
            cancelAnimationFrame(rafId)
          }

          rafId = requestAnimationFrame(() => {
            resizeTimeout = setTimeout(() => {
              try {
                // 创建临时的设备信息对象，使用最新的窗口尺寸
                const tempDeviceInfo: DeviceInfo = {
                  type: currentWidth >= 768 ? 'PC' : 'Mobile',
                  system: 'Unknown',
                  screen: {
                    orientation: currentWidth >= currentHeight ? 'horizontal' : 'vertical',
                    deviceWidth: window.screen.width,
                    deviceHeight: window.screen.height,
                    width: currentWidth,
                    height: currentHeight,
                    definitely: currentWidth >= currentHeight ? currentHeight : currentWidth,
                    navHeight: 0,
                    tabHeight: 0,
                  },
                }

                if (env.debug) {
                  console.log(`🔄 RemAdapter resize 处理 - 当前宽度: ${currentWidth}px`)
                }
                this.setRootFontSize(tempDeviceInfo)
                this.updateSizeByDevice(currentWidth)

                lastWidth = currentWidth
                lastHeight = currentHeight
              } catch (error) {
                console.error('处理窗口大小变化失败:', error)
              }
            }, baseDebounceTime)
          })
        }
      }

      const handleResize = createSmartDebouncedResize(debounceTime)

      window.addEventListener('resize', handleResize, { passive: true })
      window.addEventListener('orientationchange', handleResize, { passive: true })

      return () => {
        try {
          this.isInitialized = false
          window.removeEventListener('resize', handleResize)
          window.removeEventListener('orientationchange', handleResize)
          console.log('🧹 RemAdapter: 清理完成')
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
