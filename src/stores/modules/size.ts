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
  gapOptions,
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

    gap: 'md',
    gapOptions,

    rounded: 'smooth',
    roundedOptions,
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

    /* 尺寸变量配置相关 gap */
    // 获取间距尺寸
    getGap: state => {
      const gapOptions = state.gapOptions
      const gap = gapOptions.find(option => option.key === state.gap) as GapOptions
      return gap.key
    },
    // 获取当前间距的具体数值
    getGapValue: state =>
      state.gapOptions.find(option => option.key === state.gap)?.value as number,
    // 获取间距尺寸
    getGapsValue: state => {
      const gapOptions = state.gapOptions
      const gap = gapOptions.find(option => option.key === state.gap) as GapOptions
      return (gap.value / 2) as number
    },
    getGapxValue: state => {
      const gapOptions = state.gapOptions
      const gap = gapOptions.find(option => option.key === state.gap) as GapOptions
      return (gap.value + gap.value / 2) as number
    },
    getGaplValue: state => {
      const gapOptions = state.gapOptions
      const gap = gapOptions.find(option => option.key === state.gap) as GapOptions
      return (gap.value * 2) as number
    },
    // 获取间距尺寸标签
    getGapLabel: state => state.gapOptions.find(option => option.key === state.gap)?.label,
    // 获取间距选项
    getGapOptions: state => state.gapOptions,

    /* 尺寸变量配置相关 rounded */
    // 获取圆角尺寸
    getRounded: state => state.rounded,
    // 获取圆角尺寸的具体数值
    getRoundedValue: state =>
      state.roundedOptions.find(option => option.key === state.rounded)?.value as number,
    // 获取圆角尺寸标签
    getRoundedLabel: state =>
      state.roundedOptions.find(option => option.key === state.rounded)?.label,
    // 获取圆角尺寸选项
    getRoundedOptions: state => state.roundedOptions,
  },

  actions: {
    /* 内容高度计算 */
    // 计算内容区域高度
    calculateContentHeight() {
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
    },

    // 更新内容高度（供外部调用）
    updateContentHeight() {
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
    },

    /* 尺寸模式相关 */
    // 设置尺寸模式
    setSize(size: SizeOptions['value']) {
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
    },

    // 重新计算当前尺寸模式下的尺寸（用于窗口大小变化时）
    recalculateSizes() {
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
    },

    /* 尺寸变量配置相关 gap */
    // 设置间距尺寸
    setGap(gap: GapOptions['key']) {
      if (this.gap === gap) {
        return
      }
      this.gap = gap
      this.setCssVariables()
    },
    // 设置圆角尺寸
    setRounded(rounded: RoundedOptions['key']) {
      if (this.rounded === rounded) {
        return
      }
      this.rounded = rounded
      this.setCssVariables()
    },

    /* 设置 CSS 变量 */
    setCssVariables() {
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

        // 间距变量
        [toKebabCase('gap', '--')]: (this.getGapValue || 0) + 'px',
        [toKebabCase('gaps', '--')]: (this.getGapsValue || 0) + 'px',
        [toKebabCase('gapx', '--')]: (this.getGapxValue || 0) + 'px',
        [toKebabCase('gapl', '--')]: (this.getGaplValue || 0) + 'px',

        // 圆角变量
        [toKebabCase('rounded', '--')]: (this.getRoundedValue || 0) + 'px',
      }

      Object.entries(cssVariables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value)
      })
    },

    /* 初始化方法 */
    init() {
      // 确保使用深拷贝初始化
      this.setSize(this.size)
      this.setCssVariables()

      // 添加窗口大小变化监听并返回清理函数
      return this.setupResizeListener()
    },

    /* 设置窗口大小变化监听 */
    setupResizeListener() {
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
    },

    /* 重置方法 - 用于调试 */
    reset() {
      this.size = 'comfortable'
      this.gap = 'md'
      this.rounded = 'smooth'
      this.sizes = cloneDeep(comfortableSizes)
      this.setCssVariables()
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
