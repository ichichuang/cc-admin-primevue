import type { DefaultOpacityValues } from './types'

// 默认透明度配置
export const DEFAULT_OPACITY_VALUES: DefaultOpacityValues = {
  lineArea: 0.3, // 折线图区域填充透明度
  area: 0.3, // 面积图透明度
  bar: 1, // 柱状图透明度（实色）
  scatter: 0.6, // 散点图透明度
  effectScatter: 0.6, // 特效散点图透明度
  radar: 0.2, // 雷达图透明度
  funnel: 0.8, // 漏斗图透明度
  gauge: 1, // 仪表盘透明度（实色）
}

// 默认组件 Props
export const createDefaultUseEchartsProps = () => ({
  option: () => ({}),
  width: '100%',
  height: '400px',
  theme: 'default',
  loading: false,
  loadingOptions: () => ({}),
  manualUpdate: false,
  themeConfig: () => ({
    enableTheme: true,
    opacity: DEFAULT_OPACITY_VALUES,
  }),
})

// 支持透明度的图表类型
export const TRANSPARENT_CHART_TYPES = [
  'line',
  'area',
  'scatter',
  'effectScatter',
  'radar',
  'funnel',
] as const

// 实色图表类型（不需要透明度）
export const SOLID_CHART_TYPES = ['bar', 'gauge'] as const

// 所有支持的图表类型
export const ALL_CHART_TYPES = [...TRANSPARENT_CHART_TYPES, ...SOLID_CHART_TYPES] as const

export type TransparentChartType = (typeof TRANSPARENT_CHART_TYPES)[number]
export type SolidChartType = (typeof SOLID_CHART_TYPES)[number]
export type AllChartType = (typeof ALL_CHART_TYPES)[number]
