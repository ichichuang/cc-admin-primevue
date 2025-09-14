<script setup lang="ts">
import { useElementSize } from '@/hooks'
import { useChartTheme } from '@/hooks/modules/useChartTheme'
import { useECharts } from '@pureadmin/utils'
import type { EChartsOption } from 'echarts'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Props {
  options?: EChartsOption
  autoResize?: boolean
  renderer?: 'canvas' | 'svg'
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({}),
  autoResize: true,
  renderer: 'canvas',
})

// 图表容器引用
const chartRef = ref<HTMLDivElement>()
const containerRef = ref<HTMLElement | null>(null)

// 获取响应式主题配置
const { chartTheme, sizeConfig } = useChartTheme()

// 创建响应式主题，利用 useECharts 的 theme 参数响应式特性
const reactiveTheme = computed(() => {
  const theme = chartTheme.value
  return {
    // 基础颜色配置
    color: theme.color,
    backgroundColor: theme.backgroundColor,
    textStyle: theme.textStyle,

    // 标题样式
    title: theme.title,

    // 图例样式
    legend: theme.legend,

    // 坐标轴样式
    categoryAxis: theme.categoryAxis,
    valueAxis: theme.valueAxis,

    // 提示框样式
    tooltip: theme.tooltip,

    // 数据区域缩放组件样式
    dataZoom: theme.dataZoom,

    // 网格样式
    grid: theme.grid,
  }
})

// 初始化 ECharts，使用响应式主题
const echartsInstance = useECharts(chartRef as any, {
  theme: computed(() => 'default'), // 使用默认主题，通过 setOptions 动态应用自定义主题
  renderer: props.renderer,
})

// 增强的 setOptions 方法，自动合并主题配置（仅用于初始化）
const setAppOptions = (options: EChartsOption, _clear = true) => {
  const theme = reactiveTheme.value

  // 基础主题配置
  const baseOptions: EChartsOption = {
    backgroundColor: theme.backgroundColor,
    textStyle: theme.textStyle,
    color: theme.color,

    // 默认网格配置
    grid: theme.grid,

    // 默认标题样式
    title: theme.title,

    // 默认图例样式
    legend: theme.legend,

    // 默认坐标轴样式
    xAxis: theme.categoryAxis,
    yAxis: theme.valueAxis,

    // 默认提示框样式
    tooltip: theme.tooltip,

    // 默认数据区域缩放组件样式
    dataZoom: theme.dataZoom,
  }

  // 深度合并用户选项和主题配置
  const mergedOptions = {
    ...baseOptions,
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

    // 合并网格样式
    grid: options.grid
      ? {
          ...theme.grid,
          ...options.grid,
        }
      : theme.grid,
  }

  // 调用原始的 setOptions 方法
  echartsInstance.setOptions(mergedOptions)
}

// 更新数据的方法（保持动画效果）
const updateData = (seriesData: any[], smooth = true) => {
  const instance = echartsInstance.getInstance()
  if (!instance) {
    return
  }

  if (smooth) {
    // 使用平滑更新，保持动画效果
    instance.setOption(
      {
        series: seriesData,
      },
      false, // notMerge = false，进行合并而不是替换
      true // lazyUpdate = true，延迟更新以获得更好的性能
    )
  } else {
    // 直接更新数据
    instance.setOption({
      series: seriesData,
    })
  }
}

// 更新 X 轴数据
const updateXAxisData = (data: any[], smooth = true) => {
  const instance = echartsInstance.getInstance()
  if (!instance) {
    return
  }

  instance.setOption(
    {
      xAxis: {
        data: data,
      },
    },
    false, // notMerge = false
    smooth // lazyUpdate
  )
}

// 更新完整选项（会重绘，谨慎使用）
const updateOptions = (options: EChartsOption, notMerge = false) => {
  const instance = echartsInstance.getInstance()
  if (!instance) {
    return
  }

  instance.setOption(options, notMerge)
}

// 执行动作（如 dataZoom）
const dispatchAction = (payload: any) => {
  const instance = echartsInstance.getInstance()
  if (!instance) {
    return
  }

  instance.dispatchAction(payload)
}

// 监听主题变化，强制重新应用主题
watch(
  reactiveTheme,
  () => {
    if (echartsInstance.getInstance() && props.options) {
      // 主题变化时，重新应用合并后的选项
      setAppOptions(props.options)
    }
  },
  { deep: true }
)

// 监听尺寸变化
watch(
  sizeConfig,
  () => {
    if (props.autoResize && echartsInstance.getInstance()) {
      setTimeout(() => {
        echartsInstance.resize()
      }, 100)
    }
  },
  { deep: true }
)
useElementSize(
  containerRef,
  () => {
    echartsInstance.resize()
  },
  { mode: 'debounce', delay: 100 }
)

// 监听数据源变化 - 仅在初始化时使用
watch(
  () => props.options,
  options => {
    if (options && echartsInstance.getInstance()) {
      // 初始化时才使用 setAppOptions
      // 后续数据更新应该使用 updateData 等方法
    }
  },
  {
    deep: true,
    immediate: false, // 改为 false，避免重复初始化
  }
)

onMounted(() => {
  if (props.options && echartsInstance.getInstance()) {
    setAppOptions(props.options)
  }
})

// 组件卸载时清理
onBeforeUnmount(() => {
  const instance = echartsInstance.getInstance()
  if (instance) {
    instance.dispose()
  }
})

// 暴露方法给父组件
defineExpose({
  instance: echartsInstance,
  getInstance: () => echartsInstance.getInstance(),
  setOptions: echartsInstance.setOptions,
  setAppOptions, // 主题合并的初始化方法
  updateData, // 平滑更新数据
  updateXAxisData, // 更新 X 轴数据
  updateOptions, // 更新完整选项
  dispatchAction, // 执行动作
  resize: echartsInstance.resize,
  dispose: () => {
    const instance = echartsInstance.getInstance()
    if (instance) {
      instance.dispose()
    }
  },
  chartTheme,
  sizeConfig,
})
</script>

<template lang="pug">
.full(ref='containerRef')
  .chart.full(ref='chartRef')
</template>
