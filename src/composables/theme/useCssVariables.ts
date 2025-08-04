/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - CSS 变量工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { watch } from 'vue'
import { useThemeColors } from './useThemeColors'

/**
 * CSS 变量工具函数
 */
export function useCssVariables() {
  const {
    themeColors,
    isDark,
    functionalPalettes,
    shadowConfig,
    borderConfig,
    spacingConfig,
    borderRadiusConfig,
    typographyConfig,
    animationConfig,
    breakpointConfig,
  } = useThemeColors()

  // 获取CSS变量值
  const getCssVariable = (name: string): string => {
    try {
      return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()
    } catch (error) {
      console.error(`获取CSS变量失败: --${name}`, error)
      return ''
    }
  }

  // 设置CSS变量
  const setCssVariable = (name: string, value: string): void => {
    try {
      document.documentElement.style.setProperty(`--${name}`, value)
    } catch (error) {
      console.error(`设置CSS变量失败: --${name} = ${value}`, error)
    }
  }

  // 批量设置CSS变量
  const setCssVariables = (variables: Record<string, string>): void => {
    Object.entries(variables).forEach(([name, value]) => {
      setCssVariable(name, value)
    })
  }

  // 移除CSS变量
  const removeCssVariable = (name: string): void => {
    try {
      document.documentElement.style.removeProperty(`--${name}`)
    } catch (error) {
      console.error(`移除CSS变量失败: --${name}`, error)
    }
  }

  // 检查CSS变量是否存在
  const hasCssVariable = (name: string): boolean => {
    const value = getCssVariable(name)
    return value !== '' && value !== 'initial' && value !== 'unset'
  }

  // 生成基础颜色CSS变量
  const generateBaseColorVariables = () => {
    const variables: Record<string, string> = {}

    // 主色调
    variables['cc-primary'] = themeColors.value.primary100
    variables['cc-primary-hover'] = themeColors.value.primary200
    variables['cc-primary-active'] = themeColors.value.primary300
    variables['cc-primary-light'] = themeColors.value.primary100 // 使用primary100作为light
    variables['cc-primary-dark'] = themeColors.value.primary300 // 使用primary300作为dark

    // 强调色
    variables['cc-accent'] = themeColors.value.accent100
    variables['cc-accent-hover'] = themeColors.value.accent200
    variables['cc-accent-active'] = themeColors.value.accent200 // 使用accent200作为active

    // 文本颜色
    variables['cc-text-primary'] = themeColors.value.text100
    variables['cc-text-secondary'] = themeColors.value.text200
    variables['cc-text-tertiary'] = themeColors.value.text200 // 使用text200作为tertiary
    variables['cc-text-disabled'] = themeColors.value.text200 // 使用text200作为disabled

    // 背景颜色
    variables['cc-bg-primary'] = themeColors.value.bg100
    variables['cc-bg-secondary'] = themeColors.value.bg200
    variables['cc-bg-tertiary'] = themeColors.value.bg300
    variables['cc-bg-elevated'] = themeColors.value.bg100 // 使用bg100作为elevated

    // 边框颜色
    variables['cc-border-light'] = borderConfig.value.light
    variables['cc-border-medium'] = borderConfig.value.medium
    variables['cc-border-heavy'] = borderConfig.value.heavy
    variables['cc-border-focus'] = borderConfig.value.focus

    return variables
  }

  // 生成功能色CSS变量
  const generateFunctionalColorVariables = () => {
    const variables: Record<string, string> = {}

    // 成功色
    variables['cc-success'] = functionalPalettes.value.success['500']
    variables['cc-success-light'] = functionalPalettes.value.success['100']
    variables['cc-success-dark'] = functionalPalettes.value.success['700']
    variables['cc-success-bg'] = functionalPalettes.value.success['50']

    // 警告色
    variables['cc-warning'] = functionalPalettes.value.warning['500']
    variables['cc-warning-light'] = functionalPalettes.value.warning['100']
    variables['cc-warning-dark'] = functionalPalettes.value.warning['700']
    variables['cc-warning-bg'] = functionalPalettes.value.warning['50']

    // 错误色
    variables['cc-error'] = functionalPalettes.value.error['500']
    variables['cc-error-light'] = functionalPalettes.value.error['100']
    variables['cc-error-dark'] = functionalPalettes.value.error['700']
    variables['cc-error-bg'] = functionalPalettes.value.error['50']

    // 信息色
    variables['cc-info'] = functionalPalettes.value.info['500']
    variables['cc-info-light'] = functionalPalettes.value.info['100']
    variables['cc-info-dark'] = functionalPalettes.value.info['700']
    variables['cc-info-bg'] = functionalPalettes.value.info['50']

    return variables
  }

  // 生成设计系统CSS变量
  const generateDesignSystemVariables = () => {
    const variables: Record<string, string> = {}

    // 阴影
    variables['cc-shadow-light'] = shadowConfig.value.light
    variables['cc-shadow-medium'] = shadowConfig.value.medium
    variables['cc-shadow-heavy'] = shadowConfig.value.heavy

    // 间距
    variables['cc-spacing-xs'] = spacingConfig.value.xs
    variables['cc-spacing-sm'] = spacingConfig.value.sm
    variables['cc-spacing-md'] = spacingConfig.value.md
    variables['cc-spacing-lg'] = spacingConfig.value.lg
    variables['cc-spacing-xl'] = spacingConfig.value.xl
    variables['cc-spacing-xxl'] = spacingConfig.value.xxl

    // 圆角
    variables['cc-radius-none'] = borderRadiusConfig.value.none
    variables['cc-radius-sm'] = borderRadiusConfig.value.sm
    variables['cc-radius-md'] = borderRadiusConfig.value.md
    variables['cc-radius-lg'] = borderRadiusConfig.value.lg
    variables['cc-radius-xl'] = borderRadiusConfig.value.xl
    variables['cc-radius-full'] = borderRadiusConfig.value.full

    // 字体
    variables['cc-font-family-sans'] = typographyConfig.value.fontFamily.sans
    variables['cc-font-family-mono'] = typographyConfig.value.fontFamily.mono

    // 字体大小
    variables['cc-font-size-xs'] = typographyConfig.value.fontSize.xs
    variables['cc-font-size-sm'] = typographyConfig.value.fontSize.sm
    variables['cc-font-size-md'] = typographyConfig.value.fontSize.md
    variables['cc-font-size-lg'] = typographyConfig.value.fontSize.lg
    variables['cc-font-size-xl'] = typographyConfig.value.fontSize.xl
    variables['cc-font-size-xl2'] = typographyConfig.value.fontSize.xl2
    variables['cc-font-size-xl3'] = typographyConfig.value.fontSize.xl3
    variables['cc-font-size-xl4'] = typographyConfig.value.fontSize.xl4

    // 字体粗细
    variables['cc-font-weight-normal'] = typographyConfig.value.fontWeight.normal
    variables['cc-font-weight-medium'] = typographyConfig.value.fontWeight.medium
    variables['cc-font-weight-semibold'] = typographyConfig.value.fontWeight.semibold
    variables['cc-font-weight-bold'] = typographyConfig.value.fontWeight.bold

    // 动画
    variables['cc-animation-duration-fast'] = animationConfig.value.duration.fast
    variables['cc-animation-duration-normal'] = animationConfig.value.duration.normal
    variables['cc-animation-duration-slow'] = animationConfig.value.duration.slow

    variables['cc-animation-easing-ease'] = animationConfig.value.easing.ease
    variables['cc-animation-easing-ease-in'] = animationConfig.value.easing.easeIn
    variables['cc-animation-easing-ease-out'] = animationConfig.value.easing.easeOut
    variables['cc-animation-easing-ease-in-out'] = animationConfig.value.easing.easeInOut

    // 断点
    variables['cc-breakpoint-xs'] = breakpointConfig.value.xs
    variables['cc-breakpoint-sm'] = breakpointConfig.value.sm
    variables['cc-breakpoint-md'] = breakpointConfig.value.md
    variables['cc-breakpoint-lg'] = breakpointConfig.value.lg
    variables['cc-breakpoint-xl'] = breakpointConfig.value.xl
    variables['cc-breakpoint-xl2'] = breakpointConfig.value.xl2

    return variables
  }

  // 生成完整的CSS变量
  const generateCssVariables = () => {
    return {
      ...generateBaseColorVariables(),
      ...generateFunctionalColorVariables(),
      ...generateDesignSystemVariables(),
    }
  }

  // 应用CSS变量到文档
  const applyCssVariables = () => {
    const variables = generateCssVariables()
    setCssVariables(variables)
  }

  // 应用特定类别的CSS变量
  const applyColorVariables = () => {
    const variables = {
      ...generateBaseColorVariables(),
      ...generateFunctionalColorVariables(),
    }
    setCssVariables(variables)
  }

  const applyDesignSystemVariables = () => {
    const variables = generateDesignSystemVariables()
    setCssVariables(variables)
  }

  // 清除所有CSS变量
  const clearCssVariables = () => {
    const variables = generateCssVariables()
    Object.keys(variables).forEach(name => {
      removeCssVariable(name)
    })
  }

  // 获取所有CSS变量
  const getAllCssVariables = () => {
    const variables = generateCssVariables()
    const result: Record<string, string> = {}

    Object.keys(variables).forEach(name => {
      const value = getCssVariable(name)
      if (value) {
        result[name] = value
      }
    })

    return result
  }

  // 监听主题变化并自动更新CSS变量
  const watchAndUpdateVariables = () => {
    watch(
      [themeColors, isDark],
      () => {
        applyCssVariables()
      },
      { immediate: true }
    )
  }

  // 导出CSS变量为CSS字符串
  const exportCssVariables = (selector = ':root') => {
    const variables = generateCssVariables()
    const cssLines = Object.entries(variables).map(([name, value]) => {
      return `  --${name}: ${value};`
    })

    return `${selector} {\n${cssLines.join('\n')}\n}`
  }

  // 导入CSS变量
  const importCssVariables = (cssString: string) => {
    try {
      // 简单的CSS解析，提取变量
      const variableRegex = /--([^:]+):\s*([^;]+);/g
      const variables: Record<string, string> = {}
      let match

      while ((match = variableRegex.exec(cssString)) !== null) {
        const [, name, value] = match
        variables[name.trim()] = value.trim()
      }

      setCssVariables(variables)
      return true
    } catch (error) {
      console.error('导入CSS变量失败:', error)
      return false
    }
  }

  return {
    // 基础操作
    getCssVariable,
    setCssVariable,
    setCssVariables,
    removeCssVariable,
    hasCssVariable,

    // 生成变量
    generateBaseColorVariables,
    generateFunctionalColorVariables,
    generateDesignSystemVariables,
    generateCssVariables,

    // 应用变量
    applyCssVariables,
    applyColorVariables,
    applyDesignSystemVariables,

    // 管理变量
    clearCssVariables,
    getAllCssVariables,
    watchAndUpdateVariables,

    // 导入导出
    exportCssVariables,
    importCssVariables,
  }
}
