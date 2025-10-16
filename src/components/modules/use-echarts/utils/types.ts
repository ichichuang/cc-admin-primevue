import type { EChartsOption } from 'echarts'

// 图表透明度配置类型
export interface ChartOpacityConfig {
  /** 折线图区域填充透明度 (0-1) */
  lineArea?: number
  /** 面积图透明度 (0-1) */
  area?: number
  /** 柱状图透明度 (0-1) */
  bar?: number
  /** 散点图透明度 (0-1) */
  scatter?: number
  /** 特效散点图透明度 (0-1) */
  effectScatter?: number
  /** 雷达图透明度 (0-1) */
  radar?: number
  /** 漏斗图透明度 (0-1) */
  funnel?: number
  /** 仪表盘透明度 (0-1) */
  gauge?: number
}

// 图表主题配置类型
export interface ChartThemeConfig {
  /** 是否启用主题合并 */
  enableTheme?: boolean
  /** 透明度配置 */
  opacity?: ChartOpacityConfig
}

// UseEcharts 组件 Props 类型
export interface UseEchartsProps extends ChartEventHandlers {
  /** ECharts 配置选项 */
  option?: EChartsOption
  /** 图表宽度 */
  width?: string | number
  /** 图表高度 */
  height?: string | number
  /** 图表主题 */
  theme?: string
  /** 是否显示加载状态 */
  loading?: boolean
  /** 加载配置选项 */
  loadingOptions?: any
  /** 是否手动更新 */
  manualUpdate?: boolean
  /** 图表主题配置 */
  themeConfig?: ChartThemeConfig
}

// 图表实例方法类型
export interface ChartInstance {
  /** 获取 ECharts 实例 */
  getChartInstance: () => any
  /** 设置图表配置 */
  setOption: (option: EChartsOption, notMerge?: boolean) => void
  /** 调整图表大小 */
  resize: () => void
  /** 清空图表 */
  clear: () => void
  /** 销毁图表 */
  dispose: () => void
}

// 透明度默认值类型
export type DefaultOpacityValues = Required<ChartOpacityConfig>

// ECharts 事件参数类型
export interface ChartEventParams {
  // 通用事件参数
  type: string
  event: Event
  target?: any
  topTarget?: any

  // 数据相关参数
  componentType?: string
  componentSubType?: string
  componentIndex?: number
  seriesIndex?: number
  seriesName?: string
  seriesType?: string
  dataIndex?: number
  dataType?: string
  data?: any
  value?: any
  name?: string
  color?: string

  // 坐标相关参数
  offsetX?: number
  offsetY?: number

  // 批量操作参数
  batch?: Array<{
    seriesIndex: number
    dataIndex: number[]
  }>
}

// 鼠标事件类型
export interface ChartMouseEventParams extends ChartEventParams {
  event: MouseEvent
}

// 图例事件参数类型
export interface ChartLegendEventParams extends ChartEventParams {
  selected?: Record<string, boolean>
}

// 数据区域缩放事件参数类型
export interface ChartDataZoomEventParams extends ChartEventParams {
  start?: number
  end?: number
  startValue?: number
  endValue?: number
}

// 画刷事件参数类型
export interface ChartBrushEventParams extends ChartEventParams {
  areas?: Array<{
    brushType: string
    coordRange: number[][]
    range: number[][]
  }>
  selected?: Array<{
    seriesIndex: number
    dataIndex: number[]
  }>
}

// 时间轴事件参数类型
export interface ChartTimelineEventParams extends ChartEventParams {
  currentIndex?: number
}

// 地图事件参数类型
export interface ChartMapEventParams extends ChartEventParams {
  region?: {
    name: string
    type: string
  }
}

// 图表事件处理函数类型
export interface ChartEventHandlers {
  // 鼠标事件
  onClick?: (params: ChartMouseEventParams) => void
  onDblClick?: (params: ChartMouseEventParams) => void
  onMouseDown?: (params: ChartMouseEventParams) => void
  onMouseMove?: (params: ChartMouseEventParams) => void
  onMouseUp?: (params: ChartMouseEventParams) => void
  onMouseOver?: (params: ChartMouseEventParams) => void
  onMouseOut?: (params: ChartMouseEventParams) => void
  onGlobalOut?: (params: ChartEventParams) => void
  onContextMenu?: (params: ChartMouseEventParams) => void

  // 图例事件
  onLegendSelectChanged?: (params: ChartLegendEventParams) => void
  onLegendSelected?: (params: ChartLegendEventParams) => void
  onLegendUnSelected?: (params: ChartLegendEventParams) => void
  onLegendSelectAll?: (params: ChartLegendEventParams) => void
  onLegendInverseSelect?: (params: ChartLegendEventParams) => void
  onLegendScroll?: (params: ChartEventParams) => void

  // 数据区域缩放事件
  onDataZoom?: (params: ChartDataZoomEventParams) => void
  onDataRangeSelected?: (params: ChartEventParams) => void

  // 时间轴事件
  onTimelineChanged?: (params: ChartTimelineEventParams) => void
  onTimelinePlayChanged?: (params: ChartTimelineEventParams) => void

  // 画刷事件
  onBrush?: (params: ChartBrushEventParams) => void
  onBrushEnd?: (params: ChartBrushEventParams) => void
  onBrushSelected?: (params: ChartBrushEventParams) => void

  // 地图事件
  onGeoSelectChanged?: (params: ChartMapEventParams) => void
  onGeoSelected?: (params: ChartMapEventParams) => void
  onGeoUnSelected?: (params: ChartMapEventParams) => void
  onGeoRoam?: (params: ChartEventParams) => void

  // 图形元素事件
  onSelectChanged?: (params: ChartEventParams) => void
  onHighlight?: (params: ChartEventParams) => void
  onDownplay?: (params: ChartEventParams) => void

  // 动画事件
  onFinished?: () => void
  onRendered?: () => void

  // 图表生命周期事件
  onRestore?: (params: ChartEventParams) => void
  onMagicTypeChanged?: (params: ChartEventParams) => void
  onDataViewChanged?: (params: ChartEventParams) => void

  // 坐标轴事件
  onAxisAreaSelected?: (params: ChartEventParams) => void

  // 焦点/失焦事件
  onFocusNodeAdjacency?: (params: ChartEventParams) => void
  onUnfocusNodeAdjacency?: (params: ChartEventParams) => void
}
