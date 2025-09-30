<script setup lang="ts">
import { useElementSize } from '@/hooks'
import { useChartTheme } from '@/hooks/modules/useChartTheme'
import { useECharts } from '@pureadmin/utils'
import type { EChartsOption } from 'echarts'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// 事件类型定义
type ElementEventName =
  | 'click'
  | 'dblclick'
  | 'mousewheel'
  | 'mouseout'
  | 'mouseover'
  | 'mouseup'
  | 'mousedown'
  | 'mousemove'
  | 'contextmenu'
  | 'drag'
  | 'dragstart'
  | 'dragend'
  | 'dragenter'
  | 'dragleave'
  | 'dragover'
  | 'drop'
  | 'globalout'
  | 'selectchanged'
  | 'highlight'
  | 'downplay'
  | 'legendselectchanged'
  | 'legendselected'
  | 'legendunselected'
  | 'legendselectall'
  | 'legendinverseselect'
  | 'legendscroll'
  | 'datazoom'
  | 'datarangeselected'
  | 'graphroam'
  | 'georoam'
  | 'treeroam'
  | 'timelinechanged'
  | 'timelineplaychanged'
  | 'restore'
  | 'dataviewchanged'
  | 'magictypechanged'
  | 'geoselectchanged'
  | 'geoselected'
  | 'geounselected'
  | 'axisareaselected'
  | 'brush'
  | 'brushEnd'
  | 'brushselected'
  | 'globalcursortaken'
  | 'rendered'
  | 'finished'

type ElementEventType = 'echarts' | 'zrender'

// 事件参数接口 - 使用 ECharts 原生类型
interface EventParams {
  componentIndex?: number
  componentType: string
  seriesType: string
  seriesIndex: number
  seriesName: string
  name: string
  dataIndex: number
  data: object
  dataType: string
  event?: any
  type?: string
  targetType?: string
  value: string | number | Array<string | number>
  color: string
}

// 事件配置接口
interface EventConfig {
  name: ElementEventName
  callback: (params: any) => void
  type?: ElementEventType
  query?: string | object
}

interface Props {
  options?: EChartsOption
  autoResize?: boolean
  renderer?: 'canvas' | 'svg'
  events?: EventConfig[]
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({}),
  autoResize: true,
  renderer: 'canvas',
  events: () => [],
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

// 事件处理函数
const addEventListeners = (events: EventConfig[]) => {
  const instance = echartsInstance.getInstance()
  if (!instance || !events.length) {
    return
  }

  events.forEach(event => {
    const { name, callback, type = 'echarts', query } = event

    if (type === 'zrender') {
      // zrender 事件
      instance.getZr().on(name, callback as any)
    } else {
      // echarts 事件
      if (query) {
        instance.on(name, query, callback as any)
      } else {
        instance.on(name, callback as any)
      }
    }
  })
}

// 移除事件监听器
const removeEventListeners = (events: EventConfig[]) => {
  const instance = echartsInstance.getInstance()
  if (!instance || !events.length) {
    return
  }

  events.forEach(event => {
    const { name, callback, type = 'echarts' } = event

    if (type === 'zrender') {
      // zrender 事件
      instance.getZr().off(name, callback as any)
    } else {
      // echarts 事件
      instance.off(name, callback as any)
    }
  })
}

/**
 * 深度合并坐标轴配置
 */
const mergeAxisConfig = (userAxis: any, themeAxis: any): any => {
  if (!userAxis) {
    return themeAxis
  }

  if (Array.isArray(userAxis)) {
    return userAxis.map(axis => ({
      ...themeAxis,
      ...axis,
      axisLabel: {
        ...themeAxis?.axisLabel,
        ...axis?.axisLabel,
      },
      axisLine: {
        ...themeAxis?.axisLine,
        ...axis?.axisLine,
        lineStyle: {
          ...themeAxis?.axisLine?.lineStyle,
          ...axis?.axisLine?.lineStyle,
        },
      },
      axisTick: {
        ...themeAxis?.axisTick,
        ...axis?.axisTick,
        lineStyle: {
          ...themeAxis?.axisTick?.lineStyle,
          ...axis?.axisTick?.lineStyle,
        },
      },
      splitLine: {
        ...themeAxis?.splitLine,
        ...axis?.splitLine,
        lineStyle: {
          ...themeAxis?.splitLine?.lineStyle,
          ...axis?.splitLine?.lineStyle,
        },
      },
    }))
  } else {
    return {
      ...themeAxis,
      ...userAxis,
      axisLabel: {
        ...themeAxis?.axisLabel,
        ...userAxis?.axisLabel,
      },
      axisLine: {
        ...themeAxis?.axisLine,
        ...userAxis?.axisLine,
        lineStyle: {
          ...themeAxis?.axisLine?.lineStyle,
          ...userAxis?.axisLine?.lineStyle,
        },
      },
      axisTick: {
        ...themeAxis?.axisTick,
        ...userAxis?.axisTick,
        lineStyle: {
          ...themeAxis?.axisTick?.lineStyle,
          ...userAxis?.axisTick?.lineStyle,
        },
      },
      splitLine: {
        ...themeAxis?.splitLine,
        ...userAxis?.splitLine,
        lineStyle: {
          ...themeAxis?.splitLine?.lineStyle,
          ...userAxis?.splitLine?.lineStyle,
        },
      },
    }
  }
}

/**
 * 合并 dataZoom 配置
 */
const mergeDataZoomConfig = (userDataZoom: any, theme: any): any => {
  if (!userDataZoom) {
    return theme.dataZoom
  }

  if (Array.isArray(userDataZoom)) {
    return userDataZoom.map((dzItem, index) => {
      // 如果主题中有对应的数组配置，使用它；否则使用基础配置
      const themeItem = theme.dataZoomArray?.[index] || theme.dataZoom
      return {
        ...themeItem,
        ...dzItem,
        textStyle: {
          ...themeItem?.textStyle,
          ...dzItem?.textStyle,
        },
      }
    })
  } else {
    return {
      ...theme.dataZoom,
      ...userDataZoom,
      textStyle: {
        ...theme.dataZoom?.textStyle,
        ...userDataZoom?.textStyle,
      },
    }
  }
}

// 增强的 setOptions 方法，自动合并主题配置（仅用于初始化）
const setAppOptions = (options: EChartsOption, _clear = true, ...eventConfigs: EventConfig[]) => {
  const theme = reactiveTheme.value

  // 深度合并用户选项和主题配置
  const mergedOptions = {
    backgroundColor: theme.backgroundColor,
    textStyle: theme.textStyle,
    color: theme.color,
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

    // 使用新的坐标轴合并函数
    xAxis: mergeAxisConfig(options.xAxis, theme.categoryAxis),
    yAxis: mergeAxisConfig(options.yAxis, theme.valueAxis),

    // 合并提示框样式
    tooltip: options.tooltip
      ? {
          ...theme.tooltip,
          ...options.tooltip,
          textStyle: {
            ...theme.tooltip?.textStyle,
            ...(Array.isArray(options.tooltip) ? {} : options.tooltip?.textStyle),
          },
        }
      : theme.tooltip,

    // 使用新的 dataZoom 合并函数
    dataZoom: mergeDataZoomConfig(options.dataZoom, theme),

    // 合并 visualMap 样式
    visualMap: options.visualMap
      ? Array.isArray(options.visualMap)
        ? options.visualMap.map(vm => ({
            ...vm,
            textStyle: {
              color: theme.textStyle?.color,
              ...vm?.textStyle,
            },
          }))
        : {
            ...options.visualMap,
            textStyle: {
              color: theme.textStyle?.color,
              ...options.visualMap?.textStyle,
            },
          }
      : options.visualMap,

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

  // 添加事件监听器
  if (eventConfigs.length > 0) {
    addEventListeners(eventConfigs)
  }
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

// 监听事件配置变化
watch(
  () => props.events,
  (newEvents, oldEvents) => {
    const instance = echartsInstance.getInstance()
    if (!instance) {
      return
    }

    // 移除旧的事件监听器
    if (oldEvents && oldEvents.length > 0) {
      removeEventListeners(oldEvents)
    }

    // 添加新的事件监听器
    if (newEvents && newEvents.length > 0) {
      addEventListeners(newEvents)
    }
  },
  {
    deep: true,
  }
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

  // 初始化时添加事件监听器
  if (props.events && props.events.length > 0) {
    addEventListeners(props.events)
  }
})

// 组件卸载时清理
onBeforeUnmount(() => {
  const instance = echartsInstance.getInstance()
  if (instance) {
    // 移除所有事件监听器
    if (props.events && props.events.length > 0) {
      removeEventListeners(props.events)
    }
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
  // 事件相关方法
  addEventListeners, // 添加事件监听器
  removeEventListeners, // 移除事件监听器
  // 便捷的事件添加方法
  addEvent: (eventConfig: EventConfig) => {
    addEventListeners([eventConfig])
  },
  removeEvent: (eventConfig: EventConfig) => {
    removeEventListeners([eventConfig])
  },
  // 常用事件快捷方法
  onClick: (callback: (params: any) => void, query?: string | object) => {
    addEventListeners([{ name: 'click', callback, query }])
  },
  onDoubleClick: (callback: (params: any) => void, query?: string | object) => {
    addEventListeners([{ name: 'dblclick', callback, query }])
  },
  onRightClick: (callback: (params: any) => void, query?: string | object) => {
    addEventListeners([{ name: 'contextmenu', callback, query }])
  },
  onMouseOver: (callback: (params: any) => void, query?: string | object) => {
    addEventListeners([{ name: 'mouseover', callback, query }])
  },
  onMouseOut: (callback: (params: any) => void, query?: string | object) => {
    addEventListeners([{ name: 'mouseout', callback, query }])
  },
  onLegendSelectChanged: (callback: (params: any) => void) => {
    addEventListeners([{ name: 'legendselectchanged', callback }])
  },
  onDataZoom: (callback: (params: any) => void) => {
    addEventListeners([{ name: 'datazoom', callback }])
  },
  onRendered: (callback: (params: any) => void) => {
    addEventListeners([{ name: 'rendered', callback }])
  },
  // 点击空白处事件
  onBlankClick: (callback: (params: any) => void) => {
    const instance = echartsInstance.getInstance()
    if (instance) {
      instance.getZr().on('click', callback)
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
