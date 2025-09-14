/**
 * ECharts 主题 Hook
 * 基于框架的颜色和尺寸变量生成 ECharts 主题配置
 */

import { useColorStore, useSizeStore } from '@/stores'
import type {
  ChartSizeConfig,
  EChartsThemeConfig,
  EChartsThemeOptions,
  UseChartThemeReturn,
} from '@/types/modules/echarts'
import { computed } from 'vue'

/**
 * 获取框架主题变量
 */
export function useFrameworkTheme() {
  const colorStore = useColorStore()
  const sizeStore = useSizeStore()

  const themeConfig = computed<EChartsThemeConfig>(() => {
    // 强制响应式依赖，确保主题和尺寸变化时重新计算
    const _isDark = colorStore.isDark
    const _mode = colorStore.getMode
    const _size = sizeStore.getSize
    const _fontSize = sizeStore.getFontSize
    const _padding = sizeStore.getPadding

    return {
      colors: {
        primary: colorStore.getPrimaryColor,
        secondary: colorStore.getSecondaryColor,
        success: colorStore.getSuccessColor,
        warning: colorStore.getWarnColor,
        danger: colorStore.getDangerColor,
        info: colorStore.getInfoColor,
        help: colorStore.getHelpColor,
        contrast: colorStore.getContrastColor,
        text: {
          primary: colorStore.getText100,
          secondary: colorStore.getText200,
          disabled: colorStore.getPrimaryColorDisabled,
        },
        background: {
          primary: colorStore.getBg100,
          secondary: colorStore.getBg200,
          card: colorStore.getBg100,
        },
        border: colorStore.getBg300,
      },
      sizes: {
        height: '400px',
        width: 'auto',
      },
      fonts: {
        fontSize: sizeStore.getFontSizeValue,
        fontSizeSmall: sizeStore.getFontSizesValue,
        fontSizeLarge: sizeStore.getFontSizexValue,
      },
      spacing: {
        padding: sizeStore.getPaddingValue,
        gap: sizeStore.getGap,
      },
      mode: colorStore.isDark ? 'dark' : 'light',
    }
  })

  return {
    themeConfig,
  }
}

/**
 * 颜色调整工具函数
 */
function adjustColor(color: string, amount: number, alpha: number = 1): string {
  try {
    // 移除 # 号
    const hex = color.replace('#', '')

    // 转换为 RGB
    const num = parseInt(hex, 16)
    const r = Math.max(0, Math.min(255, (num >> 16) + amount))
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount))
    const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount))

    if (alpha < 1) {
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  } catch (error) {
    console.warn('颜色调整失败，使用原色:', error)
    return color
  }
}

/**
 * 获取字体大小
 */
function getFontSize(fontSize: number): number {
  return fontSize || 14
}

/**
 * ECharts 主题生成器
 */
export function useChartTheme(): UseChartThemeReturn {
  const { themeConfig } = useFrameworkTheme()

  // 生成 ECharts 主题配置
  const chartTheme = computed<EChartsThemeOptions>(() => {
    const config = themeConfig.value
    return {
      // 基础颜色配置
      color: [
        config.colors.primary,
        config.colors.success,
        config.colors.warning,
        config.colors.danger,
        config.colors.info,
        config.colors.help,
        config.colors.secondary,
        // 扩展调色板
        adjustColor(config.colors.primary, 20),
        adjustColor(config.colors.success, 20),
        adjustColor(config.colors.warning, 20),
        adjustColor(config.colors.danger, 20),
        adjustColor(config.colors.info, 20),
        adjustColor(config.colors.help, 20),
        adjustColor(config.colors.secondary, 20),
      ],

      // 背景色
      backgroundColor: config.colors.background.primary,

      // 文字样式
      textStyle: {
        color: config.colors.text.primary,
        fontSize: getFontSize(config.fonts.fontSize),
        fontFamily: '',
      },

      // 标题样式
      title: {
        textStyle: {
          color: config.colors.text.primary,
          fontSize: getFontSize(config.fonts.fontSize) + 4,
        },
        subtextStyle: {
          color: config.colors.text.secondary,
          fontSize: getFontSize(config.fonts.fontSizeSmall),
        },
      },

      // 图例样式
      legend: {
        textStyle: {
          color: config.colors.text.primary,
          fontSize: getFontSize(config.fonts.fontSize),
        },
      },

      // 坐标轴样式
      categoryAxis: {
        axisLine: {
          lineStyle: {
            color: config.colors.border,
          },
        },
        axisTick: {
          lineStyle: {
            color: config.colors.border,
          },
        },
        axisLabel: {
          color: config.colors.text.secondary,
          fontSize: getFontSize(config.fonts.fontSizeSmall),
        },
        splitLine: {
          lineStyle: {
            color: config.mode === 'dark' ? config.colors.border : config.colors.border,
          },
        },
      },

      valueAxis: {
        axisLine: {
          lineStyle: {
            color: config.colors.border,
          },
        },
        axisTick: {
          lineStyle: {
            color: config.colors.border,
          },
        },
        axisLabel: {
          color: config.colors.text.secondary,
          fontSize: getFontSize(config.fonts.fontSizeSmall),
        },
        splitLine: {
          lineStyle: {
            color: config.mode === 'dark' ? config.colors.border : config.colors.border,
          },
        },
      },

      // 提示框样式
      tooltip: {
        backgroundColor: config.colors.background.card,
        borderColor: config.colors.border,
        textStyle: {
          color: config.colors.text.primary,
          fontSize: getFontSize(config.fonts.fontSize),
        },
      },

      // 数据区域缩放组件
      dataZoom: {
        show: false,
        backgroundColor: config.colors.background.secondary,
        borderColor: config.colors.border,
        fillerColor: adjustColor(config.colors.primary, -20, 0.3),
        handleColor: config.colors.primary,
        textStyle: {
          color: config.colors.text.primary,
        },
      },

      // 网格样式
      grid: {
        left: '6%',
        right: '6%',
        bottom: '16%',
        top: '24%',
        containLabel: true,
      },
    }
  })

  // 获取尺寸相关的配置
  const sizeConfig = computed<ChartSizeConfig>(() => {
    const config = themeConfig.value
    return {
      width: config.sizes.width,
      height: config.sizes.height,
    }
  })

  return {
    chartTheme,
    sizeConfig,
    themeConfig,
  }
}
