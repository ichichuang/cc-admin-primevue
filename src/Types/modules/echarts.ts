/**
 * ECharts 主题配置类型定义
 */

import type { ComputedRef } from 'vue'
// ECharts 主题配置接口
export interface EChartsThemeConfig {
  // 颜色配置
  colors: {
    primary: string
    secondary: string
    success: string
    warning: string
    danger: string
    info: string
    help: string
    contrast: string
    text: {
      primary: string
      secondary: string
      disabled: string
    }
    background: {
      primary: string
      secondary: string
      card: string
    }
    border: string
  }

  // 尺寸配置
  sizes: {
    height: string
    width: string
  }

  // 字体配置
  fonts: {
    fontSize: number
    fontSizeSmall: number
    fontSizeLarge: number
  }

  // 间距配置
  spacing: {
    padding: number
    gap: number
  }

  // 模式
  mode: 'light' | 'dark'
}

// ECharts 主题选项接口
export interface EChartsThemeOptions {
  // 基础颜色配置
  color: string[]

  // 背景色
  backgroundColor: string

  // 文字样式
  textStyle: {
    color: string
    fontSize: number
    fontFamily: string
  }

  // 标题样式
  title: {
    textStyle: {
      color: string
      fontSize: number
    }
    subtextStyle: {
      color: string
      fontSize: number
    }
  }

  // 图例样式
  legend: {
    textStyle: {
      color: string
      fontSize: number
    }
  }

  // 坐标轴样式
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: string
      }
    }
    axisTick: {
      lineStyle: {
        color: string
      }
    }
    axisLabel: {
      color: string
      fontSize: number
    }
    splitLine: {
      lineStyle: {
        color: string
      }
    }
  }

  valueAxis: {
    axisLine: {
      lineStyle: {
        color: string
      }
    }
    axisTick: {
      lineStyle: {
        color: string
      }
    }
    axisLabel: {
      color: string
      fontSize: number
    }
    splitLine: {
      lineStyle: {
        color: string
      }
    }
  }

  // 提示框样式
  tooltip: {
    backgroundColor: string
    borderColor: string
    textStyle: {
      color: string
      fontSize: number
    }
  }

  // 数据区域缩放组件
  dataZoom: {
    backgroundColor: string
    borderColor: string
    fillerColor: string
    handleColor: string
    textStyle: {
      color: string
    }
  }

  // 网格样式
  grid: {
    left: string
    right: string
    bottom: string
    top: string
    containLabel: boolean
  }
}

// 图表尺寸配置接口
export interface ChartSizeConfig {
  width: string
  height: string
}

// 图表主题 Hook 返回类型
export interface UseChartThemeReturn {
  chartTheme: ComputedRef<EChartsThemeOptions>
  sizeConfig: ComputedRef<ChartSizeConfig>
  themeConfig: ComputedRef<EChartsThemeConfig | null>
}

// 图表 Hook 返回类型
export interface UseChartReturn {
  setOptions: (options: any, ...events: any[]) => void
  getInstance: () => any
  resize: () => void
  dispose: () => void
  sizeConfig: ComputedRef<ChartSizeConfig>
  themeConfig: ComputedRef<EChartsThemeConfig | null>
}
