/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 状态管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/* 尺寸配置 */
import { cloneDeep, toKebabCase } from '@/common'
import {
  comfortableSizes,
  fontSizeOptions,
  paddingOptions,
  roundedOptions,
  sizeOptions,
  sizePresetsMap,
} from '@/constants'
import store, { useLayoutStoreWithOut } from '@/stores'
import { env } from '@/utils'
import { defineStore } from 'pinia'

export const useSizeStore = defineStore('size', {
  state: (): SizeState => ({
    size: 'comfortable',
    sizeOptions,

    sizes: cloneDeep(comfortableSizes),

    padding: 'md',
    paddingOptions,

    rounded: 'smooth',
    roundedOptions,

    fontSize: 'md',
    fontSizeOptions,
  }),

  getters: {
    // 获取尺寸模式
    isCompact: state => state.size === 'compact',
    isComfortable: state => state.size === 'comfortable',
    isLoose: state => state.size === 'loose',
    getSizeOptions: state => state.sizeOptions,
    getSize: state => state.size,
    getSizeLabel: state => state.sizeOptions.find(option => option.value === state.size)?.label,

    /* 尺寸变量配置相关 layout */
    // 获取侧边栏宽度
    getSidebarWidth: state => state.sizes.sidebarWidth,
    // 获取侧边栏折叠宽度
    getSidebarCollapsedWidth: state => state.sizes.sidebarCollapsedWidth,
    // 获取头部高度
    getHeaderHeight: state => state.sizes.headerHeight,
    // 获取面包屑高度
    getBreadcrumbHeight: state => state.sizes.breadcrumbHeight,
    // 获取底部高度
    getFooterHeight: state => state.sizes.footerHeight,
    // 获取标签页高度
    getTabsHeight: state => state.sizes.tabsHeight,
    // 获取内容区域高度
    getContentHeight: state => state.sizes.contentHeight,
    // 获取内容区域高度(不包含头部、底部)
    getContentsHeight: state => state.sizes.contentsHeight,
    // 获取间距
    getGap: state => state.sizes.gap,
    getGaps: state => state.sizes.gap / 2,
    getGapx: state => state.sizes.gap + state.sizes.gap / 2,
    getGapl: state => state.sizes.gap * 2,

    /* 尺寸变量配置相关 padding */
    // 获取间距尺寸
    getPadding: state => {
      try {
        const paddingOptions = state.paddingOptions
        const padding = paddingOptions.find(
          option => option.key === state.padding
        ) as PaddingOptions
        return padding.key
      } catch (error) {
        console.error('获取 padding 失败:', error)
        return 'md'
      }
    },
    // 获取当前间距的具体数值
    getPaddingValue: state => {
      try {
        return state.paddingOptions.find(option => option.key === state.padding)?.value as number
      } catch (error) {
        console.error('获取 paddingValue 失败:', error)
        return 12
      }
    },
    // 获取间距尺寸
    getPaddingsValue: state => {
      try {
        const paddingOptions = state.paddingOptions
        const padding = paddingOptions.find(
          option => option.key === state.padding
        ) as PaddingOptions
        return (padding.value / 2) as number
      } catch (error) {
        console.error('获取 paddingsValue 失败:', error)
        return 6
      }
    },
    getPaddingxValue: state => {
      try {
        const paddingOptions = state.paddingOptions
        const padding = paddingOptions.find(
          option => option.key === state.padding
        ) as PaddingOptions
        return (padding.value + padding.value / 2) as number
      } catch (error) {
        console.error('获取 paddingxValue 失败:', error)
        return 18
      }
    },
    getPaddinglValue: state => {
      try {
        const paddingOptions = state.paddingOptions
        const padding = paddingOptions.find(
          option => option.key === state.padding
        ) as PaddingOptions
        return (padding.value * 2) as number
      } catch (error) {
        console.error('获取 paddinglValue 失败:', error)
        return 24
      }
    },
    // 获取间距尺寸标签
    getPaddingLabel: state => {
      try {
        return state.paddingOptions.find(option => option.key === state.padding)?.label
      } catch (error) {
        console.error('获取 paddingLabel 失败:', error)
        return '中'
      }
    },
    // 获取间距选项
    getPaddingOptions: state => state.paddingOptions,

    /* 尺寸变量配置相关 rounded */
    // 获取圆角尺寸
    getRounded: state => state.rounded,
    // 获取圆角尺寸的具体数值
    getRoundedValue: state => {
      try {
        return state.roundedOptions.find(option => option.key === state.rounded)?.value as number
      } catch (error) {
        console.error('获取 roundedValue 失败:', error)
        return 6
      }
    },
    // 获取圆角尺寸标签
    getRoundedLabel: state => {
      try {
        return state.roundedOptions.find(option => option.key === state.rounded)?.label
      } catch (error) {
        console.error('获取 roundedLabel 失败:', error)
        return '平滑'
      }
    },
    // 获取圆角尺寸选项
    getRoundedOptions: state => state.roundedOptions,

    /* 字体尺寸相关 */
    getFontSize: state => state.fontSize,
    getFontSizeOptions: state => state.fontSizeOptions,
    getFontSizeValue: state => {
      try {
        return state.fontSizeOptions.find(option => option.key === state.fontSize)?.value
      } catch (error) {
        console.error('获取 fontSizeValue 失败:', error)
        return 14
      }
    },
    getFontSizeLabel: state => {
      try {
        return state.fontSizeOptions.find(option => option.key === state.fontSize)?.label
      } catch (error) {
        console.error('获取 fontSizeLabel 失败:', error)
        return '中号'
      }
    },
    getFontSizesValue: state => {
      try {
        return (
          (state.fontSizeOptions.find(option => option.key === state.fontSize)?.value as number) / 2
        )
      } catch (error) {
        console.error('获取 fontSizesValue 失败:', error)
        return 7
      }
    },
    getFontSizexValue: state => {
      try {
        return (
          (state.fontSizeOptions.find(option => option.key === state.fontSize)?.value as number) +
          (state.fontSizeOptions.find(option => option.key === state.fontSize)?.value as number) / 2
        )
      } catch (error) {
        console.error('获取 fontSizexValue 失败:', error)
        return 21
      }
    },
    getFontSizelValue: state => {
      try {
        return (
          (state.fontSizeOptions.find(option => option.key === state.fontSize)?.value as number) * 2
        )
      } catch (error) {
        console.error('获取 fontSizelValue 失败:', error)
        return 28
      }
    },
  },

  actions: {
    /* 内容高度计算 */
    // 计算内容区域高度
    calculateContentHeight() {
      try {
        const layoutStore = useLayoutStoreWithOut()
        const screenHeight = layoutStore.getHeight

        let contentOccupiedHeight = 0 // contentHeight 占用的高度
        let contentsOccupiedHeight = 0 // contentsHeight 占用的高度

        // 如果显示头部
        if (layoutStore.getShowHeader) {
          contentOccupiedHeight += this.sizes.headerHeight
          contentsOccupiedHeight += this.sizes.headerHeight
        }

        // 如果显示标签页
        if (layoutStore.getShowTabs) {
          contentOccupiedHeight += this.sizes.tabsHeight
          // contentsHeight 包含标签页，所以不加入 contentsOccupiedHeight
        }

        // 如果显示底部
        if (layoutStore.getShowFooter) {
          contentOccupiedHeight += this.sizes.footerHeight
          contentsOccupiedHeight += this.sizes.footerHeight
        }

        // 如果显示面包屑
        if (layoutStore.getShowBreadcrumb) {
          contentOccupiedHeight += this.sizes.breadcrumbHeight
          // contentsHeight 包含面包屑，所以不加入 contentsOccupiedHeight
        }

        // 计算两种内容高度
        this.sizes.contentHeight = screenHeight - contentOccupiedHeight
        this.sizes.contentsHeight = screenHeight - contentsOccupiedHeight
      } catch (error) {
        console.error('计算内容高度失败:', error)
      }
    },

    // 更新内容高度（供外部调用）
    updateContentHeight() {
      try {
        this.calculateContentHeight()
        // 更新 CSS 变量
        document.documentElement.style.setProperty(
          toKebabCase('contentHeight', '--'),
          this.sizes.contentHeight + 'px'
        )
        document.documentElement.style.setProperty(
          toKebabCase('contentsHeight', '--'),
          this.sizes.contentsHeight + 'px'
        )
      } catch (error) {
        console.error('更新内容高度失败:', error)
      }
    },

    /* 尺寸模式相关 */
    // 设置尺寸模式
    setSize(size: SizeOptions['value']) {
      try {
        if (this.size === size) {
          return
        }
        this.size = size

        // 使用动态计算的尺寸预设
        const targetSizePresetFn = sizePresetsMap[size]
        if (!targetSizePresetFn) {
          console.error(`Invalid size preset: ${size}`)
          return
        }

        // 调用函数获取当前窗口尺寸下的预设值
        const targetSizePreset = targetSizePresetFn()
        this.sizes = cloneDeep(targetSizePreset)

        // 立即更新 CSS 变量
        this.setCssVariables()
      } catch (error) {
        console.error('设置尺寸模式失败:', error)
      }
    },

    // 重新计算当前尺寸模式下的尺寸（用于窗口大小变化时）
    recalculateSizes() {
      try {
        const targetSizePresetFn = sizePresetsMap[this.size]
        if (!targetSizePresetFn) {
          console.error(`Invalid size preset: ${this.size}`)
          return
        }

        // 调用函数获取当前窗口尺寸下的预设值
        const targetSizePreset = targetSizePresetFn()
        this.sizes = cloneDeep(targetSizePreset)

        // 立即更新 CSS 变量
        this.setCssVariables()
      } catch (error) {
        console.error('重新计算尺寸失败:', error)
      }
    },

    /* 尺寸变量配置相关 padding */
    // 设置间距尺寸
    setPadding(padding: PaddingOptions['key']) {
      try {
        if (this.padding === padding) {
          return
        }
        this.padding = padding
        this.setCssVariables()
      } catch (error) {
        console.error('设置间距尺寸失败:', error)
      }
    },
    // 设置圆角尺寸
    setRounded(rounded: RoundedOptions['key']) {
      try {
        if (this.rounded === rounded) {
          return
        }
        this.rounded = rounded
        this.setCssVariables()
      } catch (error) {
        console.error('设置圆角尺寸失败:', error)
      }
    },

    /* 字体尺寸相关 */
    setFontSize(fontSize: FontSizeOptions['key']) {
      try {
        if (this.fontSize === fontSize) {
          return
        }

        // 根据字体大小自动调整尺寸模式
        this.adjustSizeModeByFontSize(fontSize)

        this.fontSize = fontSize
        this.setCssVariables()
      } catch (error) {
        console.error('设置字体尺寸失败:', error)
      }
    },

    // 根据字体大小自动调整尺寸模式
    adjustSizeModeByFontSize(fontSize: FontSizeOptions['key']) {
      console.log('fontSize', fontSize)
      switch (fontSize) {
        case 'lg':
          this.setSize('comfortable')
          break
        case 'xl':
        case 'xls':
        case 'xxl':
        case 'xxxl':
          this.setSize('loose')
          break
        default:
          break
      }
    },

    /* 设置 CSS 变量 */
    setCssVariables() {
      try {
        // 重新计算内容高度
        this.calculateContentHeight()

        const cssVariables: Record<string, string> = {
          // 布局尺寸变量
          [toKebabCase('sidebarWidth', '--')]: this.getSidebarWidth + 'px',
          [toKebabCase('sidebarCollapsedWidth', '--')]: this.getSidebarCollapsedWidth + 'px',
          [toKebabCase('headerHeight', '--')]: this.getHeaderHeight + 'px',
          [toKebabCase('breadcrumbHeight', '--')]: this.getBreadcrumbHeight + 'px',
          [toKebabCase('footerHeight', '--')]: this.getFooterHeight + 'px',
          [toKebabCase('tabsHeight', '--')]: this.getTabsHeight + 'px',
          [toKebabCase('contentHeight', '--')]: this.sizes.contentHeight + 'px',
          [toKebabCase('contentsHeight', '--')]: this.sizes.contentsHeight + 'px',
          [toKebabCase('gap', '--')]: this.getGap + 'px',
          [toKebabCase('gaps', '--')]: this.getGaps + 'px',
          [toKebabCase('gapx', '--')]: this.getGapx + 'px',
          [toKebabCase('gapl', '--')]: this.getGapl + 'px',

          // 间距变量
          [toKebabCase('padding', '--')]: (this.getPaddingValue || 0) + 'px',
          [toKebabCase('paddings', '--')]: (this.getPaddingsValue || 0) + 'px',
          [toKebabCase('paddingx', '--')]: (this.getPaddingxValue || 0) + 'px',
          [toKebabCase('paddingl', '--')]: (this.getPaddinglValue || 0) + 'px',

          // 圆角变量
          [toKebabCase('rounded', '--')]: (this.getRoundedValue || 0) + 'px',

          // 字体尺寸变量
          [toKebabCase('appFontSize', '--')]: (this.getFontSizeValue || 0) + 'px',
          [toKebabCase('appFontSizes', '--')]: (this.getFontSizesValue || 0) + 'px',
          [toKebabCase('appFontSizex', '--')]: (this.getFontSizexValue || 0) + 'px',
          [toKebabCase('appFontSizel', '--')]: (this.getFontSizelValue || 0) + 'px',
        }

        Object.entries(cssVariables).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value)
        })
      } catch (error) {
        console.error('设置CSS变量失败:', error)
      }
    },

    /* 初始化方法 */
    init() {
      try {
        // 确保使用深拷贝初始化
        this.setSize(this.size)
        this.setCssVariables()

        // 添加窗口大小变化监听并返回清理函数
        return this.setupResizeListener()
      } catch (error) {
        console.error('初始化尺寸状态失败:', error)
        return () => {}
      }
    },

    /* 设置窗口大小变化监听 */
    setupResizeListener() {
      try {
        // 使用防抖函数避免频繁触发
        let resizeTimeout: NodeJS.Timeout | null = null

        const handleResize = () => {
          if (resizeTimeout) {
            clearTimeout(resizeTimeout)
          }

          resizeTimeout = setTimeout(() => {
            // 重新计算当前尺寸模式下的尺寸
            this.recalculateSizes()
          }, 200) // 200ms 防抖延迟
        }

        // 监听窗口大小变化
        window.addEventListener('resize', handleResize)
        window.addEventListener('orientationchange', handleResize)

        // 返回清理函数
        return () => {
          if (resizeTimeout) {
            clearTimeout(resizeTimeout)
          }
          window.removeEventListener('resize', handleResize)
          window.removeEventListener('orientationchange', handleResize)
        }
      } catch (error) {
        console.error('设置窗口大小变化监听失败:', error)
        return () => {}
      }
    },

    /* 重置方法 - 用于调试 */
    reset() {
      try {
        this.size = 'comfortable'
        this.padding = 'md'
        this.rounded = 'smooth'
        this.sizes = cloneDeep(comfortableSizes)
        this.setCssVariables()
      } catch (error) {
        console.error('重置尺寸状态失败:', error)
      }
    },
  },

  persist: {
    key: `${env.piniaKeyPrefix}-size`,
    storage: localStorage,
    // 添加序列化配置，确保持久化正确
    serializer: {
      deserialize: (value: string) => {
        try {
          return JSON.parse(value)
        } catch {
          return {}
        }
      },
      serialize: (value: any) => {
        return JSON.stringify(value)
      },
    },
  },
})

export const useSizeStoreWithOut = () => {
  return useSizeStore(store)
}
