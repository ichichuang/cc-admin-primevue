/**
 * 尺寸状态管理
 */

import { cloneDeep, toKebabCase } from '@/common'
import { fontSizeOptions, paddingOptions, roundedOptions, sizeOptions } from '@/constants'
import { comfortableSizes, sizePresetsMap } from '@/constants/modules/theme'
import store, { useLayoutStoreWithOut } from '@/stores'
import { env } from '@/utils'
import { defineStore } from 'pinia'

export const useSizeStore = defineStore('size', {
  state: (): SizeState => ({
    size: 'comfortable',
    sizeOptions: [...sizeOptions], // 创建可变副本

    sizes: cloneDeep(comfortableSizes),

    padding: 'md',
    paddingOptions: [...paddingOptions], // 创建可变副本

    rounded: 'smooth',
    roundedOptions: [...roundedOptions], // 创建可变副本

    fontSize: 'md',
    fontSizeOptions: [...fontSizeOptions], // 创建可变副本
  }),

  getters: {
    isCompact: (state: SizeState) => state.size === 'compact',
    isComfortable: (state: SizeState) => state.size === 'comfortable',
    isLoose: (state: SizeState) => state.size === 'loose',
    getSizeOptions: (state: SizeState) => state.sizeOptions,
    getSize: (state: SizeState) => state.size,
    getSizeLabel: (state: SizeState) =>
      state.sizeOptions.find(option => option.value === state.size)?.label,

    // layout
    getSidebarWidth: (state: SizeState) => state.sizes.sidebarWidth as number,
    getSidebarCollapsedWidth: (state: SizeState) => state.sizes.sidebarCollapsedWidth as number,
    getHeaderHeight: (state: SizeState) => state.sizes.headerHeight as number,
    getBreadcrumbHeight: (state: SizeState) => state.sizes.breadcrumbHeight as number,
    getFooterHeight: (state: SizeState) => state.sizes.footerHeight as number,
    getTabsHeight: (state: SizeState) => state.sizes.tabsHeight as number,
    // getContentHeight = 窗口高度 - 头部 - 底部 - 面包屑 - 标签页
    getContentHeight: (state: SizeState) => {
      const layoutStore = useLayoutStoreWithOut()
      const screenHeight = layoutStore.getHeight
      const showHeader = layoutStore.getShowHeader
      const showFooter = layoutStore.getShowFooter
      const showBreadcrumb = layoutStore.getShowBreadcrumb
      const showTabs = layoutStore.getShowTabs
      let height: number = 0
      if (showHeader) {
        height += state.sizes.headerHeight
      }
      if (showFooter) {
        height += state.sizes.footerHeight
      }
      if (showBreadcrumb) {
        height += state.sizes.breadcrumbHeight
      }
      if (showTabs) {
        height += state.sizes.tabsHeight
      }
      return (screenHeight - height) as number
    },
    // getContentBreadcrumbHeight = 窗口高度 - 头部 - 底部 - 标签页
    getContentBreadcrumbHeight: (state: SizeState) => {
      const layoutStore = useLayoutStoreWithOut()
      const screenHeight = layoutStore.getHeight
      const showHeader = layoutStore.getShowHeader
      const showFooter = layoutStore.getShowFooter
      const showTabs = layoutStore.getShowTabs
      let height: number = 0
      if (showHeader) {
        height += state.sizes.headerHeight
      }
      if (showFooter) {
        height += state.sizes.footerHeight
      }
      if (showTabs) {
        height += state.sizes.tabsHeight
      }
      return (screenHeight - height) as number
    },
    // getContentTabsHeight = 窗口高度 - 头部 - 底部 - 面包屑
    getContentTabsHeight: (state: SizeState) => {
      const layoutStore = useLayoutStoreWithOut()
      const screenHeight = layoutStore.getHeight
      const showHeader = layoutStore.getShowHeader
      const showFooter = layoutStore.getShowFooter
      const showBreadcrumb = layoutStore.getShowBreadcrumb
      let height: number = 0
      if (showHeader) {
        height += state.sizes.headerHeight
      }
      if (showFooter) {
        height += state.sizes.footerHeight
      }
      if (showBreadcrumb) {
        height += state.sizes.breadcrumbHeight
      }
      return (screenHeight - height) as number
    },
    // getContentsHeight = 窗口高度 - 头部 - 底部
    getContentsHeight: (state: SizeState) => {
      const layoutStore = useLayoutStoreWithOut()
      const screenHeight = layoutStore.getHeight
      const showBreadcrumb = layoutStore.getShowBreadcrumb
      const showTabs = layoutStore.getShowTabs
      let height: number = 0
      if (showBreadcrumb) {
        height += state.sizes.breadcrumbHeight
      }
      if (showTabs) {
        height += state.sizes.tabsHeight
      }
      return (screenHeight - height) as number
    },
    // getContentsBreadcrumbHeight = 窗口高度 - 头部 - 底部 - 标签页
    getContentsBreadcrumbHeight: (state: SizeState) => {
      const layoutStore = useLayoutStoreWithOut()
      const screenHeight = layoutStore.getHeight
      const showTabs = layoutStore.getShowTabs
      let height: number = 0
      if (showTabs) {
        height += state.sizes.tabsHeight
      }
      return (screenHeight - height) as number
    },
    // getContentsTabsHeight = 窗口高度 - 头部 - 底部 - 面包屑
    getContentsTabsHeight: (state: SizeState) => {
      const layoutStore = useLayoutStoreWithOut()
      const screenHeight = layoutStore.getHeight
      const showBreadcrumb = layoutStore.getShowBreadcrumb
      let height: number = 0
      if (showBreadcrumb) {
        height += state.sizes.breadcrumbHeight
      }
      return (screenHeight - height) as number
    },
    getGap: (state: SizeState) => state.sizes.gap as number,
    getGaps: (state: SizeState) => (state.sizes.gap / 2) as number,
    getGapx: (state: SizeState) => (state.sizes.gap + state.sizes.gap / 2) as number,
    getGapl: (state: SizeState) => (state.sizes.gap * 2) as number,

    // padding
    getPadding: (state: SizeState) => {
      try {
        const list = state.paddingOptions
        const current = list.find(option => option.key === state.padding) as PaddingOptions
        return current?.key as PaddingOptions['key']
      } catch (error) {
        console.error('获取 padding 失败:', error)
        return 'md'
      }
    },
    getPaddingValue: (state: SizeState) => {
      try {
        return state.paddingOptions.find(option => option.key === state.padding)
          ?.value as PaddingOptions['value']
      } catch (error) {
        console.error('获取 paddingValue 失败:', error)
        return 12
      }
    },
    getPaddingsValue: (state: SizeState) => {
      try {
        const list = state.paddingOptions || []
        const current = list.find(option => option.key === state.padding)
        return ((current?.value ?? 12) / 2) as PaddingOptions['value']
      } catch (error) {
        console.error('获取 paddingsValue 失败:', error)
        return 6
      }
    },
    getPaddingxValue: (state: SizeState) => {
      try {
        const list = state.paddingOptions || []
        const current = list.find(option => option.key === state.padding)
        const val = current?.value ?? 12
        return (val + val / 2) as PaddingOptions['value']
      } catch (error) {
        console.error('获取 paddingxValue 失败:', error)
        return 18
      }
    },
    getPaddinglValue: (state: SizeState) => {
      try {
        const list = state.paddingOptions || []
        const current = list.find(option => option.key === state.padding)
        return ((current?.value ?? 12) * 2) as PaddingOptions['value']
      } catch (error) {
        console.error('获取 paddinglValue 失败:', error)
        return 24
      }
    },
    getPaddingLabel: (state: SizeState) => {
      try {
        return state.paddingOptions.find(option => option.key === state.padding)?.label
      } catch (error) {
        console.error('获取 paddingLabel 失败:', error)
        return '中'
      }
    },
    getPaddingOptions: (state: SizeState) => state.paddingOptions,

    // rounded
    getRounded: (state: SizeState) => state.rounded,
    getRoundedValue: (state: SizeState) => {
      try {
        return state.roundedOptions.find(option => option.key === state.rounded)
          ?.value as RoundedOptions['value']
      } catch (error) {
        console.error('获取 roundedValue 失败:', error)
        return 6
      }
    },
    getRoundedLabel: (state: SizeState) => {
      try {
        return state.roundedOptions.find(option => option.key === state.rounded)?.label
      } catch (error) {
        console.error('获取 roundedLabel 失败:', error)
        return '平滑'
      }
    },
    getRoundedOptions: (state: SizeState) => state.roundedOptions,

    // font size
    getFontSize: (state: SizeState) => state.fontSize,
    getFontSizeOptions: (state: SizeState) => state.fontSizeOptions,
    getFontSizeValue: (state: SizeState) => {
      try {
        return state.fontSizeOptions.find(option => option.key === state.fontSize)
          ?.value as FontSizeOptions['value']
      } catch (error) {
        console.error('获取 fontSizeValue 失败:', error)
        return 14
      }
    },
    getFontSizeLabel: (state: SizeState) => {
      try {
        return state.fontSizeOptions.find(option => option.key === state.fontSize)?.label
      } catch (error) {
        console.error('获取 fontSizeLabel 失败:', error)
        return '中号'
      }
    },
    getFontSizesValue: (state: SizeState) => {
      try {
        const current = state.fontSizeOptions.find(option => option.key === state.fontSize)
          ?.value as FontSizeOptions['value']
        return current / 2
      } catch (error) {
        console.error('获取 fontSizesValue 失败:', error)
        return 7
      }
    },
    getFontSizexValue: (state: SizeState) => {
      try {
        const current = state.fontSizeOptions.find(option => option.key === state.fontSize)
          ?.value as FontSizeOptions['value']
        return current + current / 2
      } catch (error) {
        console.error('获取 fontSizexValue 失败:', error)
        return 21
      }
    },
    getFontSizelValue: (state: SizeState) => {
      try {
        const current = state.fontSizeOptions.find(option => option.key === state.fontSize)
          ?.value as FontSizeOptions['value']
        return current * 2
      } catch (error) {
        console.error('获取 fontSizelValue 失败:', error)
        return 28
      }
    },
  },

  actions: {
    // 内容高度按定义公式由 getters 动态计算，无需 actions 干预
    setSize(this: any, size: SizeOptions['value']) {
      try {
        if (this.size === size) {
          return
        }
        this.size = size

        const targetSizePresetFn = sizePresetsMap[size]
        if (!targetSizePresetFn) {
          console.error(`Invalid size preset: ${size}`)
          return
        }
        const targetSizePreset = targetSizePresetFn()
        this.sizes = cloneDeep(targetSizePreset)
        this.setCssVariables()

        // 尺寸模式与字号联动
        try {
          if (size === 'loose') {
            this.setFontSize('xl')
          } else if (size === 'comfortable') {
            this.setFontSize('md')
          } else if (size === 'compact') {
            this.setFontSize('xs')
          }
          // compact 无需处理
        } catch (error) {
          console.error('尺寸模式联动字号失败:', error)
        }
      } catch (error) {
        console.error('设置尺寸模式失败:', error)
      }
    },

    recalculateSizes(this: any) {
      try {
        const targetSizePresetFn = sizePresetsMap[this.size as Size]
        if (!targetSizePresetFn) {
          console.error(`Invalid size preset: ${this.size}`)
          return
        }
        const targetSizePreset = targetSizePresetFn()
        this.sizes = cloneDeep(targetSizePreset)
        this.setCssVariables()
      } catch (error) {
        console.error('重新计算尺寸失败:', error)
      }
    },

    setPadding(this: any, padding: PaddingOptions['key']) {
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

    setRounded(this: any, rounded: RoundedOptions['key']) {
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

    setFontSize(this: any, fontSize: FontSizeOptions['key']) {
      try {
        if (this.fontSize === fontSize) {
          return
        }
        this.adjustSizeModeByFontSize(fontSize)
        this.fontSize = fontSize
        this.setCssVariables()
      } catch (error) {
        console.error('设置字体尺寸失败:', error)
      }
    },

    adjustSizeModeByFontSize(this: any, fontSize: FontSizeOptions['key']) {
      switch (fontSize) {
        case 'xs':
          this.setSize('compact')
          break
        case 'sm':
        case 'md':
          this.setSize('comfortable')
          break
        case 'lg':
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

    setCssVariables(this: any) {
      try {
        const cssVariables: Record<string, string> = {
          [toKebabCase('sidebarWidth', '--')]: this.getSidebarWidth + 'px',
          [toKebabCase('sidebarCollapsedWidth', '--')]: this.getSidebarCollapsedWidth + 'px',
          [toKebabCase('headerHeight', '--')]: this.getHeaderHeight + 'px',
          [toKebabCase('breadcrumbHeight', '--')]: this.getBreadcrumbHeight + 'px',
          [toKebabCase('footerHeight', '--')]: this.getFooterHeight + 'px',
          [toKebabCase('tabsHeight', '--')]: this.getTabsHeight + 'px',
          [toKebabCase('contentHeight', '--')]: this.getContentHeight + 'px',
          [toKebabCase('contentBreadcrumbHeight', '--')]: this.getContentBreadcrumbHeight + 'px',
          [toKebabCase('contentTabsHeight', '--')]: this.getContentTabsHeight + 'px',
          [toKebabCase('contentsHeight', '--')]: this.getContentsHeight + 'px',
          [toKebabCase('contentsBreadcrumbHeight', '--')]: this.getContentsBreadcrumbHeight + 'px',
          [toKebabCase('contentsTabsHeight', '--')]: this.getContentsTabsHeight + 'px',

          [toKebabCase('gap', '--')]: this.getGap + 'px',
          [toKebabCase('gaps', '--')]: this.getGaps + 'px',
          [toKebabCase('gapx', '--')]: this.getGapx + 'px',
          [toKebabCase('gapl', '--')]: this.getGapl + 'px',

          [toKebabCase('padding', '--')]: (this.getPaddingValue || 0) + 'px',
          [toKebabCase('paddings', '--')]: (this.getPaddingsValue || 0) + 'px',
          [toKebabCase('paddingx', '--')]: (this.getPaddingxValue || 0) + 'px',
          [toKebabCase('paddingl', '--')]: (this.getPaddinglValue || 0) + 'px',

          [toKebabCase('rounded', '--')]: (this.getRoundedValue || 0) + 'px',

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

    init(this: any) {
      this.setSize(this.size)
      this.setCssVariables()
      return this.setupResizeListener()
    },

    setupResizeListener(this: any) {
      let resizeTimeout: number | null = null
      const handleResize = () => {
        if (resizeTimeout !== null) {
          clearTimeout(resizeTimeout)
        }
        resizeTimeout = window.setTimeout(() => {
          this.recalculateSizes()
          resizeTimeout = null
        }, 200)
      }
      window.addEventListener('resize', handleResize)
      window.addEventListener('orientationchange', handleResize)
      return () => {
        if (resizeTimeout !== null) {
          clearTimeout(resizeTimeout)
          resizeTimeout = null
        }
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('orientationchange', handleResize)
      }
    },

    reset(this: any) {
      this.size = 'comfortable'
      this.padding = 'md'
      this.rounded = 'smooth'
      this.sizes = cloneDeep(comfortableSizes)
      this.setCssVariables()
    },
  },

  // pinia-plugin-persistedstate
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  persist: {
    key: `${env.piniaKeyPrefix}-size`,
    storage: localStorage,
    serializer: {
      deserialize: (value: string) => {
        try {
          return JSON.parse(value)
        } catch {
          return {}
        }
      },
      serialize: (value: any) => JSON.stringify(value),
    },
  },
})

export const useSizeStoreWithOut = () => {
  return useSizeStore(store)
}
