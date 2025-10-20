<script setup lang="ts">
import { debounce, throttle } from '@/common'
import { INTERVAL, STRATEGY } from '@/constants/modules/layout'
import { useChartTheme, useElementSize } from '@/hooks'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import VECharts from 'vue-echarts'
import { createDefaultUseEchartsProps } from './utils/constants'
import type { ChartConnectState, UseEchartsProps } from './utils/types'

const props = withDefaults(defineProps<UseEchartsProps & { group?: string }>(), {
  ...createDefaultUseEchartsProps(),
  group: undefined,
})

const emit = defineEmits<{
  finished: []
  chartReady: [instance: any, id?: string]
}>()

const chartContainerRef = ref<HTMLElement | HTMLDivElement | null>(null)
const chartRef = ref()

// 联动相关状态
const connectState = ref<ChartConnectState>({})
const isConnectEnabled = computed(() => props.connectConfig?.enabled === true)
const connectGroupId = computed(() => {
  const groupId = props.group || props.connectConfig?.groupId || 'default'
  return groupId
})

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

// 监听容器尺寸变化,按策略触发图表自适应
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

  // 如果禁用了主题,直接返回原始配置
  if (props.themeConfig?.enableTheme === false) {
    return props.option
  }

  // 使用主题配置,传入透明度配置
  return useChartTheme(props.option, props.themeConfig?.opacity)
})

// 监听配置变化,手动更新图表
watch(
  () => mergedOption.value,
  newOption => {
    if (props.manualUpdate && chartRef.value) {
      chartRef.value.setOption(newOption, true)
    }
  },
  { deep: true }
)

// 事件处理器 - 简化版本,依赖 ECharts 原生 connect
const createEventHandler = (originalHandler: any, _eventType: string) => {
  return (params: any) => {
    // 调用原始事件处理器
    if (originalHandler && typeof originalHandler === 'function') {
      originalHandler(params)
    }
  }
}

// 事件处理器映射
const eventHandlers = computed(() => {
  const handlers: Record<string, any> = {}

  // 鼠标事件
  if (props.onClick) {
    handlers.click = createEventHandler(props.onClick, 'click')
  }
  if (props.onDblClick) {
    handlers.dblclick = createEventHandler(props.onDblClick, 'dblclick')
  }
  if (props.onMouseDown) {
    handlers.mousedown = createEventHandler(props.onMouseDown, 'mousedown')
  }
  if (props.onMouseMove) {
    handlers.mousemove = createEventHandler(props.onMouseMove, 'mousemove')
  }
  if (props.onMouseUp) {
    handlers.mouseup = createEventHandler(props.onMouseUp, 'mouseup')
  }
  if (props.onMouseOver) {
    handlers.mouseover = createEventHandler(props.onMouseOver, 'mouseover')
  }
  if (props.onMouseOut) {
    handlers.mouseout = createEventHandler(props.onMouseOut, 'mouseout')
  }
  if (props.onGlobalOut) {
    handlers.globalout = createEventHandler(props.onGlobalOut, 'globalout')
  }
  if (props.onContextMenu) {
    handlers.contextmenu = createEventHandler(props.onContextMenu, 'contextmenu')
  }

  // 图例事件
  if (props.onLegendSelectChanged) {
    handlers.legendselectchanged = createEventHandler(
      props.onLegendSelectChanged,
      'legendselectchanged'
    )
  }
  if (props.onLegendSelected) {
    handlers.legendselected = createEventHandler(props.onLegendSelected, 'legendselected')
  }
  if (props.onLegendUnSelected) {
    handlers.legendunselected = createEventHandler(props.onLegendUnSelected, 'legendunselected')
  }
  if (props.onLegendSelectAll) {
    handlers.legendselectall = createEventHandler(props.onLegendSelectAll, 'legendselectall')
  }
  if (props.onLegendInverseSelect) {
    handlers.legendinverseselect = createEventHandler(
      props.onLegendInverseSelect,
      'legendinverseselect'
    )
  }
  if (props.onLegendScroll) {
    handlers.legendscroll = createEventHandler(props.onLegendScroll, 'legendscroll')
  }

  // 数据区域缩放事件
  if (props.onDataZoom) {
    handlers.datazoom = createEventHandler(props.onDataZoom, 'datazoom')
  }
  if (props.onDataRangeSelected) {
    handlers.datarangeselected = createEventHandler(props.onDataRangeSelected, 'datarangeselected')
  }

  // 时间轴事件
  if (props.onTimelineChanged) {
    handlers.timelinechanged = createEventHandler(props.onTimelineChanged, 'timelinechanged')
  }
  if (props.onTimelinePlayChanged) {
    handlers.timelineplaychanged = createEventHandler(
      props.onTimelinePlayChanged,
      'timelineplaychanged'
    )
  }

  // 画刷事件
  if (props.onBrush) {
    handlers.brush = createEventHandler(props.onBrush, 'brush')
  }
  if (props.onBrushEnd) {
    handlers.brushend = createEventHandler(props.onBrushEnd, 'brushend')
  }
  if (props.onBrushSelected) {
    handlers.brushselected = createEventHandler(props.onBrushSelected, 'brushselected')
  }

  // 地图事件
  if (props.onGeoSelectChanged) {
    handlers.geoselectchanged = createEventHandler(props.onGeoSelectChanged, 'geoselectchanged')
  }
  if (props.onGeoSelected) {
    handlers.geoselected = createEventHandler(props.onGeoSelected, 'geoselected')
  }
  if (props.onGeoUnSelected) {
    handlers.geounselected = createEventHandler(props.onGeoUnSelected, 'geounselected')
  }
  if (props.onGeoRoam) {
    handlers.georoam = createEventHandler(props.onGeoRoam, 'georoam')
  }

  // 图形元素事件
  if (props.onSelectChanged) {
    handlers.selectchanged = createEventHandler(props.onSelectChanged, 'selectchanged')
  }
  if (props.onHighlight) {
    handlers.highlight = createEventHandler(props.onHighlight, 'highlight')
  }
  if (props.onDownplay) {
    handlers.downplay = createEventHandler(props.onDownplay, 'downplay')
  }

  // 动画事件
  if (props.onFinished) {
    handlers.finished = () => {
      props.onFinished?.()
      emit('finished')
    }
  } else {
    // 即使没有传入 onFinished,也要触发 emit
    handlers.finished = () => {
      emit('finished')
    }
  }

  if (props.onRendered) {
    handlers.rendered = props.onRendered
  }

  // 图表生命周期事件
  if (props.onRestore) {
    handlers.restore = createEventHandler(props.onRestore, 'restore')
  }
  if (props.onMagicTypeChanged) {
    handlers.magictypechanged = createEventHandler(props.onMagicTypeChanged, 'magictypechanged')
  }
  if (props.onDataViewChanged) {
    handlers.dataviewchanged = createEventHandler(props.onDataViewChanged, 'dataviewchanged')
  }

  // 坐标轴事件
  if (props.onAxisAreaSelected) {
    handlers.axisareaselected = createEventHandler(props.onAxisAreaSelected, 'axisareaselected')
  }

  // 焦点/失焦事件
  if (props.onFocusNodeAdjacency) {
    handlers.focusnodeadjacency = createEventHandler(
      props.onFocusNodeAdjacency,
      'focusnodeadjacency'
    )
  }
  if (props.onUnfocusNodeAdjacency) {
    handlers.unfocusnodeadjacency = createEventHandler(
      props.onUnfocusNodeAdjacency,
      'unfocusnodeadjacency'
    )
  }

  // 特殊图表事件
  if (props.onTreeExpand) {
    handlers.treeexpand = createEventHandler(props.onTreeExpand, 'treeexpand')
  }
  if (props.onTreeCollapse) {
    handlers.treecollapse = createEventHandler(props.onTreeCollapse, 'treecollapse')
  }
  if (props.onTreemapZoom) {
    handlers.treemapzoom = createEventHandler(props.onTreemapZoom, 'treemapzoom')
  }
  if (props.onParallelAxisSelected) {
    handlers.parallelaxisselected = createEventHandler(
      props.onParallelAxisSelected,
      'parallelaxisselected'
    )
  }

  return handlers
})

// 获取 ECharts 实例
const getEchartsInstance = () => {
  if (!chartRef.value) {
    return null
  }

  // 尝试多种方式获取 ECharts 实例
  let chartInstance = null

  // 方法1: 通过 chart 属性访问 (vue-echarts 5.x)
  if (chartRef.value && chartRef.value.chart) {
    chartInstance = chartRef.value.chart
  }
  // 方法2: 直接访问 (vue-echarts 5.x)
  else if (chartRef.value && typeof chartRef.value.on === 'function') {
    chartInstance = chartRef.value
  }
  // 方法3: 通过 $refs.chart 访问
  else if (chartRef.value && chartRef.value.$refs && chartRef.value.$refs.chart) {
    chartInstance = chartRef.value.$refs.chart
  }
  // 方法4: 通过 getEchartsInstance 方法访问
  else if (chartRef.value && typeof chartRef.value.getEchartsInstance === 'function') {
    chartInstance = chartRef.value.getEchartsInstance()
  }
  // 方法5: 通过 echartsInstance 属性访问
  else if (chartRef.value && chartRef.value.echartsInstance) {
    chartInstance = chartRef.value.echartsInstance
  }
  // 方法6: 通过 DOM 元素访问
  else if (chartRef.value && chartRef.value.$el && chartRef.value.$el.__echarts_instance__) {
    chartInstance = chartRef.value.$el.__echarts_instance__
  }

  return chartInstance
}

// 图表初始化标志
const isChartInitialized = ref(false)

// 组件挂载后初始化图表
onMounted(() => {
  // 等待图表完全初始化
  setTimeout(() => {
    const chartInstance = getEchartsInstance()
    if (chartInstance) {
      isChartInitialized.value = true
      console.log('UseEcharts: 图表实例已创建', {
        groupId: connectGroupId.value,
        chartId: chartInstance.id,
      })

      // 通知父组件图表已就绪
      emit('chartReady', chartInstance)
    }
  }, 100)
})

// 组件卸载时清理
onUnmounted(() => {
  isChartInitialized.value = false
})

// 暴露图表实例方法
const getChartInstance = () => chartRef.value

// 联动相关方法
const getConnectState = () => connectState.value
const setConnectState = (state: Partial<ChartConnectState>) => {
  connectState.value = { ...connectState.value, ...state }
}
const triggerConnect = (eventType: string, params: any) => {
  if (isConnectEnabled.value) {
    const chartInstance = getEchartsInstance()
    if (chartInstance) {
      chartInstance.dispatchAction({
        type: eventType,
        ...params,
      })
    }
  }
}

defineExpose({
  getChartInstance,
  getEchartsInstance,
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
  getConnectState,
  setConnectState,
  triggerConnect,
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
    :manual-update='manualUpdate',
    :group='connectGroupId',
    @click='eventHandlers.click',
    @dblclick='eventHandlers.dblclick',
    @mousedown='eventHandlers.mousedown',
    @mousemove='eventHandlers.mousemove',
    @mouseup='eventHandlers.mouseup',
    @mouseover='eventHandlers.mouseover',
    @mouseout='eventHandlers.mouseout',
    @globalout='eventHandlers.globalout',
    @contextmenu='eventHandlers.contextmenu',
    @legendselectchanged='eventHandlers.legendselectchanged',
    @legendselected='eventHandlers.legendselected',
    @legendunselected='eventHandlers.legendunselected',
    @legendselectall='eventHandlers.legendselectall',
    @legendinverseselect='eventHandlers.legendinverseselect',
    @legendscroll='eventHandlers.legendscroll',
    @datazoom='eventHandlers.datazoom',
    @datarangeselected='eventHandlers.datarangeselected',
    @timelinechanged='eventHandlers.timelinechanged',
    @timelineplaychanged='eventHandlers.timelineplaychanged',
    @brush='eventHandlers.brush',
    @brushend='eventHandlers.brushend',
    @brushselected='eventHandlers.brushselected',
    @geoselectchanged='eventHandlers.geoselectchanged',
    @geoselected='eventHandlers.geoselected',
    @geounselected='eventHandlers.geounselected',
    @georoam='eventHandlers.georoam',
    @selectchanged='eventHandlers.selectchanged',
    @highlight='eventHandlers.highlight',
    @downplay='eventHandlers.downplay',
    @restore='eventHandlers.restore',
    @magictypechanged='eventHandlers.magictypechanged',
    @dataviewchanged='eventHandlers.dataviewchanged',
    @axisareaselected='eventHandlers.axisareaselected',
    @focusnodeadjacency='eventHandlers.focusnodeadjacency',
    @unfocusnodeadjacency='eventHandlers.unfocusnodeadjacency',
    @finished='eventHandlers.finished'
  )
</template>
