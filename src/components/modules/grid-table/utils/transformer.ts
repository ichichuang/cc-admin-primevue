// @/components/grid-table/utils/transformer.ts
/**
 * GridTable 配置转换器
 * 将友好的配置转换为 AG Grid 原生配置
 */

import type { ColDef, GridOptions } from 'ag-grid-community'
import type {
  ExportConfig,
  GridColumn,
  GridTableConfig,
  LayoutConfig,
  PaginationConfig,
  SelectionConfig,
  TextAlign,
} from './types'

// ==================== 文本对齐转换 ====================

const textAlignMap: Record<TextAlign, string> = {
  left: 'left',
  center: 'center',
  right: 'right',
}

// ==================== 列类型转换 ====================

const columnTypeMap: Record<string, Partial<ColDef>> = {
  text: {
    filter: 'agTextColumnFilter',
    sortable: true,
  },
  number: {
    filter: 'agNumberColumnFilter',
    sortable: true,
    valueFormatter: params => params.value?.toLocaleString() || '',
  },
  date: {
    filter: 'agDateColumnFilter',
    sortable: true,
    valueFormatter: (params: any) => {
      if (!params.value) {
        return ''
      }
      return new Date(params.value).toLocaleDateString('zh-CN')
    },
  },
  boolean: {
    filter: 'agTextColumnFilter', // 使用社区版过滤器
    cellRenderer: (params: any) => (params.value ? '是' : '否'),
  },
  select: {
    filter: 'agTextColumnFilter', // 使用社区版过滤器
  },
  actions: {
    sortable: false,
    filter: false, // 不使用过滤器
    resizable: false,
    suppressHeaderMenuButton: true, // 修复：使用正确的属性名
    cellStyle: { textAlign: 'center' },
  },
  custom: {},
}

// ==================== 列配置转换器 ====================

export function transformColumn(column: GridColumn): ColDef {
  const baseColDef: ColDef = {
    field: column.field,
    headerName: column.headerName || column.field,
    width: column.width,
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
    resizable: column.resizable ?? true,
    sortable: column.sortable ?? false,
    filter: column.filterable ? column.filter || 'agTextColumnFilter' : false,
    pinned: column.pinned,
    hide: column.hidden ?? false,
    suppressHeaderMenuButton: column.disabled ?? false,
    ...column.props,
  }

  // 应用列类型配置
  if (column.type && columnTypeMap[column.type]) {
    Object.assign(baseColDef, columnTypeMap[column.type])
  }

  // 应用文本对齐
  if (column.textAlign) {
    baseColDef.cellStyle = {
      ...baseColDef.cellStyle,
      textAlign: textAlignMap[column.textAlign],
    }
  }

  // 应用样式配置
  if (column.style) {
    const cellStyle: Record<string, any> = { ...baseColDef.cellStyle }

    if (column.style.textAlign) {
      cellStyle.textAlign = textAlignMap[column.style.textAlign]
    }
    if (column.style.fontSize) {
      cellStyle.fontSize = column.style.fontSize
    }
    if (column.style.fontWeight) {
      cellStyle.fontWeight = column.style.fontWeight
    }
    if (column.style.color) {
      cellStyle.color = column.style.color
    }
    if (column.style.class) {
      baseColDef.cellClass = column.style.class
    }
    if (column.style.style) {
      Object.assign(cellStyle, column.style.style)
    }

    baseColDef.cellStyle = cellStyle
  }

  // 应用列头样式
  if (column.headerStyle) {
    if (column.headerStyle.class) {
      baseColDef.headerClass = column.headerStyle.class
    }
    if (column.headerStyle.style) {
      baseColDef.headerStyle = column.headerStyle.style
    }
  }

  // 应用单元格样式
  if (column.cellStyle) {
    if (column.cellStyle.class) {
      baseColDef.cellClass = column.cellStyle.class
    }
    if (column.cellStyle.style) {
      baseColDef.cellStyle = {
        ...baseColDef.cellStyle,
        ...column.cellStyle.style,
      }
    }
  }

  // 应用自定义渲染器
  if (column.cellRenderer) {
    baseColDef.cellRenderer = column.cellRenderer
  }

  // 应用自定义编辑器
  if (column.cellEditor) {
    baseColDef.cellEditor = column.cellEditor
  }

  // 应用值格式化器
  if (column.valueFormatter) {
    baseColDef.valueFormatter = column.valueFormatter
  }

  // 应用值解析器
  if (column.valueParser) {
    baseColDef.valueParser = column.valueParser
  }

  // 应用过滤器参数
  if (column.filterParams) {
    baseColDef.filterParams = column.filterParams
  }

  return baseColDef
}

// ==================== 布局配置转换器 ====================

export function transformLayout(layout?: LayoutConfig): Partial<GridOptions> {
  if (!layout) {
    return {}
  }

  const gridOptions: Partial<GridOptions> = {}

  if (layout.height) {
    gridOptions.domLayout = 'normal'
  }

  if (layout.rowHeight) {
    gridOptions.rowHeight = layout.rowHeight
  }

  if (layout.headerHeight) {
    gridOptions.headerHeight = layout.headerHeight
  }

  if (layout.bordered) {
    gridOptions.suppressColumnVirtualisation = true
  }

  if (layout.striped) {
    const rowClassRules: Record<string, (params: any) => boolean> = {}
    rowClassRules['ag-row-even'] = (params: any) => (params.node?.rowIndex ?? 0) % 2 === 0
    rowClassRules['ag-row-odd'] = (params: any) => (params.node?.rowIndex ?? 0) % 2 === 1
    gridOptions.rowClassRules = rowClassRules
  }

  if (layout.hoverable) {
    gridOptions.suppressRowHoverHighlight = false
  }

  return gridOptions
}

// ==================== 分页配置转换器 ====================

export function transformPagination(pagination?: PaginationConfig): Partial<GridOptions> {
  if (!pagination || !pagination.enabled) {
    return {}
  }

  const gridOptions: Partial<GridOptions> = {
    pagination: true,
    paginationPageSize: pagination.pageSize || 10,
    paginationPageSizeSelector: pagination.showPageSizeSelector
      ? pagination.pageSizeOptions || [5, 10, 20, 50]
      : false,
  }

  return gridOptions
}

// ==================== 选择配置转换器 ====================

export function transformSelection(selection?: SelectionConfig): Partial<GridOptions> {
  if (!selection) {
    return {}
  }

  const gridOptions: Partial<GridOptions> = {
    rowSelection: {
      mode: selection.mode === 'multiple' ? 'multiRow' : 'singleRow',
      enableClickSelection: selection.clickToSelect ?? true,
    },
  }

  if (selection.checkboxes) {
    gridOptions.rowSelection = {
      mode: 'multiRow',
      enableClickSelection: false,
    }
  }

  // 注意：headerCheckbox 不是有效的 gridOptions 属性，需要在列定义中处理

  return gridOptions
}

// ==================== 导出配置转换器 ====================

export function transformExport(exportConfig?: ExportConfig): Partial<GridOptions> {
  if (!exportConfig) {
    return {}
  }

  const gridOptions: Partial<GridOptions> = {}

  if (exportConfig.csv) {
    gridOptions.suppressCsvExport = false
    if (exportConfig.params) {
      gridOptions.defaultCsvExportParams = exportConfig.params
    }
  } else {
    gridOptions.suppressCsvExport = true
  }

  if (exportConfig.excel) {
    gridOptions.suppressExcelExport = false
  } else {
    gridOptions.suppressExcelExport = true
  }

  return gridOptions
}

// ==================== 主转换器 ====================

export function transformGridConfig(config: GridTableConfig): {
  columnDefs: ColDef[]
  gridOptions: GridOptions
  components: Record<string, any>
} {
  // 转换列配置
  const columnDefs = config.columns.map(transformColumn)

  // 转换各种配置
  const layoutOptions = transformLayout(config.layout)
  const paginationOptions = transformPagination(config.pagination)
  const selectionOptions = transformSelection(config.selection)
  const exportOptions = transformExport(config.export)

  // 合并 GridOptions
  const gridOptions: GridOptions = {
    // 默认配置
    animateRows: true,
    suppressRowHoverHighlight: false,
    enableCellTextSelection: true,
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      sortable: true,
      filter: true,
      resizable: true,
    },
    // 合并用户配置
    ...layoutOptions,
    ...paginationOptions,
    ...selectionOptions,
    ...exportOptions,
    // 用户自定义配置（优先级最高）
    ...config.gridOptions,
  }

  // 移除过时的配置选项
  if (gridOptions.enableRangeSelection) {
    delete gridOptions.enableRangeSelection
    // 不设置 cellSelection，因为需要企业版模块
  }
  if (gridOptions.suppressRowClickSelection !== undefined) {
    delete gridOptions.suppressRowClickSelection
  }
  if (gridOptions.suppressRowDeselection !== undefined) {
    delete gridOptions.suppressRowDeselection
  }
  if (gridOptions.cellSelection) {
    delete gridOptions.cellSelection // 移除，因为需要企业版模块
  }

  return {
    columnDefs,
    gridOptions,
    components: config.components || {},
  }
}

// ==================== 工具函数 ====================

export function createDefaultColumn(field: string, headerName?: string): GridColumn {
  return {
    field,
    headerName: headerName || field,
    type: 'text',
    width: 120,
    sortable: true,
    filterable: true,
  }
}

export function createActionColumn(renderer: string = 'actionButtons'): GridColumn {
  return {
    field: 'actions',
    headerName: '操作',
    type: 'actions',
    width: 120,
    pinned: 'right',
    resizable: false,
    sortable: false,
    filterable: false,
    cellRenderer: renderer,
  }
}

export function createIdColumn(field: string = 'id', headerName: string = 'ID'): GridColumn {
  return {
    field,
    headerName,
    type: 'number',
    width: 80,
    pinned: 'left',
    textAlign: 'center',
    style: {
      fontWeight: 'bold',
    },
  }
}
