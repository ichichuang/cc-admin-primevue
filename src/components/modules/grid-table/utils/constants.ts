import type { GridTableConfig, GridTableDefaultProps } from './types'

/**
 * GridTable 默认配置
 */
export const GRID_TABLE_DEFAULT_PROPS: GridTableDefaultProps = {
  modelValue: () => [],
  disabled: false,
  loading: false,
  emptyText: '暂无数据',
}

/**
 * GridTable 默认配置对象
 */
export const GRID_TABLE_DEFAULT_CONFIG: Partial<GridTableConfig> = {
  layout: {
    height: '100%',
    width: '100%',
    bordered: true,
    striped: true,
    hoverable: true,
  },
  pagination: {
    enabled: true,
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
    showPageSizeSelector: true,
    showPageInfo: true,
  },
  selection: {
    mode: 'single',
    checkboxes: false,
    headerCheckbox: false,
    clickToSelect: true,
    keyboardToSelect: true,
  },
  export: {
    csv: true,
    excel: false,
    fileName: '数据导出',
  },
}

/**
 * 默认容器尺寸
 */
export const DEFAULT_CONTAINER_SIZE = {
  height: '100%',
  width: '100%',
} as const

/**
 * 默认网格选项基础配置
 */
export const DEFAULT_GRID_OPTIONS = {
  suppressDragLeaveHidesColumns: true,
  rowSelection: { mode: 'singleRow' } as any,
  animateRows: true,
  enableCellTextSelection: true,
  suppressRowHoverHighlight: false,
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,
    resizable: true,
  },
} as const

/**
 * 列类型默认配置
 */
export const COLUMN_TYPE_DEFAULTS = {
  text: {
    filter: 'agTextColumnFilter',
    sortable: true,
  },
  number: {
    filter: 'agNumberColumnFilter',
    sortable: true,
    valueFormatter: (params: any) => params.value?.toLocaleString() || '',
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
} as const

/**
 * 主题间距配置
 */
export const THEME_SPACING = {
  compact: 6,
  comfortable: 8,
  spacious: 10,
} as const

/**
 * 滚动条样式配置
 */
export const SCROLLBAR_STYLES = {
  webkit: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    trackBackgroundColor: 'transparent',
  },
  firefox: {
    width: 'thin',
  },
} as const
