<script setup lang="ts">
import { ref } from 'vue'

// 柱状图配置
const barChartOption = ref({
  title: {
    text: '月度销售数据（柱状图）',
  },
  tooltip: {
    trigger: 'axis' as const,
  },
  legend: {},
  xAxis: {
    type: 'category' as const,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  },
  yAxis: {
    type: 'value' as const,
  },
  series: [
    {
      name: '销售额',
      type: 'bar' as const,
      data: [120, 200, 150, 80, 70, 110, 130, 180, 160, 140, 190, 220],
    },
    {
      name: '利润',
      type: 'bar' as const,
      data: [60, 100, 75, 40, 35, 55, 65, 90, 80, 70, 95, 110],
    },
  ],
})

// 折线图配置
const lineChartOption = ref({
  title: {
    text: '用户增长趋势（折线图）',
  },
  tooltip: {
    trigger: 'axis' as const,
  },
  legend: {},
  xAxis: {
    type: 'category' as const,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: {
    type: 'value' as const,
  },
  series: [
    {
      name: '新用户',
      type: 'line' as const,
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: '活跃用户',
      type: 'line' as const,
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: '总用户',
      type: 'line' as const,
      data: [150, 232, 201, 154, 190, 330, 410],
    },
  ],
})

// 饼图配置
const pieChartOption = ref({
  title: {
    text: '产品市场份额（饼图）',
  },
  tooltip: {
    trigger: 'item' as const,
  },
  legend: {},
  series: [
    {
      name: '市场份额',
      type: 'pie' as const,
      data: [
        { value: 1048, name: '产品A' },
        { value: 735, name: '产品B' },
        { value: 580, name: '产品C' },
        { value: 484, name: '产品D' },
        { value: 300, name: '产品E' },
      ],
    },
  ],
})

// 散点图配置
const scatterChartOption = ref({
  title: {
    text: '身高体重分布（散点图）',
  },
  tooltip: {
    trigger: 'item' as const,
  },
  xAxis: {
    type: 'value' as const,
  },
  yAxis: {
    type: 'value' as const,
  },
  series: [
    {
      name: '男生',
      type: 'scatter' as const,
      data: [
        [161.2, 51.6],
        [167.5, 59.0],
        [159.5, 49.2],
        [157.0, 63.0],
        [155.8, 53.6],
        [170.0, 59.0],
        [159.1, 47.6],
        [166.0, 69.8],
        [176.2, 66.8],
        [160.2, 75.2],
        [172.5, 55.2],
        [170.9, 54.2],
        [172.9, 62.5],
        [153.4, 42.0],
        [160.0, 50.0],
        [147.2, 49.8],
        [168.2, 49.2],
        [175.0, 73.2],
        [157.0, 47.8],
        [167.6, 68.8],
      ],
    },
    {
      name: '女生',
      type: 'scatter' as const,
      data: [
        [137.2, 51.6],
        [150.5, 59.0],
      ],
    },
  ],
})

// 雷达图配置
const radarChartOption = ref({
  title: {
    text: '产品性能评估（雷达图）',
  },
  tooltip: {},
  legend: {},
  radar: {
    indicator: [
      { name: '性能', max: 100 },
      { name: '可靠性', max: 100 },
      { name: '易用性', max: 100 },
      { name: '安全性', max: 100 },
      { name: '价格', max: 100 },
    ],
  },
  series: [
    {
      type: 'radar' as const,
      data: [
        {
          value: [80, 90, 70, 85, 60],
          name: '产品A',
        },
        {
          value: [70, 75, 85, 80, 85],
          name: '产品B',
        },
      ],
    },
  ],
})

// 漏斗图配置
const funnelChartOption = ref({
  title: {
    text: '销售转化漏斗（漏斗图）',
  },
  tooltip: {
    trigger: 'item' as const,
  },
  legend: {},
  series: [
    {
      type: 'funnel' as const,
      data: [
        { value: 100, name: '展示' },
        { value: 80, name: '点击' },
        { value: 60, name: '访问' },
        { value: 40, name: '咨询' },
        { value: 20, name: '订单' },
      ],
    },
  ],
})

// 仪表盘配置
const gaugeChartOption = ref({
  title: {
    text: '任务完成度（仪表盘）',
  },
  series: [
    {
      type: 'gauge' as const,
      data: [
        {
          value: 75.5,
          name: '完成率',
        },
      ],
    },
  ],
})

// K线图配置
const candlestickChartOption = ref({
  title: {
    text: '股票价格走势（K线图）',
  },
  tooltip: {
    trigger: 'axis' as const,
  },
  xAxis: {
    type: 'category' as const,
    data: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'],
  },
  yAxis: {
    type: 'value' as const,
  },
  series: [
    {
      type: 'candlestick' as const,
      data: [
        [20, 34, 10, 38],
        [40, 35, 30, 50],
        [31, 38, 33, 44],
        [38, 15, 5, 42],
        [14, 30, 14, 35],
        [30, 45, 28, 50],
      ],
    },
  ],
})

// 热力图配置
const heatmapChartOption = ref({
  title: {
    text: '每周活跃时段（热力图）',
  },
  tooltip: {},
  xAxis: {
    type: 'category' as const,
    data: [
      '0时',
      '2时',
      '4时',
      '6时',
      '8时',
      '10时',
      '12时',
      '14时',
      '16时',
      '18时',
      '20时',
      '22时',
    ],
  },
  yAxis: {
    type: 'category' as const,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  visualMap: {
    min: 0,
    max: 100,
  },
  series: [
    {
      type: 'heatmap' as const,
      data: [
        [0, 0, 5],
        [1, 0, 10],
        [2, 0, 8],
        [3, 0, 15],
        [4, 0, 20],
        [5, 0, 35],
        [6, 0, 50],
        [7, 0, 70],
        [8, 0, 80],
        [9, 0, 60],
        [10, 0, 45],
        [11, 0, 30],
        [0, 1, 8],
        [1, 1, 12],
        [2, 1, 10],
        [3, 1, 18],
        [4, 1, 25],
        [5, 1, 40],
        [6, 1, 55],
        [7, 1, 75],
        [8, 1, 85],
        [9, 1, 65],
        [10, 1, 50],
        [11, 1, 35],
        [0, 2, 6],
        [1, 2, 11],
        [2, 2, 9],
        [3, 2, 16],
        [4, 2, 22],
        [5, 2, 38],
        [6, 2, 52],
        [7, 2, 72],
        [8, 2, 82],
        [9, 2, 62],
        [10, 2, 48],
        [11, 2, 32],
        [0, 3, 7],
        [1, 3, 13],
        [2, 3, 11],
        [3, 3, 19],
        [4, 3, 28],
        [5, 3, 42],
        [6, 3, 58],
        [7, 3, 78],
        [8, 3, 88],
        [9, 3, 68],
        [10, 3, 52],
        [11, 3, 38],
        [0, 4, 9],
        [1, 4, 14],
        [2, 4, 12],
        [3, 4, 20],
        [4, 4, 30],
        [5, 4, 45],
        [6, 4, 60],
        [7, 4, 80],
        [8, 4, 90],
        [9, 4, 70],
        [10, 4, 55],
        [11, 4, 40],
        [0, 5, 15],
        [1, 5, 25],
        [2, 5, 22],
        [3, 5, 35],
        [4, 5, 48],
        [5, 5, 65],
        [6, 5, 75],
        [7, 5, 90],
        [8, 5, 95],
        [9, 5, 85],
        [10, 5, 70],
        [11, 5, 55],
        [0, 6, 12],
        [1, 6, 20],
        [2, 6, 18],
        [3, 6, 28],
        [4, 6, 40],
        [5, 6, 55],
        [6, 6, 68],
        [7, 6, 85],
        [8, 6, 92],
        [9, 6, 78],
        [10, 6, 62],
        [11, 6, 48],
      ],
    },
  ],
})

// 桑基图配置
const sankeyChartOption = ref({
  title: {
    text: '能量流向图（桑基图）',
  },
  tooltip: {},
  series: [
    {
      type: 'sankey' as const,
      data: [
        { name: '能源A' },
        { name: '能源B' },
        { name: '转换1' },
        { name: '转换2' },
        { name: '使用1' },
        { name: '使用2' },
        { name: '使用3' },
      ],
      links: [
        { source: '能源A', target: '转换1', value: 5 },
        { source: '能源A', target: '转换2', value: 3 },
        { source: '能源B', target: '转换1', value: 8 },
        { source: '转换1', target: '使用1', value: 6 },
        { source: '转换1', target: '使用2', value: 7 },
        { source: '转换2', target: '使用2', value: 1 },
        { source: '转换2', target: '使用3', value: 2 },
      ],
    },
  ],
})

// 箱型图配置
const boxplotChartOption = ref({
  title: {
    text: '数据分布情况（箱型图）',
  },
  tooltip: {},
  xAxis: {
    type: 'category' as const,
    data: ['A组', 'B组', 'C组', 'D组', 'E组'],
  },
  yAxis: {
    type: 'value' as const,
  },
  series: [
    {
      type: 'boxplot' as const,
      data: [
        [850, 740, 900, 1070, 930],
        [960, 940, 960, 980, 960],
        [880, 880, 880, 880, 880],
        [890, 810, 810, 820, 800],
        [960, 1060, 960, 960, 1060],
      ],
    },
  ],
})

// 旭日图配置
const sunburstChartOption = ref({
  title: {
    text: '层级数据结构（旭日图）',
  },
  series: [
    {
      type: 'sunburst' as const,
      data: [
        {
          name: 'A',
          value: 10,
          children: [
            {
              name: 'A-1',
              value: 3,
              children: [
                { name: 'A-1-a', value: 1 },
                { name: 'A-1-b', value: 2 },
              ],
            },
            {
              name: 'A-2',
              value: 7,
              children: [
                { name: 'A-2-a', value: 4 },
                { name: 'A-2-b', value: 3 },
              ],
            },
          ],
        },
        {
          name: 'B',
          value: 8,
          children: [
            { name: 'B-1', value: 3 },
            { name: 'B-2', value: 5 },
          ],
        },
      ],
    },
  ],
})

// 主题河流图配置
const themeRiverChartOption = ref({
  title: {
    text: '时序数据演变（主题河流图）',
  },
  tooltip: {},
  singleAxis: {
    type: 'time' as const,
  },
  series: [
    {
      type: 'themeRiver' as const,
      data: [
        ['2024-01-01', 10, '类别A'] as [string, number, string],
        ['2024-02-01', 15, '类别A'] as [string, number, string],
        ['2024-03-01', 35, '类别A'] as [string, number, string],
        ['2024-04-01', 38, '类别A'] as [string, number, string],
        ['2024-05-01', 22, '类别A'] as [string, number, string],
        ['2024-01-01', 35, '类别B'] as [string, number, string],
        ['2024-02-01', 36, '类别B'] as [string, number, string],
        ['2024-03-01', 37, '类别B'] as [string, number, string],
        ['2024-04-01', 22, '类别B'] as [string, number, string],
        ['2024-05-01', 24, '类别B'] as [string, number, string],
        ['2024-01-01', 21, '类别C'] as [string, number, string],
        ['2024-02-01', 25, '类别C'] as [string, number, string],
        ['2024-03-01', 27, '类别C'] as [string, number, string],
        ['2024-04-01', 23, '类别C'] as [string, number, string],
        ['2024-05-01', 24, '类别C'] as [string, number, string],
      ],
    },
  ],
})
</script>

<template lang="pug">
.full.p-4
  .grid.grid-cols-1.gap-gap(class='lg:grid-cols-2 xl:grid-cols-3')
    UseEcharts(:option='barChartOption')
    UseEcharts(:option='lineChartOption')
    UseEcharts(:option='pieChartOption')
    UseEcharts(:option='scatterChartOption')
    UseEcharts(:option='radarChartOption')
    UseEcharts(:option='funnelChartOption')
    UseEcharts(:option='gaugeChartOption')
    UseEcharts(:option='candlestickChartOption')
    UseEcharts(:option='heatmapChartOption')
    UseEcharts(:option='sankeyChartOption')
    UseEcharts(:option='boxplotChartOption')
    UseEcharts(:option='sunburstChartOption')
    UseEcharts(:option='themeRiverChartOption')
</template>
