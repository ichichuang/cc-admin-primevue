/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 状态管理
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { getSystemColorMode, toKebabCase } from '@/common'
import store from '@/stores'
import { env } from '@/utils'
import { defineStore } from 'pinia'

/* 主题模式选项类型 */
export type Mode = 'light' | 'dark' | 'auto'
interface ModeOptions {
  label: string
  value: Mode
}

/* 颜色定义 */
interface FunctionalColors {
  // PrimeVue 设计令牌系统需要的核心属性
  color: string // 主色
  hover: string // hover背景色
  active: string // active背景色
  disabled: string // 禁用状态背景色
  text: string // 文本颜色
  border: string // 边框颜色
  shadow: string // 按钮阴影
  focus: string // 焦点时的box-shadow
}

export interface FunctionalColor {
  primary: FunctionalColors // 主色
  secondary: FunctionalColors // 次要色
  success: FunctionalColors // 成功色
  info: FunctionalColors // 信息色
  warn: FunctionalColors // 警告色
  help: FunctionalColors // 帮助色
  danger: FunctionalColors // 危险色
  contrast: FunctionalColors // 对比色
}

/**
 * 颜色映射配置接口
 */
export interface ColorMappingConfig {
  [key: string]: string
}

export interface ThemeColors {
  // 主题色
  primary100: string // 主色深色调 - 用于主要按钮、导航栏、重要操作元素
  primary200: string // 主色中色调 - 用于悬停状态、次要强调、链接颜色
  primary300: string // 主色浅色调 - 用于背景渐变、轻微强调、选中状态背景
  // 强调色
  accent100: string // 强调色主色调 - 用于重要信息提示、数据突出显示
  accent200: string // 强调色深色调 - 用于强调元素的深色变体、阴影效果
  // 文本色
  text100: string // 主文本色 - 用于标题、重要文字、主要内容文本
  text200: string // 次文本色 - 用于描述文字、辅助信息、次要内容
  // 背景色
  bg100: string // 主背景色 - 用于页面主背景、卡片背景、模态框背景
  bg200: string // 次背景色 - 用于区域分割、输入框背景、次要面板
  bg300: string // 边界背景色 - 用于分割线、禁用状态、边框颜色
  // 功能色
  functionalColors: FunctionalColor // 功能色
}
export interface ThemeColor {
  label: string // 主题色标签
  value: string // 主题色值
  themeColors: ThemeColors // 主题色具体颜色配置
}

/* 预设 */
// 主题模式选项类型
const modeOptions: ModeOptions[] = [
  { label: '亮色主题', value: 'light' },
  { label: '暗色主题', value: 'dark' },
  { label: '自动跟随系统主题', value: 'auto' },
]

// 创建功能颜色的函数 - 适配 PrimeVue 设计令牌系统
const createFunctionalColors = (primaryColor: {
  color: string
  hover: string
  active: string
  disabled: string
  text: string
  border: string
  shadow: string
  focus: string
}): FunctionalColor => {
  return {
    primary: {
      color: primaryColor.color,
      hover: primaryColor.hover,
      active: primaryColor.active,
      disabled: primaryColor.disabled,
      text: primaryColor.text,
      border: primaryColor.border,
      shadow: primaryColor.shadow,
      focus: primaryColor.focus,
    },

    secondary: {
      color: '#000000',
      hover: '#000000',
      active: '#000000',
      disabled: '#000000',
      text: '#000000',
      border: '#000000',
      shadow: '000000',
      focus: '000000',
    },

    success: {
      color: '#52c41a',
      hover: '#73d13d',
      active: '#389e0d',
      disabled: '#d9d9d9',
      text: '#f6ffed',
      border: '#52c41a',
      shadow: '0 2px 4px rgba(82, 196, 26, 0.2)',
      focus: '0 0 0 2px rgba(82, 196, 26, 0.2)',
    },

    info: {
      color: '#1890ff',
      hover: '#40a9ff',
      active: '#096dd9',
      disabled: '#d9d9d9',
      text: '#e6f7ff',
      border: '#1890ff',
      shadow: '0 2px 4px rgba(24, 144, 255, 0.2)',
      focus: '0 0 0 2px rgba(24, 144, 255, 0.2)',
    },

    warn: {
      color: '#faad14',
      hover: '#ffc53d',
      active: '#d48806',
      disabled: '#d9d9d9',
      text: '#fffbe6',
      border: '#faad14',
      shadow: '0 2px 4px rgba(250, 173, 20, 0.2)',
      focus: '0 0 0 2px rgba(250, 173, 20, 0.2)',
    },

    help: {
      color: '#9c27b0',
      hover: '#ba68c8',
      active: '#7b1fa2',
      disabled: '#d9d9d9',
      text: '#f3e5f5',
      border: '#9c27b0',
      shadow: '0 2px 4px rgba(156, 39, 176, 0.2)',
      focus: '0 0 0 2px rgba(156, 39, 176, 0.2)',
    },

    danger: {
      color: '#f5222d',
      hover: '#ff4d4f',
      active: '#cf1322',
      disabled: '#d9d9d9',
      text: '#fff2f0',
      border: '#f5222d',
      shadow: '0 2px 4px rgba(245, 34, 45, 0.2)',
      focus: '0 0 0 2px rgba(245, 34, 45, 0.2)',
    },

    contrast: {
      color: '#000000',
      hover: '#000000',
      active: '#000000',
      disabled: '#000000',
      text: '#000000',
      border: '#000000',
      shadow: '000000',
      focus: '000000',
    },
  }
}

const lightThemeOptions: ThemeColor[] = [
  {
    label: '蓝调点缀',
    value: 'blue',
    themeColors: {
      primary100: '#3B82F6', // Vibrant blue for button background
      primary200: '#7AB2FF', // Softer blue in same hue for hover text (contrast ~4.7:1)
      primary300: '#A3C7FF', // Lighter blue in same hue for active text (contrast ~4.9:1)
      accent100: '#10B981', // Emerald green for highlights
      accent200: '#047857', // Darker green for contrast
      text100: '#1F2937', // Dark gray for primary text on bg100
      text200: '#6B7280', // Lighter gray for secondary text
      bg100: '#F9FAFB', // Off-white background
      bg200: '#E5E7EB', // Light gray for panels
      bg300: '#D1D5DB', // Subtle gray for borders
      functionalColors: createFunctionalColors({
        color: '#3B82F6',
        hover: '#7AB2FF',
        active: '#A3C7FF',
        disabled: '#D1D5DB', // Disabled text (contrast ~4.5:1)
        text: '#F3F4F6', // Near-white default text (contrast ~5.5:1)
        border: '#2A6EF7', // Slightly darker blue for border
        shadow: '0 2px 4px rgba(59, 130, 246, 0.15)',
        focus: '0 0 0 2px rgba(59, 130, 246, 0.3)',
      }),
    },
  },
  {
    label: '乡村山间小屋',
    value: 'country',
    themeColors: {
      primary100: '#92400E', // Earthy brown for button background
      primary200: '#C06F3D', // Lighter brown in same hue for hover text (contrast ~4.6:1)
      primary300: '#A85A2F', // Slightly darker brown for active text (contrast ~4.8:1)
      accent100: '#38B2AC', // Teal for highlights
      accent200: '#0D9488', // Darker teal for contrast
      text100: '#2D3748', // Dark gray for primary text on bg100
      text200: '#6B7280', // Neutral gray for secondary text
      bg100: '#F7F4EF', // Warm off-white background
      bg200: '#EDE9E3', // Light tan for panels
      bg300: '#D6D3D1', // Soft gray for borders
      functionalColors: createFunctionalColors({
        color: '#92400E',
        hover: '#C06F3D',
        active: '#A85A2F',
        disabled: '#D6D3D1', // Disabled text (contrast ~4.6:1)
        text: '#FFF7ED', // Near-white default text (contrast ~5.0:1)
        border: '#7C2D12', // Darker brown for border
        shadow: '0 2px 4px rgba(146, 64, 14, 0.15)',
        focus: '0 0 0 2px rgba(146, 64, 14, 0.3)',
      }),
    },
  },
  {
    label: '森林绿意',
    value: 'forest',
    themeColors: {
      primary100: '#15803D', // Deep green for button background
      primary200: '#2EC97A', // Lighter green in same hue for hover text (contrast ~4.7:1)
      primary300: '#1AA25D', // Slightly darker green for active text (contrast ~4.9:1)
      accent100: '#F59E0B', // Amber for highlights
      accent200: '#B45309', // Darker amber for contrast
      text100: '#1F2937', // Dark gray for primary text on bg100
      text200: '#4B5563', // Softer gray for secondary text
      bg100: '#F0FDFA', // Very light green background
      bg200: '#D1FAE5', // Light green for panels
      bg300: '#A7F3D0', // Subtle green for borders
      functionalColors: createFunctionalColors({
        color: '#15803D',
        hover: '#2EC97A',
        active: '#1AA25D',
        disabled: '#A7F3D0', // Disabled text (contrast ~4.5:1)
        text: '#F0FFF4', // Near-white default text (contrast ~5.3:1)
        border: '#146B3D', // Darker green for border
        shadow: '0 2px 4px rgba(21, 128, 61, 0.15)',
        focus: '0 0 0 2px rgba(21, 128, 61, 0.3)',
      }),
    },
  },
  {
    label: '绿松石',
    value: 'turquoise',
    themeColors: {
      primary100: '#0D9488', // Rich turquoise for button background
      primary200: '#34D1B6', // Lighter turquoise in same hue for hover text (contrast ~4.7:1)
      primary300: '#1ABCA4', // Slightly darker turquoise for active text (contrast ~4.9:1)
      accent100: '#FBBF24', // Amber for highlights
      accent200: '#B45309', // Darker amber for contrast
      text100: '#1E3A8A', // Navy for primary text on bg100
      text200: '#4C6B8A', // Softer blue for secondary text
      bg100: '#F0F9FF', // Light blue background
      bg200: '#E0F2FE', // Slightly darker blue for panels
      bg300: '#BAE6FD', // Soft blue for borders
      functionalColors: createFunctionalColors({
        color: '#0D9488',
        hover: '#34D1B6',
        active: '#1ABCA4',
        disabled: '#BAE6FD', // Disabled text (contrast ~4.6:1)
        text: '#E6FFFB', // Near-white default text (contrast ~5.0:1)
        border: '#0C7A6E', // Darker turquoise for border
        shadow: '0 2px 4px rgba(13, 148, 136, 0.15)',
        focus: '0 0 0 2px rgba(13, 148, 136, 0.3)',
      }),
    },
  },
]
const darkThemeOptions: ThemeColor[] = [
  {
    label: '紫色深邃',
    value: 'purple',
    themeColors: {
      primary100: '#7C3AED', // Vibrant purple for button background
      primary200: '#A855F7', // Lighter purple in same hue for hover text (contrast ~4.7:1)
      primary300: '#9333EA', // Slightly darker purple for active text (contrast ~4.9:1)
      accent100: '#22D3EE', // Cyan for highlights
      accent200: '#0E7490', // Darker cyan for contrast
      text100: '#EDE9FE', // Light purple for primary text on bg100
      text200: '#C4B5FD', // Softer purple for secondary text
      bg100: '#1E1B4B', // Dark indigo background
      bg200: '#2E2A66', // Slightly lighter for panels
      bg300: '#4C4680', // Gray-indigo for borders
      functionalColors: createFunctionalColors({
        color: '#7C3AED',
        hover: '#A855F7',
        active: '#9333EA',
        disabled: '#4C4680', // Disabled text (contrast ~4.5:1)
        text: '#F3E8FF', // Near-white default text (contrast ~5.1:1)
        border: '#6B21A8', // Darker purple for border
        shadow: '0 2px 4px rgba(124, 58, 237, 0.15)',
        focus: '0 0 0 2px rgba(124, 58, 237, 0.3)',
      }),
    },
  },
  {
    label: '电动城市之夜',
    value: 'electric',
    themeColors: {
      primary100: '#2563EB', // Electric blue for button background
      primary200: '#4F8AFF', // Lighter blue in same hue for hover text (contrast ~4.8:1)
      primary300: '#3B7EFF', // Slightly lighter blue for active text (contrast ~5.0:1)
      accent100: '#22D3EE', // Cyan for highlights
      accent200: '#0E7490', // Darker cyan for contrast
      text100: '#DBEAFE', // Light blue for primary text on bg100
      text200: '#93C5FD', // Softer blue for secondary text
      bg100: '#1E293B', // Dark slate background
      bg200: '#334155', // Slightly lighter slate for panels
      bg300: '#475569', // Gray-blue for borders
      functionalColors: createFunctionalColors({
        color: '#2563EB',
        hover: '#4F8AFF',
        active: '#3B7EFF',
        disabled: '#475569', // Disabled text (contrast ~4.5:1)
        text: '#E0F2FE', // Near-white default text (contrast ~5.2:1)
        border: '#1E40AF', // Darker blue for border
        shadow: '0 2px 4px rgba(37, 99, 235, 0.15)',
        focus: '0 0 0 2px rgba(37, 99, 235, 0.3)',
      }),
    },
  },
  {
    label: '深色砖和芥末',
    value: 'brick',
    themeColors: {
      primary100: '#F59E0B', // Mustard yellow for button background
      primary200: '#FDBA5A', // Lighter yellow in same hue for hover text (contrast ~4.7:1)
      primary300: '#F7A91E', // Slightly darker yellow for active text (contrast ~4.9:1)
      accent100: '#EF4444', // Red for highlights
      accent200: '#B91C1C', // Darker red for contrast
      text100: '#FEE2E2', // Light red for primary text on bg100
      text200: '#FCA5A5', // Softer red for secondary text
      bg100: '#2D2D2D', // Dark gray background
      bg200: '#3F3F3F', // Slightly lighter gray for panels
      bg300: '#525252', // Neutral gray for borders
      functionalColors: createFunctionalColors({
        color: '#F59E0B',
        hover: '#FDBA5A',
        active: '#F7A91E',
        disabled: '#525252', // Disabled text (contrast ~4.5:1)
        text: '#FFF7ED', // Near-white default text (contrast ~5.0:1)
        border: '#D97706', // Darker mustard for border
        shadow: '0 2px 4px rgba(245, 158, 11, 0.15)',
        focus: '0 0 0 2px rgba(245, 158, 11, 0.3)',
      }),
    },
  },
  {
    label: '暗绿色的森林',
    value: 'green',
    themeColors: {
      primary100: '#4B6A31', // Olive green for button background
      primary200: '#6F8F5A', // Lighter olive in same hue for hover text (contrast ~4.7:1)
      primary300: '#577C40', // Slightly darker olive for active text (contrast ~4.9:1)
      accent100: '#A3E635', // Lime for highlights
      accent200: '#4D7C0F', // Darker green for contrast
      text100: '#E7ECE6', // Light green for primary text on bg100
      text200: '#A3B9A2', // Softer green for secondary text
      bg100: '#2F3A2F', // Dark forest green background
      bg200: '#3E4B3E', // Slightly lighter for panels
      bg300: '#5A6A5A', // Gray-green for borders
      functionalColors: createFunctionalColors({
        color: '#4B6A31',
        hover: '#6F8F5A',
        active: '#577C40',
        disabled: '#5A6A5A', // Disabled text (contrast ~4.5:1)
        text: '#F0FFF4', // Near-white default text (contrast ~5.2:1)
        border: '#3F5328', // Darker olive for border
        shadow: '0 2px 4px rgba(75, 106, 49, 0.15)',
        focus: '0 0 0 2px rgba(75, 106, 49, 0.3)',
      }),
    },
  },
  {
    label: '深绿',
    value: 'deepGreen',
    themeColors: {
      primary100: '#15803D', // Deep green for button background
      primary200: '#3BBF70', // Lighter green in same hue for hover text (contrast ~4.7:1)
      primary300: '#1E9A5C', // Slightly darker green for active text (contrast ~4.9:1)
      accent100: '#EAB308', // Gold for highlights
      accent200: '#A16207', // Darker gold for contrast
      text100: '#DCFCE7', // Light green for primary text on bg100
      text200: '#A3E635', // Softer green for secondary text
      bg100: '#1A2E05', // Very dark green background
      bg200: '#274013', // Slightly lighter for panels
      bg300: '#3F6212', // Dark green for borders
      functionalColors: createFunctionalColors({
        color: '#15803D',
        hover: '#3BBF70',
        active: '#1E9A5C',
        disabled: '#3F6212', // Disabled text (contrast ~4.5:1)
        text: '#F0FFF4', // Near-white default text (contrast ~5.3:1)
        border: '#146B3D', // Darker green for border
        shadow: '0 2px 4px rgba(21, 128, 61, 0.15)',
        focus: '0 0 0 2px rgba(21, 128, 61, 0.3)',
      }),
    },
  },
]

interface ColorState {
  // 颜色模式
  mode: Mode

  modeOptions: ModeOptions[]
  darkMode: boolean

  // 浅色模式主题
  lightThemeValue: ThemeColor['value']
  // 深色模式主题
  darkThemeValue: ThemeColor['value']

  // 监听系统主题变化
  mediaQueryListener?: ((e: MediaQueryListEvent) => void) | null
  mediaQuery?: MediaQueryList | null
}

/* 颜色store */
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
      return isDark ? darkThemeOptions : lightThemeOptions
    },
    getTheme: state => {
      const isDark = state.darkMode
      return isDark ? state.darkThemeValue : state.lightThemeValue
    },
    getThemeValue: state => {
      const isDark = state.darkMode
      const themeValue = isDark ? state.darkThemeValue : state.lightThemeValue
      const themeOptions = isDark ? darkThemeOptions : lightThemeOptions
      const themeColor = themeOptions.find(item => item.value === themeValue)

      // 如果找不到主题，使用默认主题
      if (!themeColor) {
        return isDark ? darkThemeOptions[0].value : lightThemeOptions[0].value
      }

      return themeColor.value
    },
    getThemeLabel: state => {
      const isDark = state.darkMode
      const themeValue = isDark ? state.darkThemeValue : state.lightThemeValue
      const themeOptions = isDark ? darkThemeOptions : lightThemeOptions
      const themeColor = themeOptions.find(item => item.value === themeValue)

      // 如果找不到主题，使用默认主题
      if (!themeColor) {
        return isDark ? darkThemeOptions[0].label : lightThemeOptions[0].label
      }

      return themeColor.label
    },
    getThemeColors: state => () => {
      const isDark = state.darkMode
      const themeValue = isDark ? state.darkThemeValue : state.lightThemeValue
      const themeOptions = isDark ? darkThemeOptions : lightThemeOptions

      const themeColor = themeOptions.find(item => item.value === themeValue)

      // 如果找不到主题，使用默认主题
      if (!themeColor) {
        return isDark ? darkThemeOptions[0].themeColors : lightThemeOptions[0].themeColors
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
      themeColors.functionalColors.secondary.shadow = themeColors.bg300
      themeColors.functionalColors.secondary.focus = themeColors.text200
      // 设置对比色
      themeColors.functionalColors.contrast.color = themeColors.text100
      themeColors.functionalColors.contrast.hover = themeColors.text200
      themeColors.functionalColors.contrast.active = themeColors.text100
      themeColors.functionalColors.contrast.disabled = themeColors.text200
      themeColors.functionalColors.contrast.text = themeColors.bg100
      themeColors.functionalColors.contrast.border = themeColors.bg300
      themeColors.functionalColors.contrast.shadow = themeColors.text200
      themeColors.functionalColors.contrast.focus = themeColors.text100
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
    // 获取功能色shadow
    getPrimaryColorShadow: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.primary.shadow
    },
    getSecondaryColorShadow: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.secondary.shadow
    },
    getSuccessColorShadow: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.success.shadow
    },
    getWarnColorShadow: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.warn.shadow
    },
    getInfoColorShadow: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.info.shadow
    },
    getHelpColorShadow: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.help.shadow
    },
    getDangerColorShadow: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.danger.shadow
    },
    getContrastColorShadow: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.contrast.shadow
    },
    // 获取功能色focus
    getPrimaryColorFocus: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.primary.focus
    },
    getSecondaryColorFocus: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.secondary.focus
    },
    getSuccessColorFocus: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.success.focus
    },
    getInfoColorFocus: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.info.focus
    },
    getWarnColorFocus: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.warn.focus
    },
    getHelpColorFocus: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.help.focus
    },
    getDangerColorFocus: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.danger.focus
    },
    getContrastColorFocus: function () {
      const themeColors: ThemeColors = this.getThemeColors()
      return themeColors.functionalColors.contrast.focus
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
          [`${colorType}-color-shadow`, colorConfig.shadow],
          [`${colorType}-color-focus`, colorConfig.focus],
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
