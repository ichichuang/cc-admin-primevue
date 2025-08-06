/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 颜色工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import type { ThemeColors } from '@/constants'

/**
 * 颜色映射配置类型
 */
export interface ColorMappingConfig {
  [key: string]: string
}

/**
 * 标准颜色色阶
 */
export const STANDARD_COLOR_SHADES = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const

/**
 * 生成颜色调色板
 * @param themeColors 主题颜色配置
 * @param customMapping 自定义颜色映射
 * @returns 生成的调色板
 */
export function generateColorPalette(
  themeColors: ThemeColors,
  customMapping?: ColorMappingConfig
): Record<string, string> {
  const palette: Record<string, string> = {}

  // 默认颜色映射
  const defaultMapping: ColorMappingConfig = {
    '50': 'bg200',
    '100': 'bg200',
    '200': 'bg300',
    '300': 'primary200',
    '400': 'primary200',
    '500': 'primary100',
    '600': 'primary100',
    '700': 'primary100',
    '800': 'primary100',
    '900': 'primary100',
    '950': 'primary100',
  }

  // 合并自定义映射
  const finalMapping = { ...defaultMapping, ...customMapping }

  // 生成调色板
  STANDARD_COLOR_SHADES.forEach(shade => {
    const colorKey = finalMapping[shade]
    if (colorKey && themeColors[colorKey as keyof ThemeColors]) {
      palette[shade] = themeColors[colorKey as keyof ThemeColors] as string
    } else {
      // 默认回退到主色
      palette[shade] = themeColors.primary100
    }
  })

  return palette
}

/**
 * 创建颜色映射配置
 * @param mapping 映射配置
 * @returns 颜色映射配置
 */
export function createColorMapping(mapping: ColorMappingConfig): ColorMappingConfig {
  return mapping
}

/**
 * 验证主题颜色
 * @param themeColors 主题颜色配置
 * @returns 验证结果
 */
export function validateThemeColors(themeColors: ThemeColors): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // 检查必需的颜色属性
  const requiredColors = ['primary100', 'primary200', 'primary300', 'bg100', 'bg200', 'bg300']
  requiredColors.forEach(colorKey => {
    if (!themeColors[colorKey as keyof ThemeColors]) {
      errors.push(`缺少必需的颜色: ${colorKey}`)
    }
  })

  // 检查颜色格式
  Object.entries(themeColors).forEach(([key, value]) => {
    if (typeof value === 'string' && !value.match(/^#[0-9A-Fa-f]{6}$/)) {
      warnings.push(`颜色格式可能不正确: ${key} = ${value}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * 生成表面色调色板
 * @param themeColors 主题颜色配置
 * @param isDark 是否为暗色模式
 * @returns 表面色调色板
 */
export function generateSurfacePalette(
  themeColors: ThemeColors,
  isDark: boolean
): Record<string, string> {
  const surfaceMapping: ColorMappingConfig = isDark
    ? {
        '0': 'bg100',
        '50': 'bg300',
        '100': 'bg200',
        '200': 'bg300',
        '300': 'bg300',
        '400': 'bg300',
        '500': 'bg300',
        '600': 'bg200',
        '700': 'bg200',
        '800': 'bg200',
        '900': 'bg100',
        '950': 'bg100',
      }
    : {
        '0': 'bg100',
        '50': 'bg100',
        '100': 'bg200',
        '200': 'bg200',
        '300': 'bg300',
        '400': 'bg300',
        '500': 'bg300',
        '600': 'bg300',
        '700': 'bg300',
        '800': 'bg300',
        '900': 'bg300',
        '950': 'bg300',
      }

  return generateColorPalette(themeColors, surfaceMapping)
}

/**
 * 生成主色调色板
 * @param themeColors 主题颜色配置
 * @param isDark 是否为暗色模式
 * @returns 主色调色板
 */
export function generatePrimaryPalette(
  themeColors: ThemeColors,
  isDark: boolean
): Record<string, string> {
  const primaryMapping: ColorMappingConfig = {
    '50': isDark ? 'bg300' : 'bg200',
    '100': isDark ? 'bg200' : 'bg200',
    '200': isDark ? 'bg300' : 'bg300',
    '300': 'primary200',
    '400': 'primary200',
    '500': 'primary100',
    '600': 'primary100',
    '700': 'primary100',
    '800': 'primary100',
    '900': 'primary100',
    '950': 'primary100',
  }

  return generateColorPalette(themeColors, primaryMapping)
}

/**
 * 生成功能色调色板
 * @param themeColors 主题颜色配置
 * @param colorType 颜色类型 (primary, secondary, success, info, warn, help, danger, contrast)
 * @returns 功能色调色板
 */
export function generateFunctionalPalette(
  themeColors: ThemeColors,
  colorType: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast'
): Record<string, string> {
  const functionalColors = themeColors.functionalColors[colorType]

  return {
    '50': functionalColors.color,
    '100': functionalColors.color,
    '200': functionalColors.color,
    '300': functionalColors.color,
    '400': functionalColors.color,
    '500': functionalColors.color,
    '600': functionalColors.hover,
    '700': functionalColors.active,
    '800': functionalColors.active,
    '900': functionalColors.active,
    '950': functionalColors.disabled,
  }
}

/**
 * 生成对比色
 * @param themeColors 主题颜色配置
 * @param isDark 是否为暗色模式
 * @returns 对比色
 */
export function generateContrastColor(themeColors: ThemeColors, isDark: boolean): string {
  return isDark ? themeColors.text100 : themeColors.text100
}

/**
 * 生成完整的主题调色板
 * @param themeColors 主题颜色配置
 * @param isDark 是否为暗色模式
 * @returns 完整的主题调色板
 */
export function generateCompletePalette(themeColors: ThemeColors, isDark: boolean) {
  return {
    primary: generatePrimaryPalette(themeColors, isDark),
    surface: generateSurfacePalette(themeColors, isDark),
    functional: {
      primary: generateFunctionalPalette(themeColors, 'primary'),
      secondary: generateFunctionalPalette(themeColors, 'secondary'),
      success: generateFunctionalPalette(themeColors, 'success'),
      info: generateFunctionalPalette(themeColors, 'info'),
      warn: generateFunctionalPalette(themeColors, 'warn'),
      help: generateFunctionalPalette(themeColors, 'help'),
      danger: generateFunctionalPalette(themeColors, 'danger'),
      contrast: generateFunctionalPalette(themeColors, 'contrast'),
    },
    contrast: generateContrastColor(themeColors, isDark),
  }
}
