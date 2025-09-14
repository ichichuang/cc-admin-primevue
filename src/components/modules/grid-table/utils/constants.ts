import type { GridTableConfig, GridTableDefaultProps } from './types'

/**
 * GridTable 组件默认 Props
 *
 * 这些是 GridTable 组件的默认属性值，当用户没有提供相应属性时使用。
 * 主要用于 withDefaults 的默认值设置。
 */
export const GRID_TABLE_DEFAULT_PROPS: GridTableDefaultProps = {
  /** 默认表格数据为空数组 */
  modelValue: () => [],
  /** 默认不禁用表格 */
  disabled: false,
  /** 默认不显示加载状态 */
  loading: false,
}

/**
 * GridTable 默认配置对象
 *
 * 这是 GridTable 的完整默认配置，包含所有可配置项的默认值。
 * 用户可以通过传入 config 对象来覆盖这些默认值。
 *
 * 配置优先级：用户配置 > 此默认配置
 */
export const GRID_TABLE_DEFAULT_CONFIG: Partial<GridTableConfig> = {
  /** 布局配置默认值 */
  layout: {
    /** 默认表格高度占满父容器 */
    height: '100%',
    /** 默认表格宽度占满父容器 */
    width: '100%',
    /** 默认不显示斑马纹 */
    zebra: 'none',
    /** 默认无自定义斑马纹颜色（不强设颜色，走主题样式） */
    zebraColor: undefined,
    /** 默认显示横向分割线（行线） */
    horizontalLines: true,
    /** 默认显示纵向分割线（列线） */
    verticalLines: true,
    /** 默认禁用选中单元格边框高亮 */
    selectedCellBorderHighlight: false,
    /** 默认禁用选中单元格背景高亮 */
    selectedCellBackgroundHighlight: false,
    /** 统一配置（表格级别的默认值） */
    layout: {
      /** 默认禁用筛选功能 */
      filtering: false,
      /** 默认启用排序功能 */
      sorting: true,
      /** 默认启用列调整大小 */
      resizing: true,
      /** 默认禁用列移动（避免误操作） */
      columnMoving: false,
      /** 默认禁用单元格编辑（需要明确启用） */
      cellEditing: false,
      /** 默认不限制最小/最大宽度（0 表示不限制） */
      minWidth: 0,
      maxWidth: 0,
      /** 默认文字对齐（未指定列时生效） */
      textAlign: 'center',
      /** 默认表头文字对齐（未指定列时生效） */
      headerTextAlign: 'center',
    },
  },

  /** 功能配置默认值 */
  features: {
    // ========== 表格特有功能 ==========
    /** 默认不允许拖动固定列 */
    allowPinnedColumnMoving: false,

    // ========== 选择和编辑 ==========
    /** 默认启用复制粘贴 */
    clipboard: true,

    // ========== 导出和打印 ==========
    /** 默认启用导出功能 */
    export: true,
    /** 默认禁用全屏模式 */
    fullScreen: false,

    // ========== 滚动和分页 ==========
    /** 默认启用分页 */
    pagination: true,
  },

  /** 分页配置默认值 */
  pagination: {
    /** 默认启用分页 */
    enabled: false,
    /** 默认每页显示 10 条数据 */
    pageSize: 10,
    /** 默认分页大小选项 */
    pageSizeOptions: [5, 10, 20, 50],
    /** 默认显示分页大小选择器 */
    showPageSizeSelector: true,
  },

  /** 选择配置默认值 */
  selection: {
    /** 默认单选模式 */
    mode: 'singleRow',
    /** 默认不显示复选框 */
    checkboxes: false,
    /** 默认不显示表头复选框 */
    headerCheckbox: false,
    /** 默认启用点击选择 */
    clickToSelect: true,
    /** 默认启用键盘选择 */
    keyboardToSelect: true,
    /** 默认固定列到左侧 */
    pinned: 'left',
  },

  /** 导出配置默认值 */
  export: {
    /** 默认启用 CSV 导出 */
    csv: true,
    /** 默认禁用 Excel 导出（需要企业版） */
    excel: false,
    /** 默认导出文件名 */
    fileName: '数据导出',
  },
}

/**
 * 默认容器尺寸配置
 *
 * 用于设置 GridTable 容器的默认尺寸。
 * 这些值会在没有明确指定容器尺寸时使用。
 */
export const DEFAULT_CONTAINER_SIZE = {
  /** 默认容器高度占满父元素 */
  height: '100%',
  /** 默认容器宽度占满父元素 */
  width: '100%',
} as const

/**
 * 默认 AG Grid 选项配置
 *
 * 这些是直接传递给 AG Grid 的基础配置选项。
 * 这些配置会与用户配置合并，形成最终的 GridOptions。
 */
export const DEFAULT_GRID_OPTIONS = {
  /** 防止拖拽离开时隐藏列 */
  suppressDragLeaveHidesColumns: true,
  /** 启用行动画效果 */
  animateRows: true,
  /** 启用单元格文本选择 */
  enableCellTextSelection: true,
  /** 不禁用行悬停高亮 */
  suppressRowHoverHighlight: false,
  /** 默认禁用行选择（除非明确启用） */
  rowSelection: undefined,
  /** 自定义行ID生成器（用于无障碍访问支持） */
  getRowId: (params: any) =>
    `row-${params.data?.id || params.node?.id || Math.random().toString(36).substr(2, 9)}`,
  /** 默认列定义 */
  defaultColDef: {
    /** 不设置 flex，避免覆盖显式 width/最小最大宽 */
    // flex: 1,
    /** 由 transformer 覆盖具体 width/minWidth/maxWidth；不强制最小宽度 */
    // minWidth: 100,
    /** 默认启用排序 */
    sortable: true,
    /** 默认启用筛选 */
    filter: false,
    /** 默认启用列调整大小 */
    resizable: true,
  },
} as const

/**
 * 列类型默认配置
 *
 * 定义了不同列类型的默认 AG Grid 配置。
 * 当用户指定列类型时，会自动应用相应的默认配置。
 *
 * 注意：所有配置都使用 AG Grid Community 版本的功能，
 * 避免依赖企业版功能。
 */
export const COLUMN_TYPE_DEFAULTS = {
  /** 文本列默认配置：使用自定义封装的 InputText 组件 */
  text: {
    /** 使用文本过滤器（社区版） */
    filter: 'agTextColumnFilter',
    /** 自定义渲染器：使用 InputText 组件 */
    cellRenderer: 'inputTextRenderer',
    /** 自定义编辑器：使用 InputText 组件 */
    cellEditor: 'inputTextEditor',
  },

  /** 数字列默认配置：使用自定义封装的 InputNumber 组件 */
  number: {
    /** 使用数字过滤器（社区版） */
    filter: 'agNumberColumnFilter',
    /** 自定义渲染器：使用 InputNumber 组件 */
    cellRenderer: 'inputNumberRenderer',
    /** 自定义编辑器：使用 InputNumber 组件 */
    cellEditor: 'inputNumberEditor',
  },

  /** 日期列默认配置：使用自定义封装的 DatePicker 组件 */
  date: {
    /** 使用日期过滤器（社区版） */
    filter: 'agDateColumnFilter',
    /** 自定义渲染器：使用 DatePicker 组件 */
    cellRenderer: 'datePickerRenderer',
    /** 自定义编辑器：使用 DatePicker 组件 */
    cellEditor: 'datePickerEditor',
  },

  /** 布尔列默认配置：使用自定义封装的 ToggleSwitch 组件 */
  boolean: {
    /** 使用文本过滤器（社区版） */
    filter: 'agTextColumnFilter',
    /** 自定义渲染器：使用 ToggleSwitch 组件 */
    cellRenderer: 'toggleSwitchRenderer',
    /** 自定义编辑器：使用 ToggleSwitch 组件 */
    cellEditor: 'toggleSwitchEditor',
  },

  /** 自定义列默认配置（空对象，完全由用户自定义） */
  custom: {},
} as const

/**
 * 主题间距配置
 *
 * 定义了不同尺寸模式下的主题间距值。
 * 这些值会传递给 AG Grid 的 Quartz 主题，控制表格的视觉密度。
 *
 * 间距值越大，表格看起来越宽松；间距值越小，表格看起来越紧凑。
 */
export const THEME_SPACING = {
  /** 紧凑模式间距 */
  compact: 6,
  /** 舒适模式间距 */
  comfortable: 8,
  /** 宽松模式间距 */
  spacious: 10,
} as const

/**
 * 斑马纹样式配置
 *
 * 定义了 GridTable 中斑马纹的样式配置。
 * 当启用斑马纹时，奇数行和偶数行会显示不同的背景色。
 */
export const ZEBRA_STRIPE_STYLES = {
  /** 偶数行背景色（默认透明，由主题控制） */
  evenRowBackgroundColor: 'transparent',
  /** 奇数行背景色（默认透明，由主题控制） */
  oddRowBackgroundColor: 'transparent',
  /** 斑马纹 CSS 类名 */
  evenRowClass: 'ag-row-even',
  oddRowClass: 'ag-row-odd',
} as const

/**
 * 滚动条样式配置
 *
 * 定义了 GridTable 中滚动条的样式配置。
 * 分别针对 WebKit 内核浏览器（Chrome、Safari）和 Firefox 浏览器。
 */
export const SCROLLBAR_STYLES = {
  /** WebKit 内核浏览器滚动条样式 */
  webkit: {
    /** 滚动条宽度 */
    width: 8,
    /** 滚动条高度 */
    height: 8,
    /** 滚动条圆角 */
    borderRadius: 4,
    /** 滚动条滑块背景色 */
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    /** 滚动条轨道背景色 */
    trackBackgroundColor: 'transparent',
  },
  /** Firefox 浏览器滚动条样式 */
  firefox: {
    /** Firefox 滚动条宽度（thin 表示细滚动条） */
    width: 'thin',
  },
} as const
