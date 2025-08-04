/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - PrimeVue 主题集成配置
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import type { ThemeColors } from '@/stores/modules/color'
import {
  generateCompletePalette,
  generateContrastColor,
  generateFunctionalPalette,
  generatePrimaryPalette,
  generateSurfacePalette,
  validateThemeColors,
} from '@/utils/colorUtils'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

/**
 * 创建 PrimeVue 自定义主题预设
 * @param themeColors 当前框架的主题颜色配置
 * @param isDark 是否为暗色模式
 * @returns PrimeVue 主题预设
 */
export function createPrimeVuePreset(themeColors: ThemeColors, isDark: boolean) {
  // 验证主题颜色
  const validation = validateThemeColors(themeColors)
  if (!validation.isValid) {
    console.warn('主题颜色验证失败:', validation.errors)
  }

  // 使用颜色工具函数生成各种调色板
  const surfacePalette = generateSurfacePalette(themeColors, isDark)
  const primaryPalette = generatePrimaryPalette(themeColors, isDark)
  const functionalPalettes = {
    primary: generateFunctionalPalette(themeColors, 'primary'),
    success: generateFunctionalPalette(themeColors, 'success'),
    warning: generateFunctionalPalette(themeColors, 'warning'),
    error: generateFunctionalPalette(themeColors, 'error'),
    info: generateFunctionalPalette(themeColors, 'info'),
  }
  const contrastColor = generateContrastColor(themeColors, isDark)

  // 生成表单字段颜色配置
  const generateFormFieldColors = () => {
    const baseBg = isDark ? themeColors.bg200 : themeColors.bg100
    const disabledBg = isDark ? themeColors.bg300 : themeColors.bg200
    const filledBg = isDark ? themeColors.bg300 : themeColors.bg200

    return {
      background: baseBg,
      disabledBackground: disabledBg,
      filledBackground: filledBg,
      filledHoverBackground: filledBg,
      filledFocusBackground: baseBg,
      borderColor: themeColors.bg300,
      hoverBorderColor: themeColors.primary200,
      focusBorderColor: themeColors.primary100,
      invalidBorderColor: functionalPalettes.error['500'],
      color: themeColors.text100,
      disabledColor: themeColors.text200,
      placeholderColor: themeColors.text200,
      floatLabelColor: themeColors.text200,
      floatLabelFocusColor: themeColors.primary100,
      floatLabelActiveColor: themeColors.primary100,
      floatLabelInvalidColor: functionalPalettes.error['500'],
      iconColor: themeColors.text200,
      shadow: isDark
        ? '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        : '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)',
    }
  }

  // 生成文本颜色配置
  const generateTextColors = () => {
    return {
      color: themeColors.text100,
      hoverColor: themeColors.text200,
      mutedColor: themeColors.text200,
    }
  }

  // 生成高亮颜色配置
  const generateHighlightColors = () => {
    return {
      background: themeColors.accent100,
      focusBackground: themeColors.accent200,
      color: contrastColor,
      focusColor: contrastColor,
    }
  }

  return definePreset(Aura, {
    semantic: {
      primary: primaryPalette,
      colorScheme: {
        light: {
          surface: surfacePalette,
          primary: {
            color: themeColors.primary100,
            contrastColor: contrastColor,
            hoverColor: themeColors.primary200,
            activeColor: themeColors.primary300,
          },
          text: generateTextColors(),
          formField: generateFormFieldColors(),
          highlight: generateHighlightColors(),
        },
        dark: {
          surface: surfacePalette,
          primary: {
            color: themeColors.primary100,
            contrastColor: contrastColor,
            hoverColor: themeColors.primary200,
            activeColor: themeColors.primary300,
          },
          text: generateTextColors(),
          formField: generateFormFieldColors(),
          highlight: generateHighlightColors(),
        },
      },
      focusRing: {
        width: '2px',
        style: 'solid',
        color: themeColors.primary100,
        offset: '2px',
        shadow: 'none',
      },
      mask: {
        background: 'rgba(0, 0, 0, 0.4)',
        color: themeColors.text100,
      },
    },
  })
}

/**
 * 生成组件特定的颜色配置
 * @param themeColors 主题颜色配置
 * @param isDark 是否为暗色模式
 * @returns 组件颜色配置
 */
export function generateComponentColors(themeColors: ThemeColors, isDark: boolean) {
  const completePalette = generateCompletePalette(themeColors, isDark)

  return {
    // 按钮颜色配置 - 遵循 functionalColors 结构
    button: {
      primary: {
        color: themeColors.functionalColors.primary.color,
        hover: themeColors.functionalColors.primary.hover,
        active: themeColors.functionalColors.primary.active,
        disabled: themeColors.functionalColors.primary.disabled,
        light: themeColors.functionalColors.primary.light,
      },
      secondary: {
        color: themeColors.functionalColors.primary.color,
        hover: themeColors.functionalColors.primary.hover,
        active: themeColors.functionalColors.primary.active,
        disabled: themeColors.functionalColors.primary.disabled,
        light: themeColors.functionalColors.primary.light,
      },
      success: {
        color: themeColors.functionalColors.success.color,
        hover: themeColors.functionalColors.success.hover,
        active: themeColors.functionalColors.success.active,
        disabled: themeColors.functionalColors.success.disabled,
        light: themeColors.functionalColors.success.light,
      },
      warning: {
        color: themeColors.functionalColors.warning.color,
        hover: themeColors.functionalColors.warning.hover,
        active: themeColors.functionalColors.warning.active,
        disabled: themeColors.functionalColors.warning.disabled,
        light: themeColors.functionalColors.warning.light,
      },
      error: {
        color: themeColors.functionalColors.error.color,
        hover: themeColors.functionalColors.error.hover,
        active: themeColors.functionalColors.error.active,
        disabled: themeColors.functionalColors.error.disabled,
        light: themeColors.functionalColors.error.light,
      },
      info: {
        color: themeColors.functionalColors.info.color,
        hover: themeColors.functionalColors.info.hover,
        active: themeColors.functionalColors.info.active,
        disabled: themeColors.functionalColors.info.disabled,
        light: themeColors.functionalColors.info.light,
      },
    },
    // 卡片颜色配置
    card: {
      surface: completePalette.surface,
      border: themeColors.bg300,
      shadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    // 表单颜色配置
    form: {
      field: {
        background: isDark ? themeColors.bg200 : themeColors.bg100,
        border: themeColors.bg300,
        focus: themeColors.primary100,
        error: themeColors.functionalColors.error.color,
      },
      label: {
        color: themeColors.text100,
        required: themeColors.functionalColors.error.color,
      },
    },
    // 导航颜色配置
    navigation: {
      background: isDark ? themeColors.bg200 : themeColors.bg100,
      active: themeColors.primary100,
      hover: themeColors.primary200,
      text: themeColors.text100,
    },
    // 状态颜色配置 - 遵循 functionalColors 结构
    status: {
      success: {
        color: themeColors.functionalColors.success.color,
        hover: themeColors.functionalColors.success.hover,
        active: themeColors.functionalColors.success.active,
        disabled: themeColors.functionalColors.success.disabled,
        light: themeColors.functionalColors.success.light,
      },
      warning: {
        color: themeColors.functionalColors.warning.color,
        hover: themeColors.functionalColors.warning.hover,
        active: themeColors.functionalColors.warning.active,
        disabled: themeColors.functionalColors.warning.disabled,
        light: themeColors.functionalColors.warning.light,
      },
      error: {
        color: themeColors.functionalColors.error.color,
        hover: themeColors.functionalColors.error.hover,
        active: themeColors.functionalColors.error.active,
        disabled: themeColors.functionalColors.error.disabled,
        light: themeColors.functionalColors.error.light,
      },
      info: {
        color: themeColors.functionalColors.info.color,
        hover: themeColors.functionalColors.info.hover,
        active: themeColors.functionalColors.info.active,
        disabled: themeColors.functionalColors.info.disabled,
        light: themeColors.functionalColors.info.light,
      },
    },
  }
}

/**
 * 生成 CSS 变量配置
 * @param themeColors 主题颜色配置
 * @param isDark 是否为暗色模式
 * @returns CSS 变量配置
 */
export function generateCssVariables(themeColors: ThemeColors, isDark: boolean) {
  const componentColors = generateComponentColors(themeColors, isDark)

  return {
    // 基础颜色变量
    ccPrimary: themeColors.primary100,
    ccPrimaryHover: themeColors.primary200,
    ccPrimaryActive: themeColors.primary300,
    ccAccent: themeColors.accent100,
    ccAccentHover: themeColors.accent200,
    ccTextPrimary: themeColors.text100,
    ccTextSecondary: themeColors.text200,
    ccBgPrimary: themeColors.bg100,
    ccBgSecondary: themeColors.bg200,
    ccBgTertiary: themeColors.bg300,

    // 功能颜色变量
    ccSuccess: themeColors.functionalColors.success.color,
    ccWarning: themeColors.functionalColors.warning.color,
    ccError: themeColors.functionalColors.error.color,
    ccInfo: themeColors.functionalColors.info.color,

    // 组件颜色变量
    ccButtonPrimary: componentColors.button.primary.color,
    ccButtonSecondary: componentColors.button.primary.hover,
    ccCardBg: componentColors.card.surface['100'],
    ccCardBorder: componentColors.card.border,
    ccFormBg: componentColors.form.field.background,
    ccFormBorder: componentColors.form.field.border,
    ccFormFocus: componentColors.form.field.focus,
    ccNavBg: componentColors.navigation.background,
    ccNavActive: componentColors.navigation.active,

    // 主题模式标识
    ccThemeMode: isDark ? 'dark' : 'light',
  }
}

/**
 * PrimeVue 配置选项
 */
export const primeVueThemeOptions = {
  cssLayer: {
    name: 'primevue',
    order: 'reset, primevue, cc-admin-custom',
  },
  prefix: 'p',
  darkModeSelector: '.dark',
}

/**
 * 更新 PrimeVue 主题
 * @param themeColors 主题颜色配置
 * @param isDark 是否为暗色模式
 */
export function updatePrimeVueTheme(themeColors: ThemeColors, isDark: boolean) {
  // 创建新的主题预设
  const newPreset = createPrimeVuePreset(themeColors, isDark)

  // 生成并应用 CSS 变量
  const cssVariables = generateCssVariables(themeColors, isDark)
  Object.entries(cssVariables).forEach(([key, value]) => {
    // 将 camelCase 转换为 kebab-case 并添加 -- 前缀
    const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    document.documentElement.style.setProperty(cssVarName, value)
  })

  // 更新主题模式类
  document.documentElement.classList.toggle('dark', isDark)

  console.log('PrimeVue theme updated:', { themeColors, isDark, cssVariables })

  return newPreset
}

/**
 * 主题配置验证器
 * @param themeColors 主题颜色配置
 * @returns 验证结果
 */
export function validateThemeConfiguration(themeColors: ThemeColors) {
  const validation = validateThemeColors(themeColors)

  // 额外的业务逻辑验证
  const additionalChecks = {
    hasValidPrimaryColors:
      !!themeColors.primary100 && !!themeColors.primary200 && !!themeColors.primary300,
    hasValidBackgroundColors: !!themeColors.bg100 && !!themeColors.bg200 && !!themeColors.bg300,
    hasValidTextColors: !!themeColors.text100 && !!themeColors.text200,
    hasValidFunctionalColors: !!themeColors.functionalColors,
  }

  const allValid = validation.isValid && Object.values(additionalChecks).every(Boolean)

  return {
    isValid: allValid,
    errors: validation.errors,
    warnings: validation.warnings,
    additionalChecks,
  }
}

/**
 * 使用示例：
 *
 * // 在 main.ts 中
 * import { setupPrimeVue } from '@/plugins/modules/primevue'
 * import { createPrimeVuePreset, primeVueThemeOptions } from '@/plugins/modules/primevue-theme'
 * import { useColorStore } from '@/stores/modules/color'
 *
 * const app = createApp(App)
 * const colorStore = useColorStore()
 *
 * // 创建动态主题
 * const dynamicPreset = createPrimeVuePreset(
 *   colorStore.getThemeColors(),
 *   colorStore.isDark
 * )
 *
 * // 设置 PrimeVue
 * setupPrimeVue(app, {
 *   preset: dynamicPreset,
 *   ...primeVueThemeOptions
 * })
 *
 * // 在主题切换时更新
 * colorStore.$subscribe((mutation, state) => {
 *   if (mutation.type === 'direct') {
 *     const newPreset = updatePrimeVueTheme(
 *       state.getThemeColors(),
 *       state.isDark
 *     )
 *     // 重新应用主题
 *   }
 * })
 */
