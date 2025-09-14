/**
 * 统一的图表 Hook
 * 整合 ECharts 和主题系统，提供自动主题应用功能
 */

import type { UseChartReturn } from '@/types/modules/echarts'
import { useECharts } from '@pureadmin/utils'
import type { EChartsOption } from 'echarts'
import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { useChartTheme } from './useChartTheme'

/**
 * 合并图表选项和主题
 */
function mergeChartOptions(options: EChartsOption, theme: any): EChartsOption {
  return {
    backgroundColor: theme.backgroundColor,
    color: theme.color,
    textStyle: theme.textStyle,
    ...options,

    // 深度合并标题样式
    title: options.title
      ? {
          ...theme.title,
          ...options.title,
          textStyle: {
            ...theme.title?.textStyle,
            ...(Array.isArray(options.title) ? {} : options.title?.textStyle),
          },
          subtextStyle: {
            ...theme.title?.subtextStyle,
            ...(Array.isArray(options.title) ? {} : options.title?.subtextStyle),
          },
        }
      : theme.title,

    // 深度合并图例样式
    legend: options.legend
      ? {
          ...theme.legend,
          ...options.legend,
          textStyle: {
            ...theme.legend?.textStyle,
            ...(Array.isArray(options.legend) ? {} : options.legend?.textStyle),
          },
        }
      : theme.legend,

    // 合并坐标轴样式
    xAxis: Array.isArray(options.xAxis)
      ? options.xAxis.map(axis => ({ ...theme.categoryAxis, ...axis }))
      : options.xAxis
        ? { ...theme.categoryAxis, ...options.xAxis }
        : theme.categoryAxis,

    yAxis: Array.isArray(options.yAxis)
      ? options.yAxis.map(axis => ({ ...theme.valueAxis, ...axis }))
      : options.yAxis
        ? { ...theme.valueAxis, ...options.yAxis }
        : theme.valueAxis,

    // 合并提示框样式
    tooltip: options.tooltip
      ? {
          ...theme.tooltip,
          ...options.tooltip,
        }
      : theme.tooltip,

    // 合并数据区域缩放组件样式
    dataZoom: options.dataZoom
      ? {
          ...theme.dataZoom,
          ...options.dataZoom,
        }
      : theme.dataZoom,

    // 处理 series 颜色配置
    series: options.series,
  }
}

/**
 * 统一的图表 Hook
 * @param chartRef 图表容器引用
 * @param options 初始化选项
 * @returns 图表实例和相关方法
 */
export function useChart(
  chartRef: Ref<HTMLDivElement | undefined>,
  options: {
    theme?: any
    renderer?: 'canvas' | 'svg'
    autoResize?: boolean
  } = {}
): UseChartReturn {
  const { chartTheme, sizeConfig, themeConfig } = useChartTheme()

  // 初始化 ECharts
  const echartsInstance = useECharts(chartRef as any, {
    theme: options.theme || 'default', // 不使用自定义主题，通过 setOptions 应用
    renderer: options.renderer || 'canvas',
  })

  // 应用主题的 setOptions 方法
  const setOptionsWithTheme = (options: EChartsOption, ...events: any[]) => {
    const mergedOptions = mergeChartOptions(options, chartTheme.value)
    echartsInstance.setOptions(mergedOptions, ...events)
  }

  // 监听主题变化，自动更新图表
  watch(
    [chartTheme, sizeConfig],
    () => {
      if (echartsInstance.getInstance()) {
        // 重新应用主题
        const currentOption = echartsInstance.getOption()
        if (currentOption) {
          const mergedOptions = mergeChartOptions(currentOption as EChartsOption, chartTheme.value)
          echartsInstance.setOptions(mergedOptions) // 重新应用主题
        }

        // 调整尺寸
        if (options.autoResize !== false) {
          setTimeout(() => {
            echartsInstance.resize()
          }, 100)
        }
      }
    },
    { deep: true, immediate: false }
  )

  // 自动调整尺寸
  if (options.autoResize !== false) {
    const resizeObserver = ref<ResizeObserver | null>(null)

    onMounted(() => {
      if (chartRef.value) {
        resizeObserver.value = new ResizeObserver(() => {
          setTimeout(() => {
            echartsInstance.resize()
          }, 100)
        })
        resizeObserver.value.observe(chartRef.value)
      }
    })

    onBeforeUnmount(() => {
      if (resizeObserver.value) {
        resizeObserver.value.disconnect()
      }
    })
  }

  return {
    setOptions: setOptionsWithTheme,
    getInstance: echartsInstance.getInstance,
    resize: echartsInstance.resize,
    dispose: () => {
      // 清理图表实例
      const instance = echartsInstance.getInstance()
      if (instance) {
        instance.dispose()
      }
    },
    sizeConfig,
    themeConfig,
  }
}

/**
 * 创建响应式图表 Hook
 * 提供更高级的响应式功能
 */
export function useResponsiveChart(
  chartRef: Ref<HTMLDivElement | undefined>,
  options: {
    theme?: any
    renderer?: 'canvas' | 'svg'
    autoResize?: boolean
    responsive?: boolean
  } = {}
) {
  const chart = useChart(chartRef, options)
  const { sizeConfig, themeConfig } = useChartTheme()

  // 响应式尺寸配置
  const responsiveSizeConfig = computed(() => {
    if (!options.responsive) {
      return sizeConfig.value
    }

    const config = themeConfig.value
    if (!config) {
      return sizeConfig.value
    }

    // 直接使用配置中的尺寸
    return {
      width: config.sizes.width,
      height: config.sizes.height,
    }
  })

  return {
    ...chart,
    sizeConfig: responsiveSizeConfig,
  }
}
