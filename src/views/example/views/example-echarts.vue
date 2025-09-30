<script setup lang="ts">
import { UseEcharts } from '@/components/modules/use-echarts'
import { useIntervalFn } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'

// 基础图表配置
const staticOptions = {
  title: {
    text: '框架主题图表示例',
    subtext: '展示主题色和尺寸配置',
  },
  tooltip: {
    trigger: 'axis' as const,
    axisPointer: {
      type: 'cross' as const,
    },
  },
  legend: {
    data: ['销量', '利润', '增长率'],
  },
  xAxis: {
    type: 'category' as const,
    data: ['一月', '二月', '三月', '四月', '五月', '六月'],
  },
  yAxis: [
    {
      type: 'value' as const,
      name: '销量/利润',
      position: 'left' as const,
    },
    {
      type: 'value' as const,
      name: '增长率(%)',
      position: 'right' as const,
    },
  ],
  series: [
    {
      name: '销量',
      type: 'bar' as const,
      data: [120, 200, 150, 80, 70, 110],
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
      },
    },
    {
      name: '利润',
      type: 'line' as const,
      yAxisIndex: 0,
      data: [60, 100, 75, 40, 35, 55],
      smooth: true,
      symbol: 'circle' as const,
      symbolSize: 6,
    },
    {
      name: '增长率',
      type: 'line' as const,
      yAxisIndex: 1,
      data: [15, 25, 18, 12, 8, 20],
      smooth: true,
      symbol: 'diamond' as const,
      symbolSize: 8,
    },
  ],
  dataZoom: {
    show: false,
  },
}

// 动态数据状态
const timeData = ref<string[]>([])
const pm25Data = ref<number[]>([])
const pm10Data = ref<number[]>([])
const aqiData = ref<number[]>([])

// 最大数据点数量和窗口大小
const maxDataPoints = 12
const windowSize = 8

// 动画模式控制
const animationMode = ref<'smooth' | 'dataZoom'>('smooth')

// 生成当前时间字符串
const getCurrentTime = () => {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
}

// 生成模拟数据
const generateMockData = () => {
  return {
    pm25: Math.floor(Math.random() * 100) + 20, // PM2.5: 20-120
    pm10: Math.floor(Math.random() * 150) + 30, // PM10: 30-180
    aqi: Math.floor(Math.random() * 200) + 50, // AQI: 50-250
  }
}

// 初始化图表配置
const dynamicOptions = computed(() => ({
  title: {
    text: '空气质量实时监测',
    subtext: 'PM2.5、PM10、AQI 动态数据',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis' as const,
    axisPointer: {
      type: 'cross' as const,
    },
    formatter: (params: any) => {
      let result = `<div style="font-size: 14px; font-weight: bold;">${params[0].axisValue}</div>`
      params.forEach((param: any) => {
        const color = param.color
        const name = param.seriesName
        const value = param.value
        let unit = ''
        let level = ''

        if (name === 'PM2.5') {
          unit = 'μg/m³'
          level =
            value <= 35
              ? '优'
              : value <= 75
                ? '良'
                : value <= 115
                  ? '轻度污染'
                  : value <= 150
                    ? '中度污染'
                    : '重度污染'
        } else if (name === 'PM10') {
          unit = 'μg/m³'
          level =
            value <= 50
              ? '优'
              : value <= 150
                ? '良'
                : value <= 250
                  ? '轻度污染'
                  : value <= 350
                    ? '中度污染'
                    : '重度污染'
        } else if (name === 'AQI') {
          unit = ''
          level =
            value <= 50
              ? '优'
              : value <= 100
                ? '良'
                : value <= 150
                  ? '轻度污染'
                  : value <= 200
                    ? '中度污染'
                    : value <= 300
                      ? '重度污染'
                      : '严重污染'
        }

        result += `<div style="margin-top: 4px;">
          <span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 8px;"></span>
          <span style="font-weight: bold;">${name}:</span>
          <span style="color: ${color}; font-weight: bold; margin-left: 8px;">${value}${unit}</span>
          <span style="color: #666; margin-left: 8px;">(${level})</span>
        </div>`
      })
      return result
    },
  },
  legend: {
    data: ['PM2.5', 'PM10', 'AQI'],
  },
  grid: {
    top: '22%',
    containLabel: true,
  },
  xAxis: {
    type: 'category' as const,
    data: timeData.value,
    axisLabel: {
      rotate: 45,
      fontSize: 10,
    },
  },
  yAxis: [
    {
      type: 'value' as const,
      name: 'PM2.5/PM10 (μg/m³)',
      position: 'left' as const,
    },
    {
      type: 'value' as const,
      name: 'AQI',
      position: 'right' as const,
    },
  ],
  series: [
    {
      name: 'PM2.5',
      type: 'line' as const,
      yAxisIndex: 0,
      data: pm25Data.value,
      smooth: true,
      symbol: 'circle' as const,
      symbolSize: 6,
      lineStyle: {
        width: 3,
      },
      itemStyle: {
        color: '#ff6b6b',
      },
      areaStyle: {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 107, 107, 0.3)' },
            { offset: 1, color: 'rgba(255, 107, 107, 0.05)' },
          ],
        },
      },
    },
    {
      name: 'PM10',
      type: 'line' as const,
      yAxisIndex: 0,
      data: pm10Data.value,
      smooth: true,
      symbol: 'diamond' as const,
      symbolSize: 8,
      lineStyle: {
        width: 3,
      },
      itemStyle: {
        color: '#4ecdc4',
      },
      areaStyle: {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(78, 205, 196, 0.3)' },
            { offset: 1, color: 'rgba(78, 205, 196, 0.05)' },
          ],
        },
      },
    },
    {
      name: 'AQI',
      type: 'line' as const,
      yAxisIndex: 1,
      data: aqiData.value,
      smooth: true,
      symbol: 'triangle' as const,
      symbolSize: 8,
      lineStyle: {
        width: 3,
      },
      itemStyle: {
        color: '#45b7d1',
      },
      areaStyle: {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(69, 183, 209, 0.3)' },
            { offset: 1, color: 'rgba(69, 183, 209, 0.05)' },
          ],
        },
      },
    },
  ],
  // 添加数据缩放配置以支持平移动画
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: 0,
      start: 0,
      end: 100,
    },
  ],
}))

// 动态图表引用
const dynamicChartRef = ref<any>()

// 更新动态数据
const updateDynamicData = () => {
  const mockData = generateMockData()
  const currentTime = getCurrentTime()

  // 添加新数据
  timeData.value.push(currentTime)
  pm25Data.value.push(mockData.pm25)
  pm10Data.value.push(mockData.pm10)
  aqiData.value.push(mockData.aqi)

  // 如果数据超过最大点数，移除最老的数据
  if (timeData.value.length > maxDataPoints) {
    timeData.value.shift()
    pm25Data.value.shift()
    pm10Data.value.shift()
    aqiData.value.shift()
  }

  // 使用优化后的更新方法，保持动画效果
  if (dynamicChartRef.value) {
    // 方法1：更新 X 轴数据
    dynamicChartRef.value.updateXAxisData(timeData.value, true)

    // 方法2：更新系列数据
    dynamicChartRef.value.updateData(
      [
        {
          name: 'PM2.5',
          data: pm25Data.value,
        },
        {
          name: 'PM10',
          data: pm10Data.value,
        },
        {
          name: 'AQI',
          data: aqiData.value,
        },
      ],
      true
    )
  }
}

// 使用 dataZoom 实现平移效果的方法（适用于大数据集）
const updateWithDataZoom = () => {
  // 适用于有大量数据需要平移展示的场景
  // 当数据量大时，使用 dataZoom 可以获得更好的性能和平移效果
  const mockData = generateMockData()
  const currentTime = getCurrentTime()

  // 持续添加数据（不删除旧数据）
  timeData.value.push(currentTime)
  pm25Data.value.push(mockData.pm25)
  pm10Data.value.push(mockData.pm10)
  aqiData.value.push(mockData.aqi)

  if (dynamicChartRef.value) {
    // 更新图表数据
    dynamicChartRef.value.updateXAxisData(timeData.value, true)
    dynamicChartRef.value.updateData(
      [
        {
          name: 'PM2.5',
          data: pm25Data.value,
        },
        {
          name: 'PM10',
          data: pm10Data.value,
        },
        {
          name: 'AQI',
          data: aqiData.value,
        },
      ],
      true
    )

    // 如果数据超过窗口大小，使用 dataZoom 平移显示
    if (timeData.value.length > windowSize) {
      // const endIndex = timeData.value.length - 1
      // const startIndex = endIndex - windowSize + 1
      const totalLength = timeData.value.length
      const endPercent = 100 // 始终显示到最新数据
      const startPercent = ((totalLength - windowSize) / totalLength) * 100

      dynamicChartRef.value.dispatchAction({
        type: 'dataZoom',
        startValue: startPercent,
        endValue: endPercent,
      })
    }
  }
}

// 初始化数据
const initializeData = () => {
  // 初始化一些数据点
  for (let i = 0; i < 5; i++) {
    const mockData = generateMockData()
    timeData.value.push(getCurrentTime())
    pm25Data.value.push(mockData.pm25)
    pm10Data.value.push(mockData.pm10)
    aqiData.value.push(mockData.aqi)
  }
}

// 统一的更新方法
const performUpdate = () => {
  if (animationMode.value === 'smooth') {
    updateDynamicData()
  } else {
    updateWithDataZoom()
  }
}

// 启动定时更新
const { pause: pauseInterval, resume: resumeInterval } = useIntervalFn(() => {
  performUpdate()
}, 2000)

onMounted(() => {
  // 初始化数据
  initializeData()

  // 确保图表已经初始化后再启动定时器
  setTimeout(() => {
    resumeInterval()
  }, 1000)
})

// 手动添加数据点的方法
const addDataPoint = () => {
  performUpdate()
}

// 清空数据的方法
const clearData = () => {
  timeData.value = []
  pm25Data.value = []
  pm10Data.value = []
  aqiData.value = []

  if (dynamicChartRef.value) {
    dynamicChartRef.value.updateXAxisData([], true)
    dynamicChartRef.value.updateData(
      [
        { name: 'PM2.5', data: [] },
        { name: 'PM10', data: [] },
        { name: 'AQI', data: [] },
      ],
      true
    )
  }
}

// 切换动画模式
const switchToSmooth = () => {
  animationMode.value = 'smooth'
  clearData()
  initializeData()
}

const switchToDataZoom = () => {
  animationMode.value = 'dataZoom'
  clearData()
  initializeData()
}
</script>

<template lang="pug">
.full.between-col.gap-gap
  .mb-gapl
    .fs-appFontSize.mb-2 静态图表示例
    .color-text200.fs-appFontSizes 展示框架主题色和尺寸配置的应用效果
    UseEcharts.h-500(:options='staticOptions', :auto-resize='true')

  .mb-gapl
    .fs-appFontSize.mb-2 动态图表示例 - 空气质量监测
    .color-text200.fs-appFontSizes 每2秒自动更新数据，支持两种动画模式：平滑更新和数据窗口平移

    // 模式切换
    .flex.items-center.gap-4.mb-4
      .text-sm.font-medium 动画模式:
      Button(
        :severity='animationMode === "smooth" ? "primary" : "secondary"',
        @click='switchToSmooth'
      ) 平滑更新模式
      Button(
        :severity='animationMode === "dataZoom" ? "primary" : "secondary"',
        @click='switchToDataZoom'
      ) 数据窗口平移模式

    // 当前模式说明
    .text-sm.text-gray-600.mb-4
      span(v-if='animationMode === "smooth"') 当前模式：平滑更新 - 限制最大{{ maxDataPoints }}个数据点，旧数据自动移除
      span(v-else) 当前模式：数据窗口平移 - 保留所有数据，显示最近{{ windowSize }}个数据点的滑动窗口

    // 控制按钮
    .flex.items-center.gap-4.mb-4
      Button(@click='addDataPoint') 手动添加数据点
      Button(severity='warn', @click='pauseInterval') 暂停更新
      Button(severity='success', @click='resumeInterval') 恢复更新
      Button(severity='danger', @click='clearData') 清空数据

    UseEcharts.h-500(ref='dynamicChartRef', :options='dynamicOptions', :auto-resize='true')
</template>
