// @/components/grid-table/utils/types.ts
/**
 * GridTable 类型定义 —— 供 GridTable 全模块共享
 *
 * 目标：严格且贴近 AG Grid API，对 GridTable 有 TS 推断提示。
 * 仿照 SchemaForm 的设计模式，提供友好的配置方式。
 */

import type { CsvExportParams, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community'

// ==================== 基础类型 ====================

/** 主题名称 */
export type ThemeName = 'quartz'

/** 文本对齐方式 */
export type TextAlign = 'left' | 'center' | 'right'

/** 列类型 */
export type ColumnType =
  | 'text' // 文本列
  | 'number' // 数字列
  | 'date' // 日期列
  | 'boolean' // 布尔列
  | 'select' // 选择列
  | 'actions' // 操作列
  | 'custom' // 自定义列

// ==================== 样式配置 ====================

/** 样式配置 */
export interface StyleConfig {
  /** 自定义 class */
  class?: string
  /** 自定义样式 */
  style?: Record<string, string>
}

/** 文本样式配置 */
export interface TextStyleConfig extends StyleConfig {
  /** 文本对齐方式 */
  textAlign?: TextAlign
  /** 字体大小 */
  fontSize?: string
  /** 字体粗细 */
  fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder' | number
  /** 字体颜色 */
  color?: string
}

// ==================== 布局配置 ====================

/** 布局配置 */
export interface LayoutConfig {
  /** 表格高度 */
  height?: string
  /** 表格宽度 */
  width?: string
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示斑马纹 */
  striped?: boolean
  /** 是否显示悬停效果 */
  hoverable?: boolean
  /** 行高 */
  rowHeight?: number
  /** 表头高度 */
  headerHeight?: number
}

// ==================== 列配置 ====================

/** 列配置 */
export interface GridColumn {
  /** 字段名 */
  field: string
  /** 列标题 */
  headerName?: string
  /** 列类型 */
  type?: ColumnType
  /** 列宽度 */
  width?: number
  /** 最小宽度 */
  minWidth?: number
  /** 最大宽度 */
  maxWidth?: number
  /** 是否可调整大小 */
  resizable?: boolean
  /** 是否可排序 */
  sortable?: boolean
  /** 是否可过滤 */
  filterable?: boolean
  /** 是否固定 */
  pinned?: 'left' | 'right'
  /** 文本对齐方式 */
  textAlign?: TextAlign
  /** 是否隐藏 */
  hidden?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 帮助文本 */
  help?: string
  /** 列样式配置 */
  style?: TextStyleConfig
  /** 列头样式配置 */
  headerStyle?: StyleConfig
  /** 单元格样式配置 */
  cellStyle?: StyleConfig
  /** 自定义渲染器 */
  cellRenderer?: string | ((params: any) => any)
  /** 自定义编辑器 */
  cellEditor?: string | ((params: any) => any)
  /** 值格式化器 */
  valueFormatter?: (params: any) => string
  /** 值解析器 */
  valueParser?: (params: any) => any
  /** 过滤器类型 */
  filter?: string
  /** 过滤器参数 */
  filterParams?: Record<string, any>
  /** 其他 AG Grid 列属性 */
  props?: Record<string, any>
}

// ==================== 分页配置 ====================

/** 分页配置 */
export interface PaginationConfig {
  /** 是否启用分页 */
  enabled?: boolean
  /** 每页大小 */
  pageSize?: number
  /** 每页大小选项 */
  pageSizeOptions?: number[]
  /** 是否显示每页大小选择器 */
  showPageSizeSelector?: boolean
  /** 是否显示页面信息 */
  showPageInfo?: boolean
}

// ==================== 选择配置 ====================

/** 选择配置 */
export interface SelectionConfig {
  /** 选择模式 */
  mode?: 'single' | 'multiple' | 'singleRow' | 'multiRow'
  /** 是否显示复选框 */
  checkboxes?: boolean
  /** 是否显示表头复选框 */
  headerCheckbox?: boolean
  /** 是否启用点击选择 */
  clickToSelect?: boolean
  /** 是否启用键盘选择 */
  keyboardToSelect?: boolean
}

// ==================== 导出配置 ====================

/** 导出配置 */
export interface ExportConfig {
  /** 是否启用 CSV 导出 */
  csv?: boolean
  /** 是否启用 Excel 导出 */
  excel?: boolean
  /** 默认文件名 */
  fileName?: string
  /** 导出参数 */
  params?: CsvExportParams
}

// ==================== GridTable 配置 ====================

/** GridTable 配置 */
export interface GridTableConfig {
  /** 列配置 */
  columns: GridColumn[]
  /** 行数据 */
  data: any[]
  /** 布局配置 */
  layout?: LayoutConfig
  /** 分页配置 */
  pagination?: PaginationConfig
  /** 选择配置 */
  selection?: SelectionConfig
  /** 导出配置 */
  export?: ExportConfig
  /** 自定义组件 */
  components?: Record<string, any>
  /** 其他 AG Grid 选项 */
  gridOptions?: Partial<GridOptions>
}

// ==================== GridTable 组件 Props ====================

/** GridTable 组件 Props */
export interface GridTableProps {
  /** 表格配置 */
  config: GridTableConfig
  /** 表格数据 */
  modelValue?: any[]
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 空数据文本 */
  emptyText?: string
  /** 自定义样式 */
  style?: Record<string, string>
  /** 自定义类名 */
  class?: string
}

/** GridTable 组件默认 Props */
export interface GridTableDefaultProps {
  modelValue: () => any[]
  disabled: boolean
  loading: boolean
  emptyText: string
}

/** GridTable 暴露的 API */
export interface GridTableExpose {
  /** AG Grid API */
  gridApi: GridApi | null
  /** 列 API */
  columnApi: any | null
  /** 刷新单元格 */
  refreshCells: () => void
  /** 调整列宽适应容器 */
  sizeColumnsToFit: () => void
  /** 自动调整所有列宽 */
  autoSizeAll: (skipHeader?: boolean) => void
  /** 导出 CSV */
  exportCsv: (params?: CsvExportParams) => void
  /** 获取选中行 */
  getSelectedRows: () => any[]
  /** 获取选中行数据 */
  getSelectedData: () => any[]
  /** 设置选中行 */
  setSelectedRows: (rows: any[]) => void
  /** 清除选择 */
  clearSelection: () => void
  /** 刷新数据 */
  refreshData: () => void
  /** 更新数据 */
  updateData: (data: any[]) => void
}

// ==================== 主题配置 ====================

/** 主题配置参数 */
export interface ThemeParams {
  spacing: number
  accentColor: string
  headerBackgroundColor: string
  headerFontSize: string
  headerTextColor: string
  backgroundColor: string
  browserColorScheme: 'dark' | 'light'
  foregroundColor: string
  fontSize: string
  borderColor: string
  oddRowBackgroundColor: string
}

/** 网格选项构建钩子 */
export interface GridOptionsHooks {
  onGridReady?: (event: GridReadyEvent) => void
  onSelectionChanged?: (event: any) => void
  onRowClicked?: (event: any) => void
  onCellClicked?: (event: any) => void
  onSortChanged?: (event: any) => void
  onFilterChanged?: (event: any) => void
}

// ==================== 国际化类型 ====================

/** 国际化文本映射 */
export interface LocaleTextMap {
  // 通用
  page: string
  more: string
  to: string
  of: string
  next: string
  last: string
  first: string
  previous: string
  loadingOoo: string

  // 分页
  pageSizeSelectorLabel: string
  showing: string
  items: string
  total: string

  // 过滤
  filterOoo: string
  applyFilter: string
  clearFilter: string
  equals: string
  notEqual: string
  contains: string
  notContains: string
  startsWith: string
  endsWith: string
  blank: string
  notBlank: string
  lessThan: string
  lessThanOrEqual: string
  greaterThan: string
  greaterThanOrEqual: string
  andCondition: string
  orCondition: string

  // 侧边栏/列
  columns: string
  filters: string
}

// ==================== 使用示例 ====================

/**
 * GridTable 配置使用示例：
 *
 * // 基础配置
 * const config: GridTableConfig = {
 *   columns: [
 *     {
 *       field: 'id',
 *       headerName: 'ID',
 *       type: 'number',
 *       width: 80,
 *       pinned: 'left',
 *       textAlign: 'center'
 *     },
 *     {
 *       field: 'name',
 *       headerName: '姓名',
 *       type: 'text',
 *       width: 120,
 *       sortable: true,
 *       filterable: true,
 *       style: {
 *         textAlign: 'left',
 *         fontWeight: 'bold'
 *       }
 *     },
 *     {
 *       field: 'actions',
 *       headerName: '操作',
 *       type: 'actions',
 *       width: 120,
 *       pinned: 'right',
 *       cellRenderer: 'actionButtons'
 *     }
 *   ],
 *   data: userData,
 *   layout: {
 *     height: '500px',
 *     bordered: true,
 *     striped: true,
 *     hoverable: true
 *   },
 *   pagination: {
 *     enabled: true,
 *     pageSize: 10,
 *     pageSizeOptions: [5, 10, 20, 50]
 *   },
 *   selection: {
 *     mode: 'multiple',
 *     checkboxes: true
 *   },
 *   toolbar: {
 *     enabled: true,
 *     position: 'top',
 *     items: [
 *       { type: 'button', label: '刷新', icon: 'pi pi-refresh', onClick: handleRefresh },
 *       { type: 'button', label: '导出', icon: 'pi pi-download', onClick: handleExport },
 *       { type: 'separator' },
 *       { type: 'button', label: '新增', icon: 'pi pi-plus', onClick: handleAdd }
 *     ]
 *   }
 * }
 *
 * // 使用组件
 * <GridTable :config="config" v-model="tableData" />
 *
 * 优先级：列配置 > 全局配置 > 默认配置
 */
