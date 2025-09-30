// @/components/grid-table/utils/transformer.ts
/**
 * GridTable 配置转换器
 * 将友好的配置转换为 AG Grid 原生配置
 */

import { useColorStore } from '@/stores'
import type { ColDef, GridOptions } from 'ag-grid-community'
import { COLUMN_TYPE_DEFAULTS, DEFAULT_GRID_OPTIONS, GRID_TABLE_DEFAULT_CONFIG } from './constants'
import { createBodyScrollHandler } from './helper'
import type {
  ExportConfig,
  FeatureConfig,
  GridColumn,
  GridTableConfig,
  InfiniteScrollConfig,
  LayoutConfig,
  PaginationConfig,
  SelectionConfig,
  TableLayoutConfig,
  TextAlign,
} from './types'

// ==================== 文本对齐转换 ====================

const textAlignMap: Record<TextAlign, string> = {
  left: 'left',
  center: 'center',
  right: 'right',
}

// ==================== 列类型转换 ====================

// ==================== 表头合并处理 ====================

/**
 * 处理表头合并，将具有相同 headerGroup 的列组织成列组
 */
function processHeaderGroups(columnDefs: ColDef[]): ColDef[] {
  // 收集所有需要分组的列
  const groupMap = new Map<string, ColDef[]>()
  const ungroupedColumns: ColDef[] = []

  columnDefs.forEach(col => {
    const headerGroup = (col as any).headerGroup
    if (headerGroup) {
      const groupName = typeof headerGroup === 'string' ? headerGroup : headerGroup.name
      if (!groupMap.has(groupName)) {
        groupMap.set(groupName, [])
      }
      groupMap.get(groupName)!.push(col)
    } else {
      ungroupedColumns.push(col)
    }
  })

  // 如果没有分组，直接返回原列定义
  if (groupMap.size === 0) {
    return columnDefs
  }

  // 创建列组
  const result: ColDef[] = []

  groupMap.forEach((columns, _groupName) => {
    // 获取第一个列的 headerGroup 配置作为组配置
    const firstCol = columns[0]
    const headerGroup = (firstCol as any).headerGroup
    const groupConfig =
      typeof headerGroup === 'string' ? { name: headerGroup, title: headerGroup } : headerGroup

    // 创建列组
    const columnGroup: any = {
      headerName: groupConfig.title || groupConfig.name,
      children: columns.map(col => {
        // 移除 headerGroup 属性，避免传递给 AG Grid
        const { headerGroup: _, ...cleanCol } = col as any
        return cleanCol
      }),
      headerClass: groupConfig.className,
      headerStyle: groupConfig.style,
    }

    result.push(columnGroup)
  })

  // 添加未分组的列
  result.push(...ungroupedColumns)

  return result
}

// ==================== 列配置转换器 ====================

export function transformColumn(
  column: GridColumn,
  globalLayout?: LayoutConfig,
  allowPinnedColumnMoving?: boolean
): ColDef {
  // ==================== 基础列配置 ====================
  // 应用全局布局配置的默认值（优先级：列 > 列.layout > 表级 layout > 默认）
  const baseColDef: ColDef = {
    field: column.field,
    headerName: column.headerName || column.field,

    // ==================== 尺寸配置 ====================
    // 尺寸限制：列.layout > 表.layout > 默认
    minWidth: ((): any => {
      const v = column.layout?.minWidth ?? globalLayout?.minWidth
      return v && v > 0 ? v : undefined
    })(),
    maxWidth: ((): any => {
      const v = column.layout?.maxWidth ?? globalLayout?.maxWidth
      return v && v > 0 ? v : undefined
    })(),

    // ==================== 列行为配置 ====================
    // 列级别配置优先，然后列.layout，其次表级 layout，最后默认
    resizable: (() => {
      const defaultResizing = GRID_TABLE_DEFAULT_CONFIG.layout?.layout?.resizing ?? true
      const finalResizing = column.layout?.resizing ?? globalLayout?.resizing ?? defaultResizing
      return finalResizing
    })(),
    // 不使用 flex，避免影响宽度限制
    flex: undefined,

    sortable: (() => {
      const defaultSorting = GRID_TABLE_DEFAULT_CONFIG.layout?.layout?.sorting ?? true
      const finalSorting = column.layout?.sorting ?? globalLayout?.sorting ?? defaultSorting
      return finalSorting
    })(),

    // ==================== 列移动配置 ====================
    suppressMovable: (() => {
      const defaultColumnMoving = GRID_TABLE_DEFAULT_CONFIG.layout?.layout?.columnMoving ?? false
      const finalColumnMoving =
        column.layout?.columnMoving ?? globalLayout?.columnMoving ?? defaultColumnMoving
      return !finalColumnMoving // columnMoving: false -> suppressMovable: true
    })(),

    lockPosition: (() => {
      // 固定列是否允许移动：由 features.allowPinnedColumnMoving 控制（默认 false）
      if (column.pinned) {
        if (allowPinnedColumnMoving === false) {
          return true
        }
      }
      // 如果列明确设置了 columnMoving: false，也锁定位置
      const defaultColumnMoving = GRID_TABLE_DEFAULT_CONFIG.layout?.layout?.columnMoving ?? false
      const finalColumnMoving =
        column.layout?.columnMoving ?? globalLayout?.columnMoving ?? defaultColumnMoving
      if (finalColumnMoving === false) {
        return true
      }
      return false // 默认不锁定
    })(),

    // ==================== 筛选配置 ====================
    filter: (() => {
      // 最终过滤开关：列.layout > 表级 layout > 默认(false)
      const defaultFiltering = GRID_TABLE_DEFAULT_CONFIG.layout?.layout?.filtering ?? false
      const finalFiltering = column.layout?.filtering ?? globalLayout?.filtering ?? defaultFiltering

      if (!finalFiltering) {
        return false
      }

      // 如果是字符串，直接使用
      if (column.filter && typeof column.filter === 'string') {
        return column.filter
      }

      // 否则使用默认筛选器
      return 'agTextColumnFilter'
    })(),

    // ==================== 编辑配置 ====================
    editable: (() => {
      const defaultCellEditing = GRID_TABLE_DEFAULT_CONFIG.layout?.layout?.cellEditing ?? false
      const isEditable =
        column.layout?.cellEditing ?? globalLayout?.cellEditing ?? defaultCellEditing
      return isEditable
    })(),

    // ==================== 其他配置 ====================
    pinned: column.pinned,
    hide: column.hidden ?? false, // 默认不隐藏列
    ...column.props,
  }

  // 应用列类型配置（保留前面已判定为 false 的过滤开关）
  // 如果没有指定 type，默认使用 'text' 类型
  const columnType = column.type || 'text'
  if ((COLUMN_TYPE_DEFAULTS as any)[columnType]) {
    const typeDef: Partial<ColDef> = { ...(COLUMN_TYPE_DEFAULTS as any)[columnType] }
    if (baseColDef.filter === false) {
      delete (typeDef as any).filter
    }
    if (baseColDef.sortable === false) {
      delete (typeDef as any).sortable
    }
    if (baseColDef.resizable === false) {
      delete (typeDef as any).resizable
    }
    Object.assign(baseColDef, typeDef)
  }

  // 应用文本对齐（列 > 列.layout > 表级 layout > 默认）
  {
    const finalTextAlign: TextAlign | undefined =
      column.layout?.textAlign ?? globalLayout?.textAlign
    // 即使没有明确设置，也要应用默认值
    const textAlignToApply = finalTextAlign || 'center'
    baseColDef.cellStyle = {
      ...baseColDef.cellStyle,
      textAlign: textAlignMap[textAlignToApply],
    }
  }

  // 应用样式配置（从 layout 读取类名）
  if (column.layout?.cellClass) {
    baseColDef.cellClass = column.layout.cellClass
  }

  // 应用单元格内联样式（从 layout 读取）
  if (column.layout?.cellStyle) {
    baseColDef.cellStyle = {
      ...(baseColDef.cellStyle as any),
      ...column.layout.cellStyle,
    }
  }

  // 应用列头样式与表头对齐（列 > 列.layout > 表级 layout > 默认）
  {
    const finalHeaderTextAlign: TextAlign | undefined =
      column.layout?.headerTextAlign ?? globalLayout?.headerTextAlign

    if (column.layout?.headerClass) {
      baseColDef.headerClass = column.layout.headerClass
    }

    if (column.layout?.headerStyle) {
      baseColDef.headerStyle = {
        ...(baseColDef.headerStyle as any),
        ...column.layout.headerStyle,
      }
    }

    if (finalHeaderTextAlign) {
      const alignClass =
        finalHeaderTextAlign === 'left'
          ? 'left'
          : finalHeaderTextAlign === 'center'
            ? 'center'
            : 'right'
      baseColDef.headerClass = [baseColDef.headerClass, alignClass].filter(Boolean).join(' ')
    }
  }

  // 单元格样式已在上面处理

  // 应用自定义渲染器
  if (column.cellRenderer) {
    baseColDef.cellRenderer = column.cellRenderer
  }

  // ========== 合并（跨列/跨行）映射 ==========
  // 列合并：mergeRight -> colSpan（AG Grid 期望的是总跨越列数，至少为 1）
  // 注意：当同一列启用了行合并（spanRows）时，AG Grid 不允许同时设置 colSpan。
  const wantsRowSpan = column.mergeDown !== undefined && column.mergeDown !== false
  if (!wantsRowSpan && column.mergeRight !== undefined) {
    const mergeRight = column.mergeRight
    if (typeof mergeRight === 'function') {
      baseColDef.colSpan = (params: any) => {
        try {
          const total = Number(mergeRight(params))
          return Math.max(1, Number.isFinite(total) ? total : 1)
        } catch {
          return 1
        }
      }
    } else {
      const totalNum = Number(mergeRight)
      const total = Math.max(1, Number.isFinite(totalNum) ? totalNum : 1)
      if (total > 1) {
        // 修正：colSpan 应该是函数形式
        baseColDef.colSpan = (_params: any) => total
      }
    }
  }

  // 行合并：mergeDown -> rowSpan（需要开启 enableCellSpan）
  if (column.mergeDown !== undefined) {
    const mergeDown = column.mergeDown as any
    console.log(`[GridTable] 应用行合并: ${column.field}, mergeDown:`, mergeDown)
    if (typeof mergeDown === 'function') {
      baseColDef.rowSpan = (params: any) => {
        try {
          return mergeDown(params) ? 2 : 1
        } catch {
          return 1
        }
      }
    } else if (mergeDown === true) {
      // 默认策略：连续相同值合并
      baseColDef.rowSpan = (params: any) => {
        // 检查参数是否有效
        if (!params || !params.data || !params.node) {
          return 1
        }

        const currentValue = params.data[column.field]
        const currentRowIndex = params.node.rowIndex

        // 如果当前值与前一行相同，则返回0（不显示）
        if (currentRowIndex > 0) {
          const prevRow = params.api.getDisplayedRowAtIndex(currentRowIndex - 1)
          if (prevRow && prevRow.data && prevRow.data[column.field] === currentValue) {
            return 0 // 不显示此单元格
          }
        }

        // 计算连续相同值的数量
        let spanCount = 1
        let nextRowIndex = currentRowIndex + 1
        const totalRows = params.api.getDisplayedRowCount()

        while (nextRowIndex < totalRows) {
          const nextRow = params.api.getDisplayedRowAtIndex(nextRowIndex)
          if (nextRow && nextRow.data && nextRow.data[column.field] === currentValue) {
            spanCount++
            nextRowIndex++
          } else {
            break
          }
        }

        return spanCount
      }

      // 添加单元格样式规则，确保合并的单元格有正确的样式
      baseColDef.cellClassRules = {
        agRowSpan: (params: any) => {
          return params.data && params.data[column.field] !== undefined
        },
      }
    }
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

  // 应用编辑完成回调
  if (column.onCellValueChanged) {
    baseColDef.onCellValueChanged = (event: any) => {
      const { oldValue, newValue, data, colDef } = event
      column.onCellValueChanged!({
        oldValue,
        newValue,
        data,
        field: colDef.field,
      })
    }
  }

  // 应用过滤器参数
  if (column.filterParams) {
    baseColDef.filterParams = column.filterParams
  }

  // 保存原始的 layout 配置到 colDef.context 中，供自定义渲染器使用
  if (column.layout) {
    // 使用 AG Grid 推荐的 context 属性来存储应用数据
    baseColDef.context = {
      ...baseColDef.context,
      layout: column.layout,
    }
  }

  // 保存 headerGroup 配置，供后续处理表头合并使用
  if (column.headerGroup) {
    ;(baseColDef as any).headerGroup = column.headerGroup
  }

  return baseColDef
}

// ==================== 布局配置转换器 ====================

export function transformLayout(layout?: TableLayoutConfig): Partial<GridOptions> {
  if (!layout) {
    return {}
  }

  const gridOptions: Partial<GridOptions> = {}

  // 处理高度配置
  if (layout.height) {
    if (layout.height === 'auto') {
      // auto 模式：让 AG Grid 自动计算高度，不设置 domLayout
      gridOptions.domLayout = 'autoHeight'
    } else {
      // 固定高度模式：使用 normal 布局
      gridOptions.domLayout = 'normal'
    }
  }

  if (layout.rowHeight) {
    gridOptions.rowHeight = layout.rowHeight
  }

  if (layout.headerHeight) {
    gridOptions.headerHeight = layout.headerHeight
  }

  // 斑马纹控制：基于 zebra 模式（none/odd/even）与可选的 zebraColor
  // 颜色优先级：layout.zebraColor（行内样式覆盖）> colorStore.getBg200 + '50'（回退）
  const normalizeColor = (c?: string): string | undefined => {
    if (!c) {
      return undefined
    }
    const v = String(c).trim()
    if (!v) {
      return undefined
    }
    return v.startsWith('#') ? v : `#${v}`
  }
  const zebraColor: string | undefined = normalizeColor((layout as any).zebraColor)
  const colorStore = useColorStore()
  const storeFallback: string | undefined = normalizeColor(String(colorStore.getBg200) + '80')

  switch (layout.zebra) {
    case 'odd':
      // 视觉上的“第 1、3、5 ... 行”为奇数行，对应 0-based 索引的偶数 index
      gridOptions.getRowClass = (params: any) => {
        const index = params.node?.rowIndex ?? 0
        return index % 2 === 0 ? 'ag-row-odd' : ''
      }
      gridOptions.getRowStyle = (params: any) => {
        const index = params.node?.rowIndex ?? 0
        const color = zebraColor || storeFallback
        if (index % 2 === 0) {
          return color ? { backgroundColor: color } : { backgroundColor: '' }
        }
        // 显式清理偶数行上一次配置遗留
        return { backgroundColor: '' }
      }
      break
    case 'even':
      // 视觉上的“第 2、4、6 ... 行”为偶数行，对应 0-based 索引的奇数 index
      gridOptions.getRowClass = (params: any) => {
        const index = params.node?.rowIndex ?? 0
        return index % 2 === 1 ? 'ag-row-even' : ''
      }
      gridOptions.getRowStyle = (params: any) => {
        const index = params.node?.rowIndex ?? 0
        const color = zebraColor || storeFallback
        if (index % 2 === 1) {
          return color ? { backgroundColor: color } : { backgroundColor: '' }
        }
        // 显式清理奇数行上一次配置遗留
        return { backgroundColor: '' }
      }
      break
    case 'none':
    default:
      // 清理两种回调与内联背景色，达到“无斑马纹”效果
      gridOptions.getRowClass = undefined as any
      gridOptions.getRowStyle = () => ({ backgroundColor: '' })
      break
  }

  // 分割线控制 - 通过 context 传递自定义数据
  const lineClasses = []
  if (layout.horizontalLines) {
    lineClasses.push('cc-ag-horizontal-lines')
  } else {
    lineClasses.push('cc-ag-no-horizontal-lines')
  }
  if (layout.verticalLines) {
    lineClasses.push('cc-ag-vertical-lines')
  } else {
    lineClasses.push('cc-ag-no-vertical-lines')
  }
  if (lineClasses.length > 0) {
    // 使用 context 属性传递自定义数据
    gridOptions.context = {
      ...gridOptions.context,
      lineClasses,
    }
  }

  // 高亮效果控制
  if (layout.hoverRowHighlight === false) {
    // gridOptions.suppressRowHoverHighlight = true
  } else {
    // gridOptions.suppressRowHoverHighlight = false
  }

  if (layout.hoverColumnHighlight === true) {
    gridOptions.columnHoverHighlight = true
  } else {
    gridOptions.columnHoverHighlight = false
  }

  // 单元格高亮设置
  // 开启单元格选中标记
  gridOptions.suppressCellFocus = false
  if (layout.selectedCellBorderHighlight) {
    lineClasses.push('cc-ag-cell-border-highlight')
  }
  if (layout.selectedCellBackgroundHighlight) {
    lineClasses.push('cc-ag-cell-background-highlight')
  }

  return gridOptions
}

// ==================== 分页配置转换器 ====================

export function transformPagination(pagination?: PaginationConfig): Partial<GridOptions> {
  // 使用 constants.ts 中的默认分页配置
  const defaultPagination = GRID_TABLE_DEFAULT_CONFIG.pagination || {
    enabled: false,
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
    showPageSizeSelector: true,
  }

  const finalPagination = { ...defaultPagination, ...pagination }

  if (!finalPagination.enabled) {
    return {
      pagination: false,
      suppressPaginationPanel: true,
    }
  }

  const gridOptions: Partial<GridOptions> = {
    pagination: true,
    paginationPageSize: finalPagination.pageSize,
    paginationPageSizeSelector: finalPagination.showPageSizeSelector
      ? finalPagination.pageSizeOptions
      : false,
  }

  return gridOptions
}

// ==================== 选择配置转换器 ====================

export function transformSelection(
  selection?: SelectionConfig,
  rowModelType?: string
): Partial<GridOptions> {
  // 使用 constants.ts 中的默认选择配置
  const defaultSelection = GRID_TABLE_DEFAULT_CONFIG.selection || {
    mode: 'singleRow' as const,
    checkboxes: false,
    clickToSelect: true,
    keyboardToSelect: true,
  }

  const finalSelection = { ...defaultSelection, ...selection }

  // infinite 行模型不支持选择功能，返回空配置
  if (rowModelType === 'infinite') {
    return {}
  }

  const gridOptions: Partial<GridOptions> = {}

  // ==================== 选择配置处理 ====================
  // 只有当明确启用复选框时才设置 rowSelection
  if (finalSelection.checkboxes) {
    const rowSelectionConfig: any = {
      // 选择模式：根据 mode 设置（单选或多选）
      mode: finalSelection.mode === 'multiRow' ? 'multiRow' : 'singleRow',
      // 点击选择：根据 clickToSelect 设置
      enableClickSelection: finalSelection.clickToSelect,
      // 始终启用复选框列
      checkboxes: true,
    }

    // ==================== 表头复选框配置 ====================
    if (finalSelection.headerCheckbox) {
      rowSelectionConfig.headerCheckbox = true
      // 全选行为：'all' 表示全选所有行，'filtered' 表示只全选过滤后的行
      rowSelectionConfig.selectAll = 'all'
    }

    // ==================== 高级选择配置 ====================
    if (finalSelection.mode === 'multiRow' && finalSelection.clickToSelect) {
      // v32.2+：允许无修饰键点击进行多选（不需要按住 Ctrl/Cmd）
      rowSelectionConfig.enableSelectionWithoutKeys = true
    }

    // ==================== 复选框列固定配置 ====================
    // 如果需要固定复选框列，通过 rowSelection.checkboxColumn 配置
    // 应用列固定配置
    if (finalSelection.pinned) {
      gridOptions.selectionColumnDef = {
        width: 40,
        pinned: finalSelection.pinned,
        lockPosition: true,
      }
    }

    gridOptions.rowSelection = rowSelectionConfig
  }
  // 注意：如果不启用复选框，则不设置 rowSelection，避免 AG Grid 自动显示复选框列
  return gridOptions
}

// ==================== 功能配置转换器 ====================

export function transformFeatures(features?: FeatureConfig): Partial<GridOptions> {
  // 使用 constants.ts 中的默认功能配置
  const defaultFeatures = GRID_TABLE_DEFAULT_CONFIG.features || {
    allowPinnedColumnMoving: false,
    clipboard: true,
    export: true,
    fullScreen: false,
    pagination: true,
  }

  const finalFeatures = { ...defaultFeatures, ...features }

  const gridOptions: Partial<GridOptions> = {}

  // 复制粘贴
  if (finalFeatures.clipboard === false) {
    gridOptions.suppressClipboardApi = true
  }

  // 导出功能
  if (finalFeatures.export === false) {
    gridOptions.suppressCsvExport = true
    gridOptions.suppressExcelExport = true
  }

  // 分页
  if (finalFeatures.pagination === false) {
    gridOptions.pagination = false
    gridOptions.suppressPaginationPanel = true
  } else {
    gridOptions.pagination = true
    gridOptions.suppressPaginationPanel = false
  }

  return gridOptions
}

// ==================== 导出配置转换器 ====================

export function transformExport(exportConfig?: ExportConfig): Partial<GridOptions> {
  // 使用 constants.ts 中的默认导出配置
  const defaultExport = GRID_TABLE_DEFAULT_CONFIG.export || {
    csv: true,
    excel: false,
    fileName: '数据导出',
  }

  const finalExport = { ...defaultExport, ...exportConfig }

  const gridOptions: Partial<GridOptions> = {}

  if (finalExport.csv) {
    gridOptions.suppressCsvExport = false
    if (finalExport.params) {
      gridOptions.defaultCsvExportParams = finalExport.params
    }
  } else {
    gridOptions.suppressCsvExport = true
  }

  if (finalExport.excel) {
    gridOptions.suppressExcelExport = false
  } else {
    gridOptions.suppressExcelExport = true
  }

  return gridOptions
}

// ==================== 无限滚动配置转换器 ====================

export function transformInfiniteScroll(
  infiniteScrollConfig?: InfiniteScrollConfig,
  userGridOptions?: Partial<GridOptions>
): Partial<GridOptions> {
  // 使用 constants.ts 中的默认无限滚动配置
  const defaultInfiniteScroll = GRID_TABLE_DEFAULT_CONFIG.infiniteScroll || {
    enabled: false,
    threshold: 100,
    showLoadingIndicator: false,
    loadingText: '加载中...',
  }

  const finalInfiniteScroll = { ...defaultInfiniteScroll, ...infiniteScrollConfig }

  const gridOptions: Partial<GridOptions> = {}

  // 如果启用无限滚动
  if (finalInfiniteScroll.enabled) {
    // 创建增强的 bodyScroll 事件处理器
    let lastScrollTop = 0
    const onScrollDownOnly = (evt: any) => {
      const gridContainer = document.querySelector('.ag-body-viewport') as HTMLElement | null
      if (!gridContainer) {
        return
      }
      const currentScrollTop = gridContainer.scrollTop
      const isScrollingDown = currentScrollTop > lastScrollTop
      lastScrollTop = currentScrollTop
      if (!isScrollingDown) {
        return
      }
      if (typeof finalInfiniteScroll.onScrollToBottom === 'function') {
        finalInfiniteScroll.onScrollToBottom(evt as any)
      }
    }

    const enhancedBodyScrollHandler = createBodyScrollHandler(
      userGridOptions?.onBodyScroll,
      onScrollDownOnly as any,
      finalInfiniteScroll.threshold
    )

    gridOptions.onBodyScroll = enhancedBodyScrollHandler
  } else {
    // 如果用户有自定义的 onBodyScroll，保留它
    if (userGridOptions?.onBodyScroll) {
      gridOptions.onBodyScroll = userGridOptions.onBodyScroll
    }
  }

  return gridOptions
}

// ==================== 主转换器 ====================

export function transformGridConfig(config: GridTableConfig): {
  columnDefs: ColDef[]
  gridOptions: GridOptions
  components: Record<string, any>
} {
  // 获取表格级别的布局配置（作为列的默认配置）
  const globalLayout = config.layout?.layout

  // 合并 GridOptions（默认只来自 constants）
  // 注意：getRowId 是初始属性，不能被用户配置覆盖
  const { getRowId: _getRowId, ...userGridOptions } = config.gridOptions || {}

  // 转换各种配置
  const layoutOptions = transformLayout(config.layout)
  const featuresOptions = transformFeatures(config.features)
  const paginationOptions = transformPagination(config.pagination)
  const selectionOptions = transformSelection(config.selection, userGridOptions.rowModelType)
  const exportOptions = transformExport(config.export)
  const infiniteScrollOptions = transformInfiniteScroll(config.infiniteScroll, userGridOptions)
  const gridOptions: GridOptions = {
    ...DEFAULT_GRID_OPTIONS,
    ...layoutOptions,
    ...featuresOptions,
    ...paginationOptions,
    ...selectionOptions,
    ...exportOptions,
    ...infiniteScrollOptions,
    ...userGridOptions,
    // 确保 getRowId 始终使用默认值，不被用户配置覆盖
    getRowId: DEFAULT_GRID_OPTIONS.getRowId,
    // 处理数据：如果配置中有 data 且不是 infinite 行模型，则设置 rowData
    ...(config.data && userGridOptions.rowModelType !== 'infinite' ? { rowData: config.data } : {}),
  }

  // ==================== 列配置处理 ====================
  // 表级列移动控制：不再通过 suppressMovableColumns 或重写 defaultColDef，
  // 仅通过每列的 suppressMovable/lockPosition 控制，避免切换时列顺序闪动。

  // 转换列配置（优先级：列 > 列.layout > 表.layout > 默认）
  const defaultAllowPinnedMove =
    GRID_TABLE_DEFAULT_CONFIG.features?.allowPinnedColumnMoving ?? false
  const allowPinnedMove = config.features?.allowPinnedColumnMoving ?? defaultAllowPinnedMove
  const rawColumnDefs = config.columns.map(column =>
    transformColumn(column, globalLayout, allowPinnedMove)
  )

  // 处理表头合并（列组）
  const columnDefs = processHeaderGroups(rawColumnDefs)

  // ==================== 复选框列处理 ====================
  // 注意：当 fixed: true 时，我们通过 rowSelection.checkboxColumn 来配置固定复选框列
  // 不需要手动创建复选框列，因为 AG Grid v32.2+ 会自动处理

  // ==================== 清理过时配置 ====================
  // 当任意列配置了行合并（rowSpan/mergeDown）时，开启 enableCellSpan
  const hasRowSpan = columnDefs.some(col => (col as any).rowSpan)
  if (hasRowSpan) {
    ;(gridOptions as any).enableCellSpan = true
    // 与 rowSpan 冲突：需关闭文本选择（强制覆盖用户配置）
    ;(gridOptions as any).enableCellTextSelection = false
    // rowSpan 需要启用 suppressRowTransform（强制覆盖用户配置）
    ;(gridOptions as any).suppressRowTransform = true
    console.log('[GridTable] 检测到行合并，强制设置 suppressRowTransform = true')
  }
  if (gridOptions.enableRangeSelection) {
    delete gridOptions.enableRangeSelection
  }
  if (gridOptions.suppressRowClickSelection !== undefined) {
    delete gridOptions.suppressRowClickSelection
  }
  if (gridOptions.suppressRowDeselection !== undefined) {
    delete gridOptions.suppressRowDeselection
  }
  if (gridOptions.cellSelection) {
    delete gridOptions.cellSelection
  }

  // 最终强制覆盖：确保行合并相关配置正确
  if (hasRowSpan) {
    ;(gridOptions as any).suppressRowTransform = true
    ;(gridOptions as any).enableCellTextSelection = false
    ;(gridOptions as any).enableCellSpan = true
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
    // 宽度统一由 layout.minWidth 管控
    layout: {
      sorting: GRID_TABLE_DEFAULT_CONFIG.layout?.layout?.sorting ?? true,
      filtering: GRID_TABLE_DEFAULT_CONFIG.layout?.layout?.filtering ?? false,
    },
  }
}

export function createActionColumn(renderer: string = 'actionButtons'): GridColumn {
  return {
    field: 'actions',
    headerName: '操作',
    type: 'custom',
    // 宽度统一由 layout.minWidth 管控
    pinned: 'right',
    layout: {
      resizing: false,
      sorting: false,
      filtering: false,
    },
    cellRenderer: renderer,
  }
}

export function createIdColumn(field: string = 'id', headerName: string = 'ID'): GridColumn {
  return {
    field,
    headerName,
    type: 'number',
    // 宽度统一由 layout.minWidth 管控
    pinned: 'left',
    layout: {
      textAlign: 'center',
      cellClass: 'font-bold',
    },
  }
}
