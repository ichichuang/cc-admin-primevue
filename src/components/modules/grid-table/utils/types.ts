// @/components/grid-table/utils/types.ts
/**
 * GridTable 类型定义 —— 供 GridTable 全模块共享
 *
 * 这个文件包含了 GridTable 组件的所有 TypeScript 类型定义。
 *
 * 设计目标：
 * - 严格且贴近 AG Grid API，提供完整的 TypeScript 类型推断
 * - 仿照 SchemaForm 的设计模式，提供友好的配置方式
 * - 支持全局和列级别的功能控制
 * - 提供完整的配置优先级系统
 *
 * 主要类型：
 * - 基础类型：主题名称、文本对齐、列类型等
 * - 配置类型：布局、功能、分页、选择、导出等配置
 * - 组件类型：Props、Expose、Emits 等组件相关类型
 * - 工具类型：主题参数、国际化文本等工具类型
 */

import type { CsvExportParams, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community'

// ==================== 基础类型 ====================
/* 文本对齐方式 */
export type TextAlign = 'left' | 'center' | 'right'

/* 列类型 */
export type ColumnType =
  | 'text' // 文本列：使用自定义封装的 InputText 组件
  | 'number' // 数字列：使用自定义封装的 InputNumber 组件
  | 'date' // 日期列：使用自定义封装的 DatePicker 组件
  | 'datetime' // 日期时间列：使用自定义封装的 DateTimePicker 组件
  | 'time' // 时间列：使用自定义封装的 TimePicker 组件
  | 'boolean' // 布尔列：使用自定义封装的 ToggleSwitch 组件，值为 boolean
  | 'custom' // 自定义列：完全自定义的列

// ==================== 布局/行为配置 ====================

/**
 * 表格和列统一公用的配置
 *
 * 这些配置项既可以用于表格级别，也可以用于列级别。
 * 配置优先级：列配置 > 表格配置 > 默认配置
 */
export interface LayoutConfig {
  // 是否启用筛选
  filtering?: boolean
  // 是否启用排序
  sorting?: boolean
  // 是否启用列调整大小
  resizing?: boolean
  // 是否启用列移动
  columnMoving?: boolean
  // 是否启用单元格编辑
  cellEditing?: boolean
  // 文本对齐方式
  textAlign?: TextAlign
  // 表头文本对齐方式
  headerTextAlign?: TextAlign
  // 列最小宽度（像素值）
  minWidth?: number
  // 列最大宽度（像素值）
  maxWidth?: number
  // 单元格的 style
  cellStyle?: object
  // 列头的 style
  headerStyle?: object
  // 单元格的 class
  cellClass?: string
  // 列头的 class */
  headerClass?: string
}

/**
 * 表格布局配置
 *
 * 控制表格的整体布局和视觉效果。
 * 包括尺寸、边框、斑马纹、悬停效果等表格特有的配置。
 */
export interface TableLayoutConfig {
  /** 表格高度（CSS 值，如 '500px', '100%' 等，或 'auto' 自动撑开） */
  height?: string | 'auto'
  /** 表格宽度（CSS 值，如 '100%', '800px' 等） */
  width?: string
  /**
   * 斑马纹显示模式（可选）
   * - 'odd': 启用奇数行斑马纹
   * - 'even': 启用偶数行斑马纹
   * - 'none': 不启用斑马纹（默认）
   * 注意：当未指定 zebraColor 时，使用主题内置的行类名（ag-row-odd / ag-row-even），
   * 由主题样式决定颜色；当指定 zebraColor 时，将直接以行内样式设置背景色。
   */
  zebra?: 'odd' | 'even' | 'none'
  /** 斑马纹自定义颜色（CSS 颜色值）。提供时优先生效，覆盖主题颜色 */
  zebraColor?: string
  /** 行高（像素值，如 40） */
  rowHeight?: number
  /** 表头高度（像素值，如 45） */
  headerHeight?: number
  /** 是否显示横向分割线（行线） */
  horizontalLines?: boolean
  /** 是否显示纵向分割线（列线） */
  verticalLines?: boolean
  /** 悬停行高亮：鼠标悬停单元格时，该行是否背景高亮 */
  hoverRowHighlight?: boolean
  /** 悬停列高亮：鼠标悬停单元格时，该列是否背景高亮 */
  hoverColumnHighlight?: boolean
  /** 选中单元格边框高亮：单元格被选中/聚焦时是否边框高亮 */
  selectedCellBorderHighlight?: boolean
  /** 选中单元格背景高亮：单元格被选中/聚焦时是否背景高亮 */
  selectedCellBackgroundHighlight?: boolean
  /** 统一配置（表格级别的默认值） */
  layout?: LayoutConfig
}

// ==================== 功能配置 ====================

/**
 * 表格功能配置
 *
 * 控制表格的各种功能开关。
 * 注意：基础功能配置（filtering、sorting、resizing、columnMoving、cellEditing）
 * 已移至 LayoutConfig 中，实现表格和列的统一配置。
 *
 * 配置优先级：列配置 > 表格配置 > 默认配置
 */
export interface FeatureConfig {
  // ========== 表格特有功能 ==========
  /** 是否允许拖动固定列（pinned columns） */
  allowPinnedColumnMoving?: boolean

  // ========== 选择和编辑 ==========
  /** 是否启用复制粘贴 */
  clipboard?: boolean

  // ========== 导出和打印 ==========
  /** 是否启用导出功能 */
  export?: boolean
  /** 是否启用全屏模式 */
  fullScreen?: boolean

  // ========== 滚动和分页 ==========
  /** 是否启用分页 */
  pagination?: boolean
}

// ==================== 列配置 ====================

/**
 * 列配置
 *
 * 定义表格中每一列的配置选项。
 * 支持列级别的功能控制，可以覆盖全局配置。
 *
 * 配置优先级：列配置 > 全局配置 > 默认配置
 */
export interface GridColumn {
  // ========== 基础属性 ==========
  // 列对应的数据字段名（必填）
  field: string
  // 列标题（显示在表头）
  headerName?: string
  // 列类型（影响默认配置和渲染方式）
  type?: ColumnType

  // ========== 布局控制 ==========
  // 列固定位置（左侧或右侧）
  pinned?: 'left' | 'right'
  // 是否隐藏列
  hidden?: boolean
  // 是否禁用列
  disabled?: boolean

  // ========== 样式配置 ==========
  // 样式与类名统一通过 layout 管理（LayoutConfig.cellStyle/headerStyle/cellClass/headerClass）

  // ========== 渲染和编辑 ==========
  // 自定义渲染器（组件名或函数）
  cellRenderer?: string | ((params: any) => any)
  // 自定义编辑器（组件名或函数）
  cellEditor?: string | ((params: any) => any)
  // 值格式化器（用于显示格式化）
  valueFormatter?: (params: any) => string
  // 值解析器（用于编辑时解析）
  valueParser?: (params: any) => any
  // 编辑完成回调
  onCellValueChanged?: (params: { oldValue: any; newValue: any; data: any; field: string }) => void

  // ========== 单元格合并（跨列/跨行） ==========
  /**
   * 向右合并列数量（列跨越）。
   * - 数字：表示额外向右合并的列数量（0 表示不合并；1 表示跨 2 列（当前列 + 右侧1列））。
   * - 函数：根据单元格上下文动态返回合并数量（同上，返回额外数量）。
   */
  mergeRight?: number | ((params: any) => number)
  /**
   * 向下合并（行跨越）。
   * - 布尔：true 表示按值相同进行连续合并；false 不合并。
   * - 函数：自定义合并判定，返回 true 表示当前与下一行合并。
   *   回调签名示例：(ctx) => boolean，其中 ctx 包含 value/currentRow/nextRow 等信息。
   */
  mergeDown?: boolean | ((ctx: any) => boolean)

  // ========== 表头合并（列组） ==========
  /**
   * 表头合并配置。
   * - 字符串：列组名称，相同名称的列会被合并到同一个表头组下。
   * - 对象：详细的表头合并配置。
   */
  headerGroup?:
    | string
    | {
        /** 列组名称 */
        name: string
        /** 列组标题（可选，默认使用 name） */
        title?: string
        /** 列组样式类名 */
        className?: string
        /** 列组样式 */
        style?: Record<string, any>
      }

  // ========== 筛选配置 ==========
  // 过滤器类型（如 'agTextColumnFilter'）
  filter?: string
  // 过滤器参数
  filterParams?: Record<string, any>
  // 筛选值获取器（用于筛选时转换值）
  filterValueGetter?: (params: any) => any

  // ========== 扩展配置 ==========
  // 其他 AG Grid 列属性（直接传递给 AG Grid）
  props?: Record<string, any>
  // 列级布局配置（可以覆盖表格级别的默认配置）
  layout?: LayoutConfig
}

// ==================== 分页配置 ====================

/* 分页配置 */
export interface PaginationConfig {
  /** 是否启用分页功能 */
  enabled?: boolean
  /** 每页显示的数据条数 */
  pageSize?: number
  /** 分页大小选择器的选项数组 */
  pageSizeOptions?: number[]
  /** 是否显示每页大小选择器 */
  showPageSizeSelector?: boolean
}

// ==================== 选择配置 ====================

/* 选择配置 */
export interface SelectionConfig {
  /** 选择模式（多选、单选） */
  mode?: 'multiRow' | 'singleRow'
  /** 是否显示复选框（用于多选） */
  checkboxes?: boolean
  /** 是否显示表头复选框（全选/取消全选） */
  headerCheckbox?: boolean
  /** 是否启用点击行选择 */
  clickToSelect?: boolean
  /** 是否启用键盘选择 */
  keyboardToSelect?: boolean
  /** 是否固定列 */
  pinned?: 'left' | 'right'
}

// ==================== 导出配置 ====================

/**
 * 导出配置
 *
 * 控制表格的数据导出功能。
 */
export interface ExportConfig {
  /** 是否启用 CSV 导出 */
  csv?: boolean
  /** 是否启用 Excel 导出（需要企业版） */
  excel?: boolean
  /** 默认导出文件名 */
  fileName?: string
  /** 导出参数（传递给 AG Grid 的导出 API） */
  params?: CsvExportParams
}

// ==================== 无限滚动配置 ====================

/**
 * 无限滚动配置
 *
 * 控制表格的无限滚动功能。
 * 当用户滚动接近底部时触发加载更多数据的事件。
 */
export interface InfiniteScrollConfig {
  /** 是否启用无限滚动 */
  enabled?: boolean
  /** 触发加载的阈值（距离底部的像素数） */
  threshold?: number
  /** 滚动触底事件回调 */
  onScrollToBottom?: (event: { api: GridApi; columnApi: any }) => void
  /** 是否在加载中显示加载状态 */
  showLoadingIndicator?: boolean
  /** 加载状态文本 */
  loadingText?: string
}

/* API */
export interface GridTableApi {
  // url
  url?: string
  // 方法
  method?: 'get' | 'post'
  // 请求头
  headers?: Record<string, string>
  // 请求参数
  params?: Record<string, string>
}

// ==================== GridTable 配置 ====================

/**
 * GridTable 主配置
 *
 * 这是 GridTable 组件的核心配置接口，包含了表格的所有配置选项。
 * 用户通过传入这个配置对象来控制表格的行为和外观。
 */
export interface GridTableConfig {
  /* API */
  api?: GridTableApi
  /** 列配置数组（必填） */
  columns: GridColumn[]
  /** 表格数据数组（可选，infinite 行模型不需要） */
  data?: any[]
  /** 表级布局配置（视觉项 + 行为默认） */
  layout?: TableLayoutConfig
  /** 功能配置 */
  features?: FeatureConfig
  /** 分页配置 */
  pagination?: PaginationConfig
  /** 选择配置 */
  selection?: SelectionConfig
  /** 导出配置 */
  export?: ExportConfig
  /** 无限滚动配置 */
  infiniteScroll?: InfiniteScrollConfig
  /** 自定义组件注册表 */
  components?: Record<string, any>
  /** 其他 AG Grid 选项（直接传递给 AG Grid） */
  gridOptions?: Partial<GridOptions>
}

// ==================== GridTable 组件 Props ====================

/**
 * GridTable 组件 Props
 *
 * 定义了 GridTable Vue 组件接收的所有属性。
 */
export interface GridTableProps {
  /** 表格配置对象（必填） */
  config: GridTableConfig
  /** 表格数据（支持 v-model） */
  modelValue?: any[]
  /** 是否禁用表格 */
  disabled?: boolean
  /** 是否显示加载状态 */
  loading?: boolean
  /** 自定义内联样式 */
  style?: Record<string, string>
  /** 自定义 CSS 类名 */
  class?: string
}

/**
 * GridTable 组件默认 Props
 *
 * 用于 withDefaults 的默认值类型定义。
 */
export interface GridTableDefaultProps {
  /** 默认表格数据 */
  modelValue: () => any[]
  /** 默认不禁用 */
  disabled: boolean
  /** 默认不显示加载状态 */
  loading: boolean
}

/**
 * GridTable 暴露的 API
 *
 * 定义了 GridTable 组件通过 defineExpose 暴露给父组件的方法和属性。
 * 父组件可以通过 ref 访问这些 API。
 */
export interface GridTableExpose {
  /** AG Grid API 实例 */
  gridApi: GridApi | null
  /** AG Grid 列 API 实例 */
  columnApi: any | null

  // ========== 基础操作 ==========
  /** 刷新所有单元格 */
  refreshCells: () => void
  /** 调整列宽适应容器 */
  sizeColumnsToFit: () => void
  /** 自动调整所有列宽 */
  autoSizeAll: (skipHeader?: boolean) => void
  /** 导出 CSV 文件 */
  exportCsv: (params?: CsvExportParams) => void

  // ========== 选择操作 ==========
  /** 获取选中的行节点 */
  getSelectedRows: () => any[]
  /** 获取选中的行数据 */
  getSelectedData: () => any[]
  /** 设置选中的行 */
  setSelectedRows: (rows: any[]) => void
  /** 清除所有选择 */
  clearSelection: () => void

  // ========== 数据操作 ==========
  /** 刷新表格数据 */
  refreshData: () => void
  /** 更新表格数据 */
  updateData: (data: any[]) => void
}

// ==================== 主题配置 ====================

/**
 * 主题配置参数
 *
 * 定义了传递给 AG Grid Quartz 主题的参数。
 * 这些参数控制表格的视觉样式，包括颜色、字体、间距等。
 */
export interface ThemeParams {
  /** 主题间距值（控制表格密度） */
  spacing: number
  /** 强调色 */
  accentColor: string
  /** 表头背景色 */
  headerBackgroundColor: string
  /** 表头字体大小 */
  headerFontSize: string
  /** 表头文字颜色 */
  headerTextColor: string
  /** 表格背景色 */
  backgroundColor: string
  /** 浏览器颜色方案 */
  browserColorScheme: 'dark' | 'light'
  /** 前景色（文字颜色） */
  foregroundColor: string
  /** 字体大小 */
  fontSize: string
  /** 边框颜色 */
  borderColor: string
  /** 奇数行背景色（可选）。若未提供，则由 zebra/zebraColor 控制 */
  oddRowBackgroundColor?: string
  /** 斑马纹基础颜色（我们自定义，用于 zebraColor 未传时作为回退色） */
  zebraBaseColor?: string
}

/**
 * 网格选项构建钩子
 *
 * 定义了 AG Grid 事件处理函数的类型。
 * 用于在构建 GridOptions 时注册事件监听器。
 */
export interface GridOptionsHooks {
  /** 网格准备就绪事件 */
  onGridReady?: (event: GridReadyEvent) => void
  /** 选择变化事件 */
  onSelectionChanged?: (event: any) => void
  /** 行点击事件 */
  onRowClicked?: (event: any) => void
  /** 单元格点击事件 */
  onCellClicked?: (event: any) => void
  /** 排序变化事件 */
  onSortChanged?: (event: any) => void
  /** 过滤变化事件 */
  onFilterChanged?: (event: any) => void
  /** 滚动事件 */
  onBodyScroll?: (event: any) => void
  /** 滚动触底事件 */
  onScrollToBottom?: (event: { api: GridApi; columnApi: any }) => void
}

// ==================== 国际化类型 ====================

/**
 * 国际化文本映射
 *
 * 定义了 AG Grid 中所有需要国际化的文本键值对。
 * 这些文本会显示在分页器、过滤器、侧边栏等 UI 组件中。
 */
export interface LocaleTextMap {
  // ========== 通用文本 ==========
  /** 页面 */
  page: string
  /** 更多 */
  more: string
  /** 到 */
  to: string
  /** 的 */
  of: string
  /** 下一页 */
  next: string
  /** 最后一页 */
  last: string
  /** 第一页 */
  first: string
  /** 上一页 */
  previous: string
  /** 加载中 */
  loadingOoo: string

  // ========== 分页相关 ==========
  /** 每页大小选择器标签 */
  pageSizeSelectorLabel: string
  /** 显示 */
  showing: string
  /** 项目 */
  items: string
  /** 总计 */
  total: string

  // ========== 过滤相关 ==========
  /** 过滤占位符 */
  filterOoo: string
  /** 应用过滤 */
  applyFilter: string
  /** 清除过滤 */
  clearFilter: string
  /** 等于 */
  equals: string
  /** 不等于 */
  notEqual: string
  /** 包含 */
  contains: string
  /** 不包含 */
  notContains: string
  /** 开始于 */
  startsWith: string
  /** 结束于 */
  endsWith: string
  /** 之前 */
  before: string
  /** 之后 */
  after: string
  /** 范围 */
  between: string
  /** 范围内 */
  inRange: string
  /** 空白 */
  blank: string
  /** 非空白 */
  notBlank: string
  /** 小于 */
  lessThan: string
  /** 小于等于 */
  lessThanOrEqual: string
  /** 大于 */
  greaterThan: string
  /** 大于等于 */
  greaterThanOrEqual: string
  /** 且条件 */
  andCondition: string
  /** 或条件 */
  orCondition: string

  // ========== 侧边栏/列相关 ==========
  /** 列 */
  columns: string
  /** 过滤器 */
  filters: string

  // ========== 表格无数据提示 ==========
  /** 表格无数据提示 */
  noRowsToShow: string
  /** 表格无数据提示 */
  noDataAvailable: string
}
