<script setup lang="ts">
import { debounce, throttle } from '@/common'
import { INTERVAL, STRATEGY } from '@/constants/modules/layout'
import { useChartTheme, useElementSize } from '@/hooks'
import { computed, onMounted, ref, watch } from 'vue'
import VECharts from 'vue-echarts'
import { createDefaultUseEchartsProps } from './utils/constants'
import type { UseEchartsProps } from './utils/types'

const props = withDefaults(defineProps<UseEchartsProps>(), createDefaultUseEchartsProps())

const chartContainerRef = ref<HTMLElement | HTMLDivElement | null>(null)
const chartRef = ref()

// 根据全局策略创建 resize 处理器
const baseResize = () => {
  if (chartRef.value) {
    chartRef.value.resize()
  }
}

const resizeHandler =
  STRATEGY === 'debounce'
    ? debounce(baseResize, INTERVAL)
    : STRATEGY === 'throttle'
      ? throttle(baseResize, INTERVAL)
      : baseResize

// 监听容器尺寸变化，按策略触发图表自适应
useElementSize(
  chartContainerRef,
  () => {
    resizeHandler()
  },
  { mode: 'none', delay: INTERVAL }
)

// 使用主题合并后的配置
const mergedOption = computed(() => {
  if (!props.option || Object.keys(props.option).length === 0) {
    return {}
  }

  // 如果禁用了主题，直接返回原始配置
  if (props.themeConfig?.enableTheme === false) {
    return props.option
  }

  // 使用主题配置，传入透明度配置
  return useChartTheme(props.option, props.themeConfig?.opacity)
})

// 监听配置变化，手动更新图表
watch(
  () => mergedOption.value,
  newOption => {
    if (props.manualUpdate && chartRef.value) {
      chartRef.value.setOption(newOption, true)
    }
  },
  { deep: true }
)

// 事件处理器映射
const eventHandlers = {
  // 鼠标事件
  click: props.onClick,
  dblclick: props.onDblClick,
  mousedown: props.onMouseDown,
  mousemove: props.onMouseMove,
  mouseup: props.onMouseUp,
  mouseover: props.onMouseOver,
  mouseout: props.onMouseOut,
  globalout: props.onGlobalOut,
  contextmenu: props.onContextMenu,

  // 图例事件
  legendselectchanged: props.onLegendSelectChanged,
  legendselected: props.onLegendSelected,
  legendunselected: props.onLegendUnSelected,
  legendselectall: props.onLegendSelectAll,
  legendinverseselect: props.onLegendInverseSelect,
  legendscroll: props.onLegendScroll,

  // 数据区域缩放事件
  datazoom: props.onDataZoom,
  datarangeselected: props.onDataRangeSelected,

  // 时间轴事件
  timelinechanged: props.onTimelineChanged,
  timelineplaychanged: props.onTimelinePlayChanged,

  // 画刷事件
  brush: props.onBrush,
  brushend: props.onBrushEnd,
  brushselected: props.onBrushSelected,

  // 地图事件
  geoselectchanged: props.onGeoSelectChanged,
  geoselected: props.onGeoSelected,
  geounselected: props.onGeoUnSelected,
  georoam: props.onGeoRoam,

  // 图形元素事件
  selectchanged: props.onSelectChanged,
  highlight: props.onHighlight,
  downplay: props.onDownplay,

  // 动画事件
  finished: props.onFinished,
  rendered: props.onRendered,

  // 图表生命周期事件
  restore: props.onRestore,
  magictypechanged: props.onMagicTypeChanged,
  dataviewchanged: props.onDataViewChanged,

  // 坐标轴事件
  axisareaselected: props.onAxisAreaSelected,

  // 焦点/失焦事件
  focusnodeadjacency: props.onFocusNodeAdjacency,
  unfocusnodeadjacency: props.onUnfocusNodeAdjacency,
}

// 绑定事件监听器
const bindEventListeners = () => {
  if (!chartRef.value) {
    return
  }

  // 尝试多种方式获取 ECharts 实例
  let chartInstance = null

  // 方法1: 直接访问 (vue-echarts 5.x)
  if (chartRef.value && typeof chartRef.value.on === 'function') {
    chartInstance = chartRef.value
  }
  // 方法2: 通过 $refs.chart 访问
  else if (chartRef.value && chartRef.value.$refs && chartRef.value.$refs.chart) {
    chartInstance = chartRef.value.$refs.chart
  }
  // 方法3: 通过 chart 属性访问
  else if (chartRef.value && chartRef.value.chart) {
    chartInstance = chartRef.value.chart
  }
  // 方法4: 通过 getEchartsInstance 方法访问
  else if (chartRef.value && typeof chartRef.value.getEchartsInstance === 'function') {
    chartInstance = chartRef.value.getEchartsInstance()
  }

  if (!chartInstance || typeof chartInstance.on !== 'function') {
    return
  }

  // 绑定事件
  Object.entries(eventHandlers).forEach(([eventName, handler]) => {
    if (handler && typeof handler === 'function') {
      try {
        chartInstance.on(eventName, handler)
      } catch (error) {
        console.error(`[UseEcharts] Failed to bind event ${eventName}:`, error)
      }
    }
  })
}

// 解绑事件监听器
const unbindEventListeners = () => {
  if (!chartRef.value) {
    return
  }

  // 尝试多种方式获取 ECharts 实例
  let chartInstance = null

  // 方法1: 直接访问 (vue-echarts 5.x)
  if (chartRef.value && typeof chartRef.value.off === 'function') {
    chartInstance = chartRef.value
  }
  // 方法2: 通过 $refs.chart 访问
  else if (chartRef.value && chartRef.value.$refs && chartRef.value.$refs.chart) {
    chartInstance = chartRef.value.$refs.chart
  }
  // 方法3: 通过 chart 属性访问
  else if (chartRef.value && chartRef.value.chart) {
    chartInstance = chartRef.value.chart
  }
  // 方法4: 通过 getEchartsInstance 方法访问
  else if (chartRef.value && typeof chartRef.value.getEchartsInstance === 'function') {
    chartInstance = chartRef.value.getEchartsInstance()
  }

  if (!chartInstance || typeof chartInstance.off !== 'function') {
    return
  }

  Object.entries(eventHandlers).forEach(([eventName, handler]) => {
    if (handler && typeof handler === 'function') {
      try {
        chartInstance.off(eventName, handler)
      } catch (error) {
        console.error(`[UseEcharts] Failed to unbind event ${eventName}:`, error)
      }
    }
  })
}

// 组件挂载后绑定事件
onMounted(() => {
  // 延迟绑定事件，确保图表实例已创建
  setTimeout(() => {
    bindEventListeners()
  }, 300)
})

// 监听图表配置变化，重新绑定事件
watch(
  () => mergedOption.value,
  () => {
    // 当图表配置更新后，重新绑定事件
    setTimeout(() => {
      bindEventListeners()
    }, 100)
  },
  { deep: true, flush: 'post' }
)

// 监听事件处理器变化，重新绑定事件
watch(
  () => eventHandlers,
  () => {
    unbindEventListeners()
    setTimeout(() => {
      bindEventListeners()
    }, 100)
  },
  { deep: true }
)

// 暴露图表实例方法
const getChartInstance = () => chartRef.value

defineExpose({
  getChartInstance,
  setOption: (option: any, notMerge = false) => {
    if (chartRef.value) {
      chartRef.value.setOption(option, notMerge)
    }
  },
  resize: () => {
    if (chartRef.value) {
      chartRef.value.resize()
    }
  },
  clear: () => {
    if (chartRef.value) {
      chartRef.value.clear()
    }
  },
  dispose: () => {
    if (chartRef.value) {
      chartRef.value.dispose()
    }
  },
  bindEventListeners,
  unbindEventListeners,
})
</script>

<template lang="pug">
.full(ref='chartContainerRef')
  VECharts(
    ref='chartRef',
    :option='mergedOption',
    :style='{ width: width, height: height }',
    :theme='theme',
    :loading='loading',
    :loading-options='loadingOptions',
    :manual-update='manualUpdate'
  )
</template>
