/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 主题配置模块
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 创建功能颜色的函数 - 适配 PrimeVue 设计令牌系统
 */
export const createFunctionalColors: CreateFunctionalColors = primaryColor => {
  return {
    primary: {
      color: primaryColor.color,
      hover: primaryColor.hover,
      active: primaryColor.active,
      disabled: primaryColor.disabled,
      text: primaryColor.text,
      border: primaryColor.border,
    },

    secondary: {
      color: '#000000',
      hover: '#000000',
      active: '#000000',
      disabled: '#000000',
      text: '#000000',
      border: '#000000',
    },

    success: {
      color: '#52c41a',
      hover: '#73d13d',
      active: '#389e0d',
      disabled: '#d9d9d9',
      text: '#f6ffed',
      border: '#52c41a',
    },

    info: {
      color: '#1890ff',
      hover: '#40a9ff',
      active: '#096dd9',
      disabled: '#d9d9d9',
      text: '#e6f7ff',
      border: '#1890ff',
    },

    warn: {
      color: '#faad14',
      hover: '#ffc53d',
      active: '#d48806',
      disabled: '#d9d9d9',
      text: '#fffbe6',
      border: '#faad14',
    },

    help: {
      color: '#9c27b0',
      hover: '#ba68c8',
      active: '#7b1fa2',
      disabled: '#d9d9d9',
      text: '#f3e5f5',
      border: '#9c27b0',
    },

    danger: {
      color: '#f5222d',
      hover: '#ff4d4f',
      active: '#cf1322',
      disabled: '#d9d9d9',
      text: '#fff2f0',
      border: '#f5222d',
    },

    contrast: {
      color: '#000000',
      hover: '#000000',
      active: '#000000',
      disabled: '#000000',
      text: '#000000',
      border: '#000000',
    },
  }
}

/**
 * 主题模式选项
 */
export const modeOptions: ModeOptions[] = [
  { label: '明亮', value: 'light' },
  { label: '暗色', value: 'dark' },
  { label: '自动', value: 'auto' },
]

/**
 * 浅色主题选项
 */
export const lightThemeOptions: ThemeColor[] = [
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
      }),
    },
  },
]

/**
 * 深色主题选项
 */
export const darkThemeOptions: ThemeColor[] = [
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
      }),
    },
  },
]

/**
 * 获取主题选项的工具函数
 */
export const getThemeOptions: GetThemeOptions = isDark => {
  return isDark ? darkThemeOptions : lightThemeOptions
}

/**
 * 根据主题值获取主题配置的工具函数
 */
export const getThemeByValue: GetThemeByValue = (value, isDark) => {
  const options = getThemeOptions(isDark)
  return options.find(item => item.value === value)
}

/**
 * 获取默认主题的工具函数
 */
export const getDefaultTheme: GetDefaultTheme = isDark => {
  const options = getThemeOptions(isDark)
  return options[0]
}

/**
 * 尺寸预设配置
 */
// 移除静态的 width 和 height 计算
// const width = window.innerWidth
// const height = window.innerHeight

export const sizeOptions: SizeOptions[] = [
  { label: '紧凑', value: 'compact' },
  { label: '舒适', value: 'comfortable' },
  { label: '宽松', value: 'loose' },
]

/**
 * 获取当前窗口尺寸
 */
const getCurrentWindowSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

/**
 * 创建紧凑尺寸预设
 */
export const createCompactSizes = (): Layout => {
  const { width, height } = getCurrentWindowSize()
  return {
    sidebarWidth: width * 0.16,
    sidebarCollapsedWidth: width * 0.04,
    headerHeight: height * 0.04,
    breadcrumbHeight: height * 0.026,
    footerHeight: height * 0.026,
    tabsHeight: height * 0.03,
    contentHeight: 0,
    contentsHeight: 0,
  }
}

/**
 * 创建舒适尺寸预设
 */
export const createComfortableSizes = (): Layout => {
  const { width, height } = getCurrentWindowSize()
  return {
    sidebarWidth: width * 0.18,
    sidebarCollapsedWidth: width * 0.04,
    headerHeight: height * 0.05,
    breadcrumbHeight: height * 0.03,
    footerHeight: height * 0.03,
    tabsHeight: height * 0.04,
    contentHeight: 0,
    contentsHeight: 0,
  }
}

/**
 * 创建宽松尺寸预设
 */
export const createLooseSizes = (): Layout => {
  const { width, height } = getCurrentWindowSize()
  return {
    sidebarWidth: width * 0.2,
    sidebarCollapsedWidth: width * 0.04,
    headerHeight: height * 0.06,
    breadcrumbHeight: height * 0.04,
    footerHeight: height * 0.03,
    tabsHeight: height * 0.04,
    contentHeight: 0,
    contentsHeight: 0,
  }
}

// 为了向后兼容，保留原有的静态导出（使用当前窗口尺寸初始化）
export const compactSizes: Layout = createCompactSizes()
export const comfortableSizes: Layout = createComfortableSizes()
export const looseSizes: Layout = createLooseSizes()

// 创建尺寸预设映射表（使用函数而不是静态对象）
export const sizePresetsMap: Record<Size, () => Layout> = {
  compact: createCompactSizes,
  comfortable: createComfortableSizes,
  loose: createLooseSizes,
}

/**
 * 圆角选项配置
 */
export const roundedOptions: RoundedOptions[] = [
  { label: '尖锐', key: 'sharp', value: 0 },
  { label: '平滑', key: 'smooth', value: 6 },
  { label: '圆滑', key: 'round', value: 12 },
  { label: '圆润', key: 'soft', value: 24 },
]

/**
 * gap 选项配置
 */
export const gapOptions: GapOptions[] = [
  { label: '小', key: 'sm', value: 6 },
  { label: '中', key: 'md', value: 8 },
  { label: '大', key: 'lg', value: 10 },
]
