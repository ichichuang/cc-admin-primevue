/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 状态管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

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
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.primary100
    },
    getPrimary200: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.primary200
    },
    getPrimary300: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.primary300
    },

    // 获取强调色
    getAccent100: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.accent100
    },
    getAccent200: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.accent200
    },

    // 获取文本色
    getText100: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.text100
    },
    getText200: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.text200
    },

    // 获取背景色
    getBg100: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.bg100
    },
    getBg200: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.bg200
    },
    getBg300: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.bg300
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
      return themeColors.functionalColors
    },
    getPrimaryColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.primary.color
    },
    getSecondaryColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.secondary.color
    },
    getSuccessColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.success.color
    },
    getInfoColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.info.color
    },
    getWarnColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.warn.color
    },
    getHelpColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.help.color
    },
    getDangerColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.danger.color
    },
    getContrastColor: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.contrast.color
    },
    // 获取功能色hover
    getPrimaryColorHover: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.primary.hover
    },
    getSecondaryColorHover: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.secondary.hover
    },
    getSuccessColorHover: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.success.hover
    },
    getInfoColorHover: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.info.hover
    },
    getWarnColorHover: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.warn.hover
    },
    getHelpColorHover: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.help.hover
    },
    getDangerColorHover: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.danger.hover
    },
    getContrastColorHover: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.contrast.hover
    },
    // 获取功能色active
    getPrimaryColorActive: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.primary.active
    },
    getSecondaryColorActive: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.secondary.active
    },
    getSuccessColorActive: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.success.active
    },
    getInfoColorActive: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.info.active
    },
    getWarnColorActive: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.warn.active
    },
    getHelpColorActive: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.help.active
    },
    getDangerColorActive: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.danger.active
    },
    getContrastColorActive: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.contrast.active
    },
    // 获取功能色disabled
    getPrimaryColorDisabled: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.primary.disabled
    },
    getSecondaryColorDisabled: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.secondary.disabled
    },
    getSuccessColorDisabled: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.success.disabled
    },
    getInfoColorDisabled: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.info.disabled
    },
    getWarnColorDisabled: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.warn.disabled
    },
    getHelpColorDisabled: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.help.disabled
    },
    getDangerColorDisabled: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.danger.disabled
    },
    getContrastColorDisabled: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.contrast.disabled
    },
    // 获取功能色text
    getPrimaryColorText: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.primary.text
    },
    getSecondaryColorText: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.secondary.text
    },
    getSuccessColorText: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.success.text
    },
    getInfoColorText: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.info.text
    },
    getWarnColorText: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.warn.text
    },
    getHelpColorText: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.help.text
    },
    getDangerColorText: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.danger.text
    },
    getContrastColorText: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.contrast.text
    },
    // 获取功能色border
    getPrimaryColorBorder: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.primary.border
    },
    getSecondaryColorBorder: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.secondary.border
    },
    getSuccessColorBorder: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.success.border
    },
    getInfoColorBorder: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.info.border
    },
    getWarnColorBorder: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.warn.border
    },
    getHelpColorBorder: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.help.border
    },
    getDangerColorBorder: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.danger.border
    },
    getContrastColorBorder: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.contrast.border
    },
  },

  actions: {
    // 自动跟随系统主题
    setupAutoModeListener() {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      // 创建监听器函数
      this.mediaQueryListener = (_e: MediaQueryListEvent) => {
        this.darkMode = _e.matches
        this.setTheme(this.getThemeValue)
      }

      // 添加监听器
      this.mediaQuery.addEventListener('change', this.mediaQueryListener)
    },

    // 清理监听器
    cleanupMediaQueryListener() {
      if (this.mediaQuery && this.mediaQueryListener) {
        this.mediaQuery.removeEventListener('change', this.mediaQueryListener)
        this.mediaQuery = null
        this.mediaQueryListener = null
      }
    },

    // 设置主题模式
    setMode(mode: Mode) {
      this.cleanupMediaQueryListener()

      this.mode = mode
      this.darkMode = mode === 'auto' ? getSystemColorMode() === 'dark' : mode === 'dark'

      document.documentElement.classList.toggle('dark', mode === 'dark')

      if (mode === 'auto') {
        this.setupAutoModeListener()
      }

      // 设置完模式后重新设置 CSS 变量
      this.setCssVariables()
    },

    // 切换主题模式（在 light 和 dark 之间切换）
    toggleMode() {
      const isDark = this.darkMode
      const newMode = isDark ? 'light' : 'dark'
      this.setMode(newMode)
    },

    // 修改主题色
    setTheme(theme: ThemeColor['value']) {
      const isDark = this.darkMode
      if (isDark) {
        this.darkThemeValue = theme
      } else {
        this.lightThemeValue = theme
      }
      this.setCssVariables()
    },

    /* 将颜色变量都存储到 css 变量中 用于全局样式 */
    setCssVariables() {
      const cssVariables: Record<string, string> = {
        [toKebabCase('primary100', '--')]: this.getPrimary100,
        [toKebabCase('primary200', '--')]: this.getPrimary200,
        [toKebabCase('primary300', '--')]: this.getPrimary300,

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
    },

    /* 初始化方法 */
    init() {
      this.setMode(this.mode)
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
