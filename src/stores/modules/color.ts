import { getSystemColorMode, toKebabCase } from '@/common'
import {
  darkThemeOptions,
  getDefaultTheme,
  getThemeOptions,
  lightThemeOptions,
  modeOptions,
} from '@/constants'
import store from '@/stores'
import { env } from '@/utils'
import { defineStore } from 'pinia'

export const useColorStore = defineStore('color', {
  state: (): ColorState => ({
    mode: 'light',
    modeOptions,
    darkMode: false,

    lightThemeValue: lightThemeOptions[0].value,
    darkThemeValue: darkThemeOptions[0].value,

    mediaQuery: null,
    mediaQueryListener: null,
  }),

  getters: {
    // 获取当前主题模式：mode 如果当前 mode 为 auto 则获取系统颜色模式动态计算
    getModeOptions: state => state.modeOptions,
    getMode: state => {
      return state.mode
    },
    getModeLabel: state => {
      const modeOptions = state.modeOptions
      const mode = modeOptions.find(item => item.value === state.mode) as ModeOptions
      return mode.label
    },
    isDark: state => state.darkMode,
    isLight: state => {
      const isLight =
        state.mode === 'auto' ? getSystemColorMode() === 'light' : state.mode === 'light'
      return isLight
    },
    isAuto: state => state.mode === 'auto',

    // 获取主题色选项及选中值
    getThemeOptions: state => {
      const isDark = state.darkMode
      return getThemeOptions(isDark)
    },
    getTheme: state => {
      const isDark = state.darkMode
      return isDark ? state.darkThemeValue : state.lightThemeValue
    },
    getThemeValue: state => {
      const isDark = state.darkMode
      const themeValue = isDark ? state.darkThemeValue : state.lightThemeValue
      const themeOptions = getThemeOptions(isDark)
      const themeColor = themeOptions.find(item => item.value === themeValue)

      // 如果找不到主题，使用默认主题
      if (!themeColor) {
        const defaultTheme = getDefaultTheme(isDark)
        return defaultTheme.value
      }

      return themeColor.value
    },
    getThemeLabel: state => {
      const isDark = state.darkMode
      const themeValue = isDark ? state.darkThemeValue : state.lightThemeValue
      const themeOptions = getThemeOptions(isDark)
      const themeColor = themeOptions.find(item => item.value === themeValue)

      // 如果找不到主题，使用默认主题
      if (!themeColor) {
        const defaultTheme = getDefaultTheme(isDark)
        return defaultTheme.label
      }

      return themeColor.label
    },
    getThemeColors: state => () => {
      const isDark = state.darkMode
      const themeValue = isDark ? state.darkThemeValue : state.lightThemeValue
      const themeOptions = getThemeOptions(isDark)

      const themeColor = themeOptions.find(item => item.value === themeValue)

      // 如果找不到主题，使用默认主题
      if (!themeColor) {
        const defaultTheme = getDefaultTheme(isDark)
        return defaultTheme.themeColors
      }

      return themeColor.themeColors
    },

    // 获取主题色
    getPrimary100: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.primary100
      } catch (error) {
        console.error('获取 primary100 失败:', error)
        return '#3B82F6' // 默认蓝色
      }
    },
    getPrimary200: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.primary200
      } catch (error) {
        console.error('获取 primary200 失败:', error)
        return '#7AB2FF' // 默认浅蓝色
      }
    },
    getPrimary300: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.primary300
      } catch (error) {
        console.error('获取 primary300 失败:', error)
        return '#A3C7FF' // 默认更浅蓝色
      }
    },
    getPrimary400: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.primary400
      } catch (error) {
        console.error('获取 primaryColor 失败:', error)
        return '#ffffff' // 默认白色
      }
    },
    // 获取强调色
    getAccent100: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.accent100
      } catch (error) {
        console.error('获取 accent100 失败:', error)
        return '#10B981' // 默认绿色
      }
    },
    getAccent200: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.accent200
      } catch (error) {
        console.error('获取 accent200 失败:', error)
        return '#047857' // 默认深绿色
      }
    },

    // 获取文本色
    getText100: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.text100
      } catch (error) {
        console.error('获取 text100 失败:', error)
        return '#1F2937' // 默认深灰色
      }
    },
    getText200: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.text200
      } catch (error) {
        console.error('获取 text200 失败:', error)
        return '#6B7280' // 默认灰色
      }
    },

    // 获取背景色
    getBg100: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.bg100
      } catch (error) {
        console.error('获取 bg100 失败:', error)
        return '#F9FAFB' // 默认浅灰色
      }
    },
    getBg200: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.bg200
      } catch (error) {
        console.error('获取 bg200 失败:', error)
        return '#E5E7EB' // 默认灰色
      }
    },
    getBg300: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.bg300
      } catch (error) {
        console.error('获取 bg300 失败:', error)
        return '#D1D5DB' // 默认深灰色
      }
    },

    // 获取功能色主色
    getFunctionalColors: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      // 设置当前色
      themeColors.functionalColors.secondary.color = themeColors.bg100
      themeColors.functionalColors.secondary.hover = themeColors.bg200
      themeColors.functionalColors.secondary.active = themeColors.bg300
      themeColors.functionalColors.secondary.disabled = themeColors.bg300
      themeColors.functionalColors.secondary.text = themeColors.text100
      themeColors.functionalColors.secondary.border = themeColors.bg300
      // 设置对比色
      themeColors.functionalColors.contrast.color = themeColors.text100
      themeColors.functionalColors.contrast.hover = themeColors.text200
      themeColors.functionalColors.contrast.active = themeColors.text100
      themeColors.functionalColors.contrast.disabled = themeColors.text200
      themeColors.functionalColors.contrast.text = themeColors.bg100
      themeColors.functionalColors.contrast.border = themeColors.bg300
      // 设置强调色（Help）
      themeColors.functionalColors.help.color = themeColors.accent100
      themeColors.functionalColors.help.hover = themeColors.accent200
      themeColors.functionalColors.help.active = themeColors.accent100
      themeColors.functionalColors.help.disabled = themeColors.bg300
      themeColors.functionalColors.help.text = themeColors.primary400
      themeColors.functionalColors.help.border = themeColors.accent100
      return themeColors.functionalColors
    },
    getPrimaryColor: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.primary.color
      } catch (error) {
        console.error('获取 primaryColor 失败:', error)
        return '#3B82F6'
      }
    },
    getSecondaryColor: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.secondary.color
      } catch (error) {
        console.error('获取 secondaryColor 失败:', error)
        return '#F9FAFB'
      }
    },
    getSuccessColor: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.success.color
      } catch (error) {
        console.error('获取 successColor 失败:', error)
        return '#52c41a'
      }
    },
    getInfoColor: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.info.color
      } catch (error) {
        console.error('获取 infoColor 失败:', error)
        return '#1890ff'
      }
    },
    getWarnColor: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.warn.color
      } catch (error) {
        console.error('获取 warnColor 失败:', error)
        return '#faad14'
      }
    },
    getHelpColor: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.help.color
      } catch (error) {
        console.error('获取 helpColor 失败:', error)
        return '#9c27b0'
      }
    },
    getDangerColor: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.danger.color
      } catch (error) {
        console.error('获取 dangerColor 失败:', error)
        return '#f5222d'
      }
    },
    getContrastColor: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.contrast.color
      } catch (error) {
        console.error('获取 contrastColor 失败:', error)
        return '#1F2937'
      }
    },
    // 获取功能色hover
    getPrimaryColorHover: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.primary.hover
      } catch (error) {
        console.error('获取 primaryColorHover 失败:', error)
        return '#7AB2FF'
      }
    },
    getSecondaryColorHover: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.secondary.hover
      } catch (error) {
        console.error('获取 secondaryColorHover 失败:', error)
        return '#E5E7EB'
      }
    },
    getSuccessColorHover: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.success.hover
      } catch (error) {
        console.error('获取 successColorHover 失败:', error)
        return '#73d13d'
      }
    },
    getInfoColorHover: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.info.hover
      } catch (error) {
        console.error('获取 infoColorHover 失败:', error)
        return '#40a9ff'
      }
    },
    getWarnColorHover: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.warn.hover
      } catch (error) {
        console.error('获取 warnColorHover 失败:', error)
        return '#ffc53d'
      }
    },
    getHelpColorHover: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.help.hover
      } catch (error) {
        console.error('获取 helpColorHover 失败:', error)
        return '#ba68c8'
      }
    },
    getDangerColorHover: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.danger.hover
      } catch (error) {
        console.error('获取 dangerColorHover 失败:', error)
        return '#ff4d4f'
      }
    },
    getContrastColorHover: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.contrast.hover
      } catch (error) {
        console.error('获取 contrastColorHover 失败:', error)
        return '#6B7280'
      }
    },
    // 获取功能色active
    getPrimaryColorActive: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.primary.active
      } catch (error) {
        console.error('获取 primaryColorActive 失败:', error)
        return '#A3C7FF'
      }
    },
    getSecondaryColorActive: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.secondary.active
      } catch (error) {
        console.error('获取 secondaryColorActive 失败:', error)
        return '#D1D5DB'
      }
    },
    getSuccessColorActive: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.success.active
      } catch (error) {
        console.error('获取 successColorActive 失败:', error)
        return '#389e0d'
      }
    },
    getInfoColorActive: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.info.active
      } catch (error) {
        console.error('获取 infoColorActive 失败:', error)
        return '#096dd9'
      }
    },
    getWarnColorActive: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.warn.active
      } catch (error) {
        console.error('获取 warnColorActive 失败:', error)
        return '#d48806'
      }
    },
    getHelpColorActive: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.help.active
      } catch (error) {
        console.error('获取 helpColorActive 失败:', error)
        return '#7b1fa2'
      }
    },
    getDangerColorActive: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.danger.active
      } catch (error) {
        console.error('获取 dangerColorActive 失败:', error)
        return '#cf1322'
      }
    },
    getContrastColorActive: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.contrast.active
      } catch (error) {
        console.error('获取 contrastColorActive 失败:', error)
        return '#1F2937'
      }
    },
    // 获取功能色disabled
    getPrimaryColorDisabled: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.primary.disabled
      } catch (error) {
        console.error('获取 primaryColorDisabled 失败:', error)
        return '#D1D5DB'
      }
    },
    getSecondaryColorDisabled: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.secondary.disabled
      } catch (error) {
        console.error('获取 secondaryColorDisabled 失败:', error)
        return '#D1D5DB'
      }
    },
    getSuccessColorDisabled: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.success.disabled
      } catch (error) {
        console.error('获取 successColorDisabled 失败:', error)
        return '#d9d9d9'
      }
    },
    getInfoColorDisabled: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.info.disabled
      } catch (error) {
        console.error('获取 infoColorDisabled 失败:', error)
        return '#d9d9d9'
      }
    },
    getWarnColorDisabled: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.warn.disabled
      } catch (error) {
        console.error('获取 warnColorDisabled 失败:', error)
        return '#d9d9d9'
      }
    },
    getHelpColorDisabled: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.help.disabled
      } catch (error) {
        console.error('获取 helpColorDisabled 失败:', error)
        return '#d9d9d9'
      }
    },
    getDangerColorDisabled: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.danger.disabled
      } catch (error) {
        console.error('获取 dangerColorDisabled 失败:', error)
        return '#d9d9d9'
      }
    },
    getContrastColorDisabled: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.contrast.disabled
      } catch (error) {
        console.error('获取 contrastColorDisabled 失败:', error)
        return '#6B7280'
      }
    },
    // 获取功能色text
    getPrimaryColorText: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.primary.text
      } catch (error) {
        console.error('获取 primaryColorText 失败:', error)
        return '#F3F4F6'
      }
    },
    getSecondaryColorText: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.secondary.text
      } catch (error) {
        console.error('获取 secondaryColorText 失败:', error)
        return '#1F2937'
      }
    },
    getSuccessColorText: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.success.text
      } catch (error) {
        console.error('获取 successColorText 失败:', error)
        return '#f6ffed'
      }
    },
    getInfoColorText: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.info.text
      } catch (error) {
        console.error('获取 infoColorText 失败:', error)
        return '#e6f7ff'
      }
    },
    getWarnColorText: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.warn.text
      } catch (error) {
        console.error('获取 warnColorText 失败:', error)
        return '#fffbe6'
      }
    },
    getHelpColorText: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.help.text
      } catch (error) {
        console.error('获取 helpColorText 失败:', error)
        return '#f3e5f5'
      }
    },
    getDangerColorText: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.danger.text
      } catch (error) {
        console.error('获取 dangerColorText 失败:', error)
        return '#fff2f0'
      }
    },
    getContrastColorText: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.contrast.text
      } catch (error) {
        console.error('获取 contrastColorText 失败:', error)
        return '#F9FAFB'
      }
    },
    // 获取功能色border
    getPrimaryColorBorder: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.primary.border
      } catch (error) {
        console.error('获取 primaryColorBorder 失败:', error)
        return '#2A6EF7'
      }
    },
    getSecondaryColorBorder: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.secondary.border
      } catch (error) {
        console.error('获取 secondaryColorBorder 失败:', error)
        return '#D1D5DB'
      }
    },
    getSuccessColorBorder: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.success.border
      } catch (error) {
        console.error('获取 successColorBorder 失败:', error)
        return '#52c41a'
      }
    },
    getInfoColorBorder: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.info.border
      } catch (error) {
        console.error('获取 infoColorBorder 失败:', error)
        return '#1890ff'
      }
    },
    getWarnColorBorder: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.warn.border
      } catch (error) {
        console.error('获取 warnColorBorder 失败:', error)
        return '#faad14'
      }
    },
    getHelpColorBorder: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.help.border
      } catch (error) {
        console.error('获取 helpColorBorder 失败:', error)
        return '#9c27b0'
      }
    },
    getDangerColorBorder: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.danger.border
      } catch (error) {
        console.error('获取 dangerColorBorder 失败:', error)
        return '#f5222d'
      }
    },
    getContrastColorBorder: function () {
      try {
        const themeColors: ThemeColors = this.getThemeColors()
        return themeColors.functionalColors.contrast.border
      } catch (error) {
        console.error('获取 contrastColorBorder 失败:', error)
        return '#D1D5DB'
      }
    },
  },

  actions: {
    // 自动跟随系统主题
    setupAutoModeListener() {
      try {
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        // 创建监听器函数
        this.mediaQueryListener = (_e: MediaQueryListEvent) => {
          this.darkMode = _e.matches
          this.setTheme(this.getThemeValue)
        }

        // 添加监听器
        this.mediaQuery.addEventListener('change', this.mediaQueryListener)
      } catch (error) {
        console.error('设置自动模式监听器失败:', error)
      }
    },

    // 清理监听器
    cleanupMediaQueryListener() {
      try {
        if (this.mediaQuery && this.mediaQueryListener) {
          this.mediaQuery.removeEventListener('change', this.mediaQueryListener)
          this.mediaQuery = null
          this.mediaQueryListener = null
        }
      } catch (error) {
        console.error('清理媒体查询监听器失败:', error)
      }
    },

    // 设置主题模式
    setMode(mode: Mode) {
      try {
        this.cleanupMediaQueryListener()

        this.mode = mode
        this.darkMode = mode === 'auto' ? getSystemColorMode() === 'dark' : mode === 'dark'

        document.documentElement.classList.toggle('dark', this.darkMode)

        if (mode === 'auto') {
          this.setupAutoModeListener()
        }

        // 设置完模式后重新设置 CSS 变量
        this.setCssVariables()
      } catch (error) {
        console.error('设置主题模式失败:', error)
      }
    },

    // 切换主题模式（在 light 和 dark 之间切换）
    toggleMode() {
      try {
        const isDark = this.darkMode
        const newMode = isDark ? 'light' : 'dark'
        this.setMode(newMode)
      } catch (error) {
        console.error('切换主题模式失败:', error)
      }
    },

    // 修改主题色
    setTheme(theme: ThemeColor['value']) {
      try {
        const isDark = this.darkMode
        if (isDark) {
          this.darkThemeValue = theme
        } else {
          this.lightThemeValue = theme
        }
        this.setCssVariables()
      } catch (error) {
        console.error('设置主题失败:', error)
      }
    },

    /* 将颜色变量都存储到 css 变量中 用于全局样式 */
    setCssVariables() {
      try {
        const cssVariables: Record<string, string> = {
          [toKebabCase('primary100', '--')]: this.getPrimary100,
          [toKebabCase('primary200', '--')]: this.getPrimary200,
          [toKebabCase('primary300', '--')]: this.getPrimary300,
          [toKebabCase('primary400', '--')]: this.getPrimary400,

          [toKebabCase('accent100', '--')]: this.getAccent100,
          [toKebabCase('accent200', '--')]: this.getAccent200,

          [toKebabCase('text100', '--')]: this.getText100,
          [toKebabCase('text200', '--')]: this.getText200,

          [toKebabCase('bg100', '--')]: this.getBg100,
          [toKebabCase('bg200', '--')]: this.getBg200,
          [toKebabCase('bg300', '--')]: this.getBg300,
        }

        // 动态生成 FunctionalColor CSS 变量
        const functionalColors = this.getFunctionalColors
        const functionalColorVars: Record<string, string> = {}

        Object.entries(functionalColors).forEach(([colorType, colorConfig]) => {
          const entries: [string, string][] = [
            [`${colorType}-color`, colorConfig.color],
            [`${colorType}-color-hover`, colorConfig.hover],
            [`${colorType}-color-active`, colorConfig.active],
            [`${colorType}-color-disabled`, colorConfig.disabled],
            [`${colorType}-color-text`, colorConfig.text],
            [`${colorType}-color-border`, colorConfig.border],
          ]

          entries.forEach(([key, value]) => {
            functionalColorVars[`--${key}`] = value
          })
        })

        // 合并所有 CSS 变量
        const allVariables = { ...cssVariables, ...functionalColorVars }

        Object.entries(allVariables).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value)
        })
      } catch (error) {
        console.error('设置CSS变量失败:', error)
      }
    },

    /* 初始化方法 */
    init() {
      try {
        this.setMode(this.mode)
      } catch (error) {
        console.error('初始化颜色状态失败:', error)
      }
    },
  },

  persist: {
    key: `${env.piniaKeyPrefix}-color`,
    storage: localStorage,
  },
})

export const useColorStoreWithOut = () => {
  return useColorStore(store)
}
