/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 主题颜色组合式函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import type { ColorMappingConfig } from '@/stores/modules/color'
import { useColorStore } from '@/stores/modules/color'
import {
  createColorMapping,
  generateColorPalette,
  generateCompletePalette,
  generateContrastColor,
  generateFunctionalPalette,
  generatePrimaryPalette,
  generateSurfacePalette,
  validateThemeColors,
} from '@/utils/colorUtils'
import { computed } from 'vue'

/**
 * 主题颜色组合式函数
 */
export function useThemeColors() {
  const colorStore = useColorStore()

  // 获取当前主题颜色
  const themeColors = computed(() => colorStore.getThemeColors())

  // 获取是否为暗色模式
  const isDark = computed(() => colorStore.isDark)

  // 生成标准调色板
  const standardPalette = computed(() => {
    return generateColorPalette(themeColors.value)
  })

  // 生成自定义映射的调色板
  const customPalette = computed(() => {
    const customMapping = createColorMapping({
      '500': 'primary100',
      '600': 'primary200',
      '700': 'primary300',
    })
    return generateColorPalette(themeColors.value, customMapping)
  })

  // 生成主色调色板
  const primaryPalette = computed(() => {
    return generatePrimaryPalette(themeColors.value, isDark.value)
  })

  // 生成表面色调色板
  const surfacePalette = computed(() => {
    return generateSurfacePalette(themeColors.value, isDark.value)
  })

  // 生成功能色调色板
  const functionalPalettes = computed(() => ({
    primary: generateFunctionalPalette(themeColors.value, 'primary'),
    success: generateFunctionalPalette(themeColors.value, 'success'),
    warning: generateFunctionalPalette(themeColors.value, 'warning'),
    error: generateFunctionalPalette(themeColors.value, 'error'),
    info: generateFunctionalPalette(themeColors.value, 'info'),
  }))

  // 生成对比色
  const contrastColor = computed(() => {
    return generateContrastColor(themeColors.value, isDark.value)
  })

  // 生成完整的主题调色板
  const completePalette = computed(() => {
    return generateCompletePalette(themeColors.value, isDark.value)
  })

  // 验证主题颜色
  const colorValidation = computed(() => {
    return validateThemeColors(themeColors.value)
  })

  // 生成组件特定的调色板
  const generateComponentPalette = (componentMapping: ColorMappingConfig) => {
    return generateColorPalette(themeColors.value, componentMapping)
  }

  // 生成按钮颜色
  const buttonColors = computed(() => {
    return generateComponentPalette({
      '500': 'primary100',
      '600': 'primary200',
      '700': 'primary300',
    })
  })

  // 生成卡片颜色
  const cardColors = computed(() => {
    return generateComponentPalette({
      '50': 'bg300',
      '100': 'bg200',
      '200': 'bg100',
    })
  })

  // 生成表单颜色
  const formColors = computed(() => {
    return generateComponentPalette({
      '100': 'bg100',
      '200': 'bg200',
      '300': 'bg300',
      '500': 'primary100',
      '600': 'primary200',
    })
  })

  // 生成导航颜色
  const navigationColors = computed(() => {
    return {
      background: isDark.value ? themeColors.value.bg200 : themeColors.value.bg100,
      active: themeColors.value.primary100,
      hover: themeColors.value.primary200,
      text: themeColors.value.text100,
      border: themeColors.value.bg300,
    }
  })

  // 生成状态颜色
  const statusColors = computed(() => ({
    success: {
      background: functionalPalettes.value.success['100'],
      color: functionalPalettes.value.success['500'],
      border: functionalPalettes.value.success['200'],
    },
    warning: {
      background: functionalPalettes.value.warning['100'],
      color: functionalPalettes.value.warning['500'],
      border: functionalPalettes.value.warning['200'],
    },
    error: {
      background: functionalPalettes.value.error['100'],
      color: functionalPalettes.value.error['500'],
      border: functionalPalettes.value.error['200'],
    },
    info: {
      background: functionalPalettes.value.info['100'],
      color: functionalPalettes.value.info['500'],
      border: functionalPalettes.value.info['200'],
    },
  }))

  // 生成阴影配置
  const shadowConfig = computed(() => ({
    light: isDark.value ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
    medium: isDark.value ? '0 4px 16px rgba(0, 0, 0, 0.4)' : '0 4px 16px rgba(0, 0, 0, 0.15)',
    heavy: isDark.value ? '0 8px 32px rgba(0, 0, 0, 0.5)' : '0 8px 32px rgba(0, 0, 0, 0.2)',
  }))

  // 生成边框配置
  const borderConfig = computed(() => ({
    light: themeColors.value.bg300,
    medium: themeColors.value.bg200,
    heavy: themeColors.value.bg100,
    focus: themeColors.value.primary100,
    error: functionalPalettes.value.error['500'],
    success: functionalPalettes.value.success['500'],
    warning: functionalPalettes.value.warning['500'],
    info: functionalPalettes.value.info['500'],
  }))

  // 生成间距配置
  const spacingConfig = computed(() => ({
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  }))

  // 生成圆角配置
  const borderRadiusConfig = computed(() => ({
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  }))

  // 生成字体配置
  const typographyConfig = computed(() => ({
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      mono: 'JetBrains Mono, Consolas, monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xl2: '24px',
      xl3: '30px',
      xl4: '36px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  }))

  // 生成动画配置
  const animationConfig = computed(() => ({
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  }))

  // 生成响应式断点配置
  const breakpointConfig = computed(() => ({
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xl2: '1536px',
  }))

  // 计算颜色对比度
  const calculateContrastRatio = (color1: string, color2: string): number => {
    try {
      // 简单的对比度计算（这里可以扩展为更精确的算法）
      const hex1 = color1.replace('#', '')
      const hex2 = color2.replace('#', '')

      const rgb1 = {
        r: parseInt(hex1.substr(0, 2), 16),
        g: parseInt(hex1.substr(2, 2), 16),
        b: parseInt(hex1.substr(4, 2), 16),
      }

      const rgb2 = {
        r: parseInt(hex2.substr(0, 2), 16),
        g: parseInt(hex2.substr(2, 2), 16),
        b: parseInt(hex2.substr(4, 2), 16),
      }

      const luminance1 = (0.299 * rgb1.r + 0.587 * rgb1.g + 0.114 * rgb1.b) / 255
      const luminance2 = (0.299 * rgb2.r + 0.587 * rgb2.g + 0.114 * rgb2.b) / 255

      const lighter = Math.max(luminance1, luminance2)
      const darker = Math.min(luminance1, luminance2)

      return (lighter + 0.05) / (darker + 0.05)
    } catch (error) {
      console.error('计算对比度失败:', error)
      return 1
    }
  }

  // 检查颜色是否满足可访问性标准
  const checkAccessibility = (foreground: string, background: string) => {
    const contrastRatio = calculateContrastRatio(foreground, background)

    return {
      contrastRatio,
      meetsAA: contrastRatio >= 4.5, // 正常文本的AA标准
      meetsAAA: contrastRatio >= 7, // 正常文本的AAA标准
      meetsAALarge: contrastRatio >= 3, // 大文本的AA标准
      meetsAAALarge: contrastRatio >= 4.5, // 大文本的AAA标准
    }
  }

  // 生成颜色变体
  const generateColorVariants = (baseColor: string) => {
    try {
      const hex = baseColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)

      return {
        lighter: `#${Math.min(255, Math.round(r * 1.2))
          .toString(16)
          .padStart(2, '0')}${Math.min(255, Math.round(g * 1.2))
          .toString(16)
          .padStart(2, '0')}${Math.min(255, Math.round(b * 1.2))
          .toString(16)
          .padStart(2, '0')}`,
        darker: `#${Math.max(0, Math.round(r * 0.8))
          .toString(16)
          .padStart(2, '0')}${Math.max(0, Math.round(g * 0.8))
          .toString(16)
          .padStart(2, '0')}${Math.max(0, Math.round(b * 0.8))
          .toString(16)
          .padStart(2, '0')}`,
        muted: `#${Math.round(r * 0.7)
          .toString(16)
          .padStart(2, '0')}${Math.round(g * 0.7)
          .toString(16)
          .padStart(2, '0')}${Math.round(b * 0.7)
          .toString(16)
          .padStart(2, '0')}`,
        saturated: `#${Math.min(255, Math.round(r * 1.3))
          .toString(16)
          .padStart(2, '0')}${Math.min(255, Math.round(g * 1.3))
          .toString(16)
          .padStart(2, '0')}${Math.min(255, Math.round(b * 1.3))
          .toString(16)
          .padStart(2, '0')}`,
      }
    } catch (error) {
      console.error('生成颜色变体失败:', error)
      return {
        lighter: baseColor,
        darker: baseColor,
        muted: baseColor,
        saturated: baseColor,
      }
    }
  }

  // 混合颜色
  const blendColors = (color1: string, color2: string, ratio: number = 0.5) => {
    try {
      const hex1 = color1.replace('#', '')
      const hex2 = color2.replace('#', '')

      const r1 = parseInt(hex1.substr(0, 2), 16)
      const g1 = parseInt(hex1.substr(2, 2), 16)
      const b1 = parseInt(hex1.substr(4, 2), 16)

      const r2 = parseInt(hex2.substr(0, 2), 16)
      const g2 = parseInt(hex2.substr(2, 2), 16)
      const b2 = parseInt(hex2.substr(4, 2), 16)

      const r = Math.round(r1 * (1 - ratio) + r2 * ratio)
      const g = Math.round(g1 * (1 - ratio) + g2 * ratio)
      const b = Math.round(b1 * (1 - ratio) + b2 * ratio)

      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    } catch (error) {
      console.error('混合颜色失败:', error)
      return color1
    }
  }

  // 生成主题预览
  const generateThemePreview = () => {
    return {
      primary: {
        main: themeColors.value.primary100,
        variants: generateColorVariants(themeColors.value.primary100),
        accessibility: checkAccessibility(themeColors.value.primary100, themeColors.value.bg100),
      },
      accent: {
        main: themeColors.value.accent100,
        variants: generateColorVariants(themeColors.value.accent100),
        accessibility: checkAccessibility(themeColors.value.accent100, themeColors.value.bg100),
      },
      text: {
        primary: themeColors.value.text100,
        secondary: themeColors.value.text200,
        accessibility: checkAccessibility(themeColors.value.text100, themeColors.value.bg100),
      },
      background: {
        primary: themeColors.value.bg100,
        secondary: themeColors.value.bg200,
        tertiary: themeColors.value.bg300,
      },
      functional: {
        success: {
          main: functionalPalettes.value.success['500'],
          variants: generateColorVariants(functionalPalettes.value.success['500']),
          accessibility: checkAccessibility(
            functionalPalettes.value.success['500'],
            themeColors.value.bg100
          ),
        },
        warning: {
          main: functionalPalettes.value.warning['500'],
          variants: generateColorVariants(functionalPalettes.value.warning['500']),
          accessibility: checkAccessibility(
            functionalPalettes.value.warning['500'],
            themeColors.value.bg100
          ),
        },
        error: {
          main: functionalPalettes.value.error['500'],
          variants: generateColorVariants(functionalPalettes.value.error['500']),
          accessibility: checkAccessibility(
            functionalPalettes.value.error['500'],
            themeColors.value.bg100
          ),
        },
        info: {
          main: functionalPalettes.value.info['500'],
          variants: generateColorVariants(functionalPalettes.value.info['500']),
          accessibility: checkAccessibility(
            functionalPalettes.value.info['500'],
            themeColors.value.bg100
          ),
        },
      },
    }
  }

  // 生成主题报告
  const generateThemeReport = () => {
    const preview = generateThemePreview()
    const report = {
      theme: colorStore.getThemeValue,
      mode: isDark.value ? 'dark' : 'light',
      colors: Object.keys(themeColors.value).length,
      functionalColors: Object.keys(functionalPalettes.value).length,
      accessibility: {
        primary: preview.primary.accessibility,
        accent: preview.accent.accessibility,
        text: preview.text.accessibility,
        functional: {
          success: preview.functional.success.accessibility,
          warning: preview.functional.warning.accessibility,
          error: preview.functional.error.accessibility,
          info: preview.functional.info.accessibility,
        },
      },
      validation: colorValidation.value,
      timestamp: new Date().toISOString(),
    }

    return report
  }

  return {
    // 基础颜色
    themeColors,
    isDark,

    // 调色板
    standardPalette,
    customPalette,
    primaryPalette,
    surfacePalette,
    functionalPalettes,
    contrastColor,
    completePalette,

    // 验证
    colorValidation,

    // 工具函数
    generateComponentPalette,

    // 组件特定颜色
    buttonColors,
    cardColors,
    formColors,
    navigationColors,
    statusColors,

    // 设计系统配置
    shadowConfig,
    borderConfig,
    spacingConfig,
    borderRadiusConfig,
    typographyConfig,
    animationConfig,
    breakpointConfig,

    // 新增的颜色工具函数
    calculateContrastRatio,
    checkAccessibility,
    generateColorVariants,
    blendColors,
    generateThemePreview,
    generateThemeReport,
  }
}
