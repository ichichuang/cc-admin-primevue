// @/hooks/components/useRevoGrid.ts
/**
 * useRevoGrid 组合式函数
 *
 * 基于 AG Grid 社区版的表格管理 hooks
 * 提供动态配色、尺寸控制和数据管理功能
 */

import { generateIdFromKey } from '@/common'
import ActionCell from '@/components/modules/grid-table/components/ActionCell'
import {
  DEFAULT_GRID_COLOR_CONFIG,
  getGridSizeConfigByMode,
  type SizeMode,
} from '@/components/modules/grid-table/utils/constants'
import {
  addRowNumberColumn,
  colorConfigToCssVars,
  exportToCsv,
  exportToExcel,
  generateScrollbarStyles,
  mergeColorConfig,
  processColumnDefs,
  sizeConfigToGridOptions,
  transformDataForExport,
  validateColumnDefs,
  validateData,
} from '@/components/modules/grid-table/utils/helper'
import type {
  ExtendedColDef,
  GridColorConfig,
  GridSizeConfig,
  GridTableProps,
  UseRevoGridReturn,
} from '@/components/modules/grid-table/utils/types'
import { t } from '@/locales'
import { useSizeStore } from '@/stores/modules/size'
import type { GridApi, GridOptions } from 'ag-grid-community'
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'

// ==================== 主要组合式函数 ====================

/**
 * useRevoGrid 主函数
 */
export function useRevoGrid(props: Ref<GridTableProps>, emit?: any): UseRevoGridReturn {
  // ==================== 响应式状态 ====================

  /** 网格 API */
  const gridApi = ref<GridApi | null>(null)

  /**
   * 安全地调用网格 API，检查网格是否已销毁
   */
  const safeGridApiCall = <T>(callback: (api: GridApi) => T): T | undefined => {
    if (gridApi.value && !gridApi.value.isDestroyed()) {
      return callback(gridApi.value)
    }
    return undefined
  }

  /** 行数据 */
  const rowData = ref<any[]>(props.value.rowData || [])

  /** 选中的行 */
  const selectedRows = ref<any[]>([])

  /** 表格容器引用 */
  const gridContainer = ref<any>(null)

  // ==================== 计算属性 ====================

  /** 合并后的配色配置 */
  const mergedColorConfig = computed<GridColorConfig>(() => {
    // 使用默认配置，让框架的 CSS 变量自动处理深色/浅色模式
    // 这样表格会自动响应框架的主题切换
    // return mergeColorConfig(DEFAULT_GRID_COLOR_CONFIG, props.value.colorConfig || {})
    return mergeColorConfig(DEFAULT_GRID_COLOR_CONFIG, props.value.colorConfig || {})
  })

  /** 系统尺寸 store */
  const sizeStore = useSizeStore()

  /** 合并后的尺寸配置 - 根据系统尺寸模式动态调整 */
  const mergedSizeConfig = computed<GridSizeConfig>(() => {
    // 获取系统当前的尺寸模式 - 直接访问 state 以确保响应式
    const systemSizeMode = sizeStore.size as SizeMode

    // 根据系统尺寸模式获取对应的表格尺寸配置
    const systemSizeConfig = getGridSizeConfigByMode(systemSizeMode)

    // 将系统尺寸配置与用户自定义配置合并
    // 系统尺寸配置作为基础，用户自定义配置覆盖特定属性
    const userConfig = props.value.sizeConfig || {}

    // 根据 followSystemSize 参数决定是否使用系统配置
    const shouldFollowSystemSize = props.value.followSystemSize !== false // 默认为 true

    // 如果跟随系统尺寸，则使用系统配置；否则使用用户配置
    const merged = {
      ...systemSizeConfig, // 系统配置作为基础
      ...userConfig, // 用户配置覆盖
      // 根据 followSystemSize 参数决定是否强制使用系统配置
      ...(shouldFollowSystemSize
        ? {
            rowHeight: systemSizeConfig.rowHeight,
            headerHeight: systemSizeConfig.headerHeight,
            minColumnWidth: systemSizeConfig.minColumnWidth,
            maxColumnWidth: systemSizeConfig.maxColumnWidth,
            scrollbarSize: systemSizeConfig.scrollbarSize,
          }
        : {}),
    }
    return merged
  })

  /** 处理后的列定义 */
  const processedColumnDefs = computed<ExtendedColDef[]>(() => {
    let columns = [...(props.value.columnDefs || [])]

    // 添加行号列
    if (props.value.showRowNumbers) {
      columns = addRowNumberColumn(columns)
    }

    // v32+ 不再手动添加选择占位列，checkbox 列由 rowSelection.checkboxes 控制

    // 应用配色和尺寸配置
    const withStyle = processColumnDefs(columns, mergedColorConfig.value, mergedSizeConfig.value)

    // 如果默认列宽为 'auto' 或列宽为 'auto'，在 GridReady 后调用 autoSize
    const needAutoSize =
      mergedSizeConfig.value.defaultColumnWidth === 'auto' ||
      withStyle.some(col => (col as any).width === undefined)
    if (needAutoSize && gridApi.value) {
      setTimeout(() => autoSizeColumns(), 0)
    }

    // 统一应用排序/过滤全局开关：当列未显式设置时，使用全局 props
    const normalized = withStyle.map(col => {
      const next: ExtendedColDef = { ...col }
      if (next.sortable === undefined) {
        next.sortable = !!props.value.enableSorting
      }
      if (next.filter === undefined) {
        // ag-grid 使用 boolean 启用默认文本过滤器
        ;(next as any).filter = !!props.value.enableFilter
      }
      return next
    })

    return normalized
  })

  /** 合并后的网格选项 */
  const mergedGridOptions = computed<GridOptions>(() => {
    const baseOptions = sizeConfigToGridOptions(mergedSizeConfig.value)

    // 适配 AG Grid v32 选择 API
    const selection = (() => {
      if (!props.value.rowSelection) {
        return undefined
      }
      const isMultiple = props.value.rowSelection === 'multiple'
      const selectionObj: any = {
        mode: isMultiple ? 'multiRow' : 'singleRow',
        // 是否允许点击行触发选择（默认 false）
        enableClickSelection: !!props.value.enableRowClickSelection,
        // 允许无修饰键进行多选（v32 新 API，替代 rowMultiSelectWithClick）
        enableSelectionWithoutKeys: isMultiple ? true : false,
      }
      // 当不允许点击行选中时，提供复选框列用于选择（单选/多选均适用）
      if (!selectionObj.enableClickSelection) {
        selectionObj.checkboxes = {
          headerCheckbox: isMultiple ? true : false,
          position: (props.value.selectionCheckboxPosition || 'left') as 'left' | 'right',
        }
      } else if (isMultiple) {
        // 多选且允许点击行时，保留表头复选框以便全选
        selectionObj.checkboxes = {
          headerCheckbox: true,
          position: (props.value.selectionCheckboxPosition || 'left') as 'left' | 'right',
        }
      }
      return selectionObj
    })()

    const selectionColumnDef = (() => {
      if (!props.value.rowSelection) {
        return undefined
      }
      const pos = (props.value.selectionCheckboxPosition || 'left') as 'left' | 'right'
      return {
        headerName: '',
        pinned: pos,
        width: 48,
        minWidth: 40,
        maxWidth: 60,
        resizable: false,
        sortable: false,
        suppressHeaderMenuButton: true,
        suppressMovable: true,
      } as any
    })()

    // 根据时间戳Date.now() 生成一个唯一的id作为rowData的id
    // 基础网格选项
    const baseGridOptions: GridOptions = {
      ...baseOptions,
      // 初始化 loading，便于 v32+ 使用 setGridOption 控制
      loading: false,
      // i18n
      localeText: buildAgGridLocaleText(),
      // 分页设置：通过 props 控制，默认关闭
      pagination: !!props.value.enablePagination,
      paginationPageSize: props.value.paginationPageSize,
      // 提供分页下拉选项（v32+）
      paginationPageSizeSelector: props.value.paginationPageSizeOptions,

      suppressScrollOnNewData: true,
      getRowId: params => {
        // 获取 id 如果没有就获取对象的第一项内容

        const id = params.data.id || params.data[Object.keys(params.data)[0]]

        // 确保 id 是有效的字符串
        const stringId = String(id || '')
        if (!stringId) {
          // 如果无法获取有效 id，使用随机数作为后备
          return `row-${Math.random().toString(36).substr(2, 9)}`
        }

        const uniqueId = generateIdFromKey(stringId)
        // 返回生成的唯一 ID
        return uniqueId
      }, // 等价于原 getRowNodeId

      // 功能配置 - v32 新的 rowSelection 对象形式
      rowSelection: selection,

      // 注意：enableCellSpan 是 AG Grid 企业版功能，社区版不支持
      // enableCellSpan: props.value.enableCellSpan || false,
      // 启用 suppressRowTransform 以支持 rowSpan
      suppressRowTransform: true,

      // 高度模式：auto 使用 AG Grid 的 autoHeight
      domLayout: mergedSizeConfig.value.heightMode === 'auto' ? 'autoHeight' : 'normal',

      // 悬停高亮：AG Grid 使用 suppressRowHoverHighlight（行）和 columnHoverHighlight（列）
      suppressRowHoverHighlight: props.value.enableRowHoverHighlight === false ? true : undefined,
      columnHoverHighlight: props.value.enableColumnHoverHighlight === false ? false : true,

      // 自定义滚动条宽度（AG Grid gridOptions.scrollbarWidth）
      scrollbarWidth: mergedSizeConfig.value.scrollbarSize || 12,

      // 单元格高亮通过 CSS 变量控制

      // 默认列配置 - 根据最新 AG Grid API
      defaultColDef: {
        sortable: props.value.enableSorting ?? false,
        filter: props.value.enableFilter ?? false,
        resizable: props.value.enableColumnResize ?? false,
        suppressMovable: props.value.enableColumnDrag === false ? true : false,
        cellStyle: {
          textAlign: mergedSizeConfig.value.globalCellTextAlign || 'center',
          display: 'flex',
          alignItems:
            mergedSizeConfig.value.globalCellVerticalAlign === 'top'
              ? 'flex-start'
              : mergedSizeConfig.value.globalCellVerticalAlign === 'bottom'
                ? 'flex-end'
                : 'center',
          justifyContent:
            mergedSizeConfig.value.globalCellTextAlign === 'center'
              ? 'center'
              : mergedSizeConfig.value.globalCellTextAlign === 'right'
                ? 'flex-end'
                : 'flex-start',
        },
        headerClass: `ag-header-${mergedSizeConfig.value.globalHeaderTextAlign || 'center'} ag-header-${mergedSizeConfig.value.globalHeaderVerticalAlign || 'middle'}`,
        ...baseOptions.defaultColDef,
      },

      // 自定义选择列外观/位置（v32 提供 selectionColumnDef）
      selectionColumnDef,

      // 事件处理
      onGridReady: params => {
        gridApi.value = params.api
        emit?.('gridReady', params)
        props.value.gridOptions?.onGridReady?.(params)

        // 如果需要适配视口宽度
        fitColumnsToViewport()

        // 延迟设置合并单元格样式
        setTimeout(() => {
          setMergedCellStyles()
        }, 200)
      },

      onSelectionChanged: () => {
        const selected = safeGridApiCall(api => api.getSelectedRows())
        if (selected) {
          selectedRows.value = selected
          emit?.('selectionChanged', selectedRows.value)
        }
      },

      onSortChanged: _event => {
        emit?.('sortChanged', [])
      },

      onFilterChanged: _event => {
        emit?.('filterChanged', {})
      },

      onColumnResized: event => {
        emit?.('columnResized', event)
        fitColumnsToViewport()
      },

      onColumnMoved: event => {
        emit?.('columnMoved', event)
        fitColumnsToViewport()
      },

      onColumnVisible: event => {
        emit?.('columnVisible', event)
        fitColumnsToViewport()
      },

      onCellValueChanged: event => {
        emit?.('cellValueChanged', event)
      },

      // 补充单元格点击/双击事件（参考官方文档）
      onCellClicked: event => {
        emit?.('cellClicked', event)
        props.value.gridOptions?.onCellClicked?.(event)
      },

      onCellDoubleClicked: event => {
        emit?.('cellDoubleClicked', event)
        props.value.gridOptions?.onCellDoubleClicked?.(event)
      },

      onCellContextMenu: event => {
        emit?.('cellContextMenu', event)
        props.value.gridOptions?.onCellContextMenu?.(event)
      },

      onCellEditingStarted: event => {
        emit?.('cellEditingStarted', event)
      },

      onCellEditingStopped: event => {
        emit?.('cellEditingStopped', event)
      },

      onGridSizeChanged: event => {
        emit?.('gridSizeChanged', event)
        fitColumnsToViewport()
      },

      // 🔥 用户自定义事件处理函数（如果存在）
      ...(props.value.gridOptions?.onRowClicked
        ? { onRowClicked: props.value.gridOptions.onRowClicked }
        : {}),
      ...(props.value.gridOptions?.onCellClicked
        ? { onCellClicked: props.value.gridOptions.onCellClicked }
        : {}),
      ...(props.value.gridOptions?.onRowDoubleClicked
        ? { onRowDoubleClicked: props.value.gridOptions.onRowDoubleClicked }
        : {}),
      ...(props.value.gridOptions?.onCellDoubleClicked
        ? { onCellDoubleClicked: props.value.gridOptions.onCellDoubleClicked }
        : {}),
      ...(props.value.gridOptions?.onRowSelected
        ? { onRowSelected: props.value.gridOptions.onRowSelected }
        : {}),

      // Loading 模板配置（优先使用 props，自适配 i18n 文案）
      overlayLoadingTemplate:
        props.value.overlayLoadingTemplate ||
        `<span class="ag-overlay-loading-center">${t('common.loading')}</span>`,
      overlayNoRowsTemplate:
        props.value.overlayNoRowsTemplate ||
        `<span class="ag-overlay-loading-center">${t('common.gridTable.noRowsToShow')}</span>`,

      // 🔥 用户自定义 gridOptions 最后合并，具有最高优先级（排除已处理的事件）
      ...Object.fromEntries(
        Object.entries(props.value.gridOptions || {}).filter(
          ([key]) =>
            !key.startsWith('on') ||
            ![
              'onRowClicked',
              'onCellClicked',
              'onRowDoubleClicked',
              'onCellDoubleClicked',
              'onRowSelected',
            ].includes(key)
        )
      ),
    }

    // 合并用户传入的 gridOptions，确保 components 正确合并
    const userGridOptions = props.value.gridOptions || {}

    return {
      ...baseGridOptions,
      // 合并 components，确保 ActionCell 等组件可用
      components: {
        actionCell: ActionCell,
        ...baseGridOptions.components,
        ...userGridOptions.components,
      },
      // 其他用户自定义选项
      ...Object.fromEntries(
        Object.entries(userGridOptions).filter(([key]) => key !== 'components')
      ),
    }
  })

  /** 网格选项（向后兼容） */
  const gridOptions = computed<GridOptions>(() => mergedGridOptions.value)

  // ---- i18n: 构造 AG Grid localeText ----
  function buildAgGridLocaleText() {
    return {
      // pagination
      page: t('common.pagination.page'),
      to: t('common.pagination.to'),
      of: t('common.pagination.of'),
      pageSize: t('common.pagination.pageSize'),
      pageSizeSelectorLabel: t('common.pagination.pageSize'),
      next: t('common.pagination.next'),
      previous: t('common.pagination.previous'),
      first: t('common.pagination.first'),
      last: t('common.pagination.last'),
      firstPage: t('common.pagination.first'),
      lastPage: t('common.pagination.last'),
      nextPage: t('common.pagination.next'),
      previousPage: t('common.pagination.previous'),
      loadingOoo: t('common.loading'),
      noRowsToShow: t('common.gridTable.noRowsToShow'),
      // filter input placeholder
      filterOoo: t('common.filter.placeholder'),
      searchOoo: t('common.filter.placeholder'),
      // filter operators
      equals: t('common.filter.equals'),
      notEqual: t('common.filter.notEqual'),
      notEquals: t('common.filter.notEqual'),
      contains: t('common.filter.contains'),
      notContains: t('common.filter.notContains'),
      startsWith: t('common.filter.startsWith'),
      endsWith: t('common.filter.endsWith'),
      blank: t('common.filter.blank'),
      notBlank: t('common.filter.notBlank'),
      lessThan: t('common.filter.lessThan'),
      lessThanOrEqual: t('common.filter.lessThanOrEqual'),
      greaterThan: t('common.filter.greaterThan'),
      greaterThanOrEqual: t('common.filter.greaterThanOrEqual'),
      inRange: t('common.filter.inRange'),
      applyFilter: t('common.filter.apply'),
      clearFilter: t('common.filter.clear'),
      resetFilter: t('common.filter.clear'),
      // logical operators
      andCondition: t('common.filter.andCondition'),
      orCondition: t('common.filter.orCondition'),
    } as any
  }

  // 当语言变化时：不再热更新 localeText（初始属性），改为交由上层重建组件
  const onLocaleChanged = () => {
    // 仅做轻量刷新，避免触发 #22 警告
    if (gridApi.value && !gridApi.value.isDestroyed()) {
      try {
        gridApi.value.refreshHeader()
        gridApi.value.redrawRows()
      } catch (_err) {
        // 静默失败
      }
    }
  }
  onMounted(() => window.addEventListener('locale-changed', onLocaleChanged))
  onUnmounted(() => window.removeEventListener('locale-changed', onLocaleChanged))

  /** 表格样式 - 应用 AG Grid CSS 变量和框架变量 */
  const gridStyle = computed<Record<string, string>>(() => {
    // 获取 AG Grid 的 CSS 变量映射
    const cssVars = colorConfigToCssVars(mergedColorConfig.value)

    // 当关闭悬停高亮时，强制将悬停颜色设为透明，避免主题样式带来的高亮
    if (props.value.enableRowHoverHighlight === false) {
      cssVars['--ag-row-hover-color'] = 'transparent'
    }

    // 点击格子背景高亮颜色控制（AG Grid 主题变量）
    {
      const c = mergedColorConfig.value.cellFocusBackgroundColor
      if (props.value.enableCellFocusHighlight === false) {
        // 关闭时清除所有聚焦相关样式
        cssVars['--ag-cell-focus-background-color'] = 'transparent'
        cssVars['--ag-range-selection-border-color'] = 'transparent'
        cssVars['--ag-focus-border-color'] = 'transparent'
        cssVars['--ag-cell-focus-border-color'] = 'transparent'
      } else if (c) {
        // 开启时设置背景色高亮
        cssVars['--ag-cell-focus-background-color'] = c
        // 清除边框高亮
        cssVars['--ag-range-selection-border-color'] = 'transparent'
        cssVars['--ag-focus-border-color'] = 'transparent'
        cssVars['--ag-cell-focus-border-color'] = 'transparent'
      }
    }

    // 添加尺寸相关的样式 - 使用框架的尺寸变量
    const { height, minHeight, maxHeight, heightMode } = mergedSizeConfig.value

    // 高度模式：auto | fixed | fill
    if (heightMode === 'fill') {
      // 撑满父容器，超出滚动
      cssVars['height'] = '100%'
      cssVars['min-height'] = minHeight ? `${minHeight}px` : '0'
      cssVars['max-height'] = maxHeight ? `${maxHeight}px` : 'none'
      cssVars['overflow'] = 'auto'
    } else if (heightMode === 'fixed') {
      // 固定高度
      cssVars['height'] = `${height || 0}px`
      cssVars['min-height'] = minHeight ? `${minHeight}px` : `${height || 0}px`
      cssVars['max-height'] = maxHeight ? `${maxHeight}px` : `${height || 0}px`
      cssVars['overflow'] = 'auto'
    } else {
      // auto：由内容撑开
      if (height && height > 0) {
        cssVars['height'] = `${height}px`
      }
      if (minHeight) {
        cssVars['min-height'] = `${minHeight}px`
      }
      if (maxHeight) {
        cssVars['max-height'] = `${maxHeight}px`
      }
    }

    // 添加行高和表头高度的 CSS 变量
    if (mergedSizeConfig.value.rowHeight) {
      cssVars['--ag-row-height'] = `${mergedSizeConfig.value.rowHeight}px`
    }
    if (mergedSizeConfig.value.headerHeight) {
      cssVars['--ag-header-height'] = `${mergedSizeConfig.value.headerHeight}px`
    }

    // 统一用全局圆角变量
    cssVars['--ag-border-radius'] = 'var(--rounded)'

    // 斑马线控制：通过 toggle 偶数/奇数行背景
    if (props.value.enableZebraStripe) {
      // odd 行背景已通过 --ag-odd-row-background-color 控制，这里确保开启
      cssVars['--ag-odd-row-background-color'] =
        cssVars['--ag-odd-row-background-color'] || 'var(--bg200)'
    } else {
      // 关闭时将 odd 行背景与背景色一致
      if (cssVars['--ag-background-color']) {
        cssVars['--ag-odd-row-background-color'] = cssVars['--ag-background-color']
      }
    }

    // 合并自定义样式（允许外部根据全局尺寸模式覆盖 row/header/min/max 等）
    const base = {
      ...cssVars,
      ...props.value.customStyle,
      borderRadius: 'var(--rounded)',
    } as Record<string, string>

    // 分割线控制：通过 CSS 变量精准控制 style/color/width
    const splitColor = mergedColorConfig.value.borderColor || 'var(--bg300)'

    // 横向分割线（行间）
    if (props.value.enableHorizontalSplitLine === false) {
      base['--ag-row-border-style'] = 'none'
      base['--ag-row-border-color'] = 'transparent'
      base['--ag-row-border-width'] = '0px'
    } else {
      base['--ag-row-border-style'] = 'solid'
      base['--ag-row-border-color'] = splitColor
      base['--ag-row-border-width'] = '1px'
    }

    // 纵向分割线（列间）
    if (props.value.enableVerticalSplitLine === false) {
      base['--ag-column-border-style'] = 'none'
      base['--ag-column-border-color'] = 'transparent'
      base['--ag-column-border-width'] = '0px'
    } else {
      base['--ag-column-border-style'] = 'solid'
      base['--ag-column-border-color'] = splitColor
      base['--ag-column-border-width'] = '1px'
    }

    // 合并单元格样式美化（社区版 colSpan/rowSpan 支持）
    if (props.value.enableVerticalSplitLine !== false) {
      base['--ag-cell-border-style'] = 'solid'
      base['--ag-cell-border-color'] = splitColor
      base['--ag-cell-border-width'] = '1px'
    }

    return base
  })

  /** 滚动条样式 - 通过 CSS 伪元素控制 */
  const scrollbarStyles = computed<string>(() => {
    return generateScrollbarStyles(
      mergedColorConfig.value,
      mergedSizeConfig.value.scrollbarSize || 12,
      {
        enableHorizontalSplitLine: props.value.enableHorizontalSplitLine,
        enableVerticalSplitLine: props.value.enableVerticalSplitLine,
        enableCellFocusHighlight: props.value.enableCellFocusHighlight,
        enableRowHoverHighlight: props.value.enableRowHoverHighlight,
        enableColumnHoverHighlight: props.value.enableColumnHoverHighlight,
      }
    )
  })

  /** 工具栏样式 */
  const toolbarStyle = computed<Record<string, string>>(() => {
    const config = mergedColorConfig.value
    return {
      backgroundColor: config.toolbarBackgroundColor || 'var(--bg200)',
    }
  })

  /** 状态栏样式 */
  const statusBarStyle = computed<Record<string, string>>(() => {
    const config = mergedColorConfig.value
    return {
      backgroundColor: config.statusBarBackgroundColor || 'var(--bg200)',
      color: config.statusBarTextColor || 'var(--text100)',
    }
  })

  /** 表格类名 */
  const gridClass = computed<string>(() => {
    // 使用默认的 alpine 主题类名
    const themeClass = 'ag-theme-alpine'
    const customClass = props.value.customClass || ''

    return `${themeClass} ${customClass}`.trim()
  })

  // ==================== 方法 ====================

  /** 重新计算列宽 */
  const autoSizeColumns = () => {
    safeGridApiCall(api => {
      // 自动按内容计算列宽
      const colIds: string[] = []
      api.getColumns()?.forEach(col => {
        colIds.push(col.getColId())
      })
      if (colIds.length) {
        api.autoSizeColumns(colIds, false)
      }
    })
  }

  /** 让列宽适配容器宽度（无横向滚动） */
  const fitColumnsToViewport = () => {
    if (props.value.fitColumnsToViewport) {
      setTimeout(() => {
        safeGridApiCall(api => api.sizeColumnsToFit())
      }, 0)
    }
  }

  /** 导出数据 */
  const exportData = (format: 'csv' | 'excel') => {
    const data = getFilteredData()
    const displayData = transformDataForExport(
      data,
      processedColumnDefs.value,
      gridApi.value as any
    )
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')

    if (format === 'csv') {
      exportToCsv(displayData, `export-${timestamp}.csv`)
    } else {
      exportToExcel(displayData, `export-${timestamp}.xls`)
    }
  }

  /** 获取过滤后的数据 */
  const getFilteredData = (): any[] => {
    const filteredData: any[] = []
    safeGridApiCall(api => {
      api.forEachNodeAfterFilter(node => {
        if (node.data) {
          filteredData.push(node.data)
        }
      })
    })
    return filteredData.length > 0 ? filteredData : rowData.value
  }

  /** 设置行数据 */
  const setRowData = (data: any[]) => {
    rowData.value = data
    safeGridApiCall(api => api.setGridOption('rowData', data))
  }

  /** 添加行 - 使用 push 保持滚动位置 */
  const addRow = (row: any) => {
    rowData.value.push(row)
    safeGridApiCall(api => {
      // 使用 AG Grid 的 applyTransaction 进行增量更新，保持滚动位置
      api.applyTransaction({ add: [row] })
    })
  }

  /** 批量添加行 - 使用 push 保持滚动位置 */
  const addRows = (rows: any[]) => {
    rowData.value.push(...rows)
    safeGridApiCall(api => {
      // 使用 AG Grid 的 applyTransaction 进行增量更新，保持滚动位置
      api.applyTransaction({ add: rows })
    })
  }

  /** 无抖动数据加载方法 - 推荐使用此方法进行增量数据加载 */
  const loadMoreData = async (
    newRows: any[],
    options?: {
      preserveScrollPosition?: boolean
      scrollToBottom?: boolean
    }
  ) => {
    if (!newRows || newRows.length === 0) {
      return
    }

    const preserveScrollPosition = options?.preserveScrollPosition !== false // 默认保持滚动位置
    const scrollToBottom = options?.scrollToBottom || false

    // 获取当前滚动位置
    let scrollTopBefore = 0
    if (preserveScrollPosition && gridApi.value) {
      const gridBody = (gridApi.value as any).gridBodyCtrl?.eBodyViewport
      if (gridBody) {
        scrollTopBefore = gridBody.scrollTop
      }
    }

    // 使用 push 添加新数据，保持引用不变
    rowData.value.push(...newRows)

    // 使用 AG Grid 的 applyTransaction 进行增量更新
    safeGridApiCall(api => {
      api.applyTransaction({ add: newRows })
    })

    // 如果需要保持滚动位置，在下一帧恢复
    if (preserveScrollPosition && scrollTopBefore > 0) {
      await new Promise(resolve => setTimeout(resolve, 0)) // nextTick 等价
      safeGridApiCall(api => {
        const gridBody = (api as any).gridBodyCtrl?.eBodyViewport
        if (gridBody) {
          gridBody.scrollTop = scrollTopBefore
        }
      })
    }

    // 如果需要滚动到底部（如聊天窗口效果）
    if (scrollToBottom) {
      await new Promise(resolve => setTimeout(resolve, 0))
      safeGridApiCall(api => {
        // 滚动到最后一行的底部
        api.ensureIndexVisible(rowData.value.length - 1, 'bottom')
      })
    }
  }

  /** 更新行 */
  const updateRow = (row: any) => {
    if (gridApi.value) {
      const rowNode = gridApi.value.getRowNode(row.id || row.rowIndex)
      if (rowNode) {
        rowNode.setData(row)
      }
    }
  }

  /** 删除行 */
  const deleteRow = (row: any) => {
    if (gridApi.value) {
      const rowNode = gridApi.value.getRowNode(row.id || row.rowIndex)
      if (rowNode) {
        gridApi.value.applyTransaction({ remove: [row] })
      }
    }
  }

  /** 清空选择 */
  const clearSelection = () => {
    safeGridApiCall(api => api.deselectAll())
  }

  /** 选择所有行 */
  const selectAll = () => {
    safeGridApiCall(api => api.selectAll())
  }

  /** 反选 */
  const deselectAll = () => {
    safeGridApiCall(api => api.deselectAll())
  }

  /** 清除单元格聚焦 */
  const clearCellFocus = () => {
    safeGridApiCall(api => {
      // 尝试多种清除聚焦的方法
      try {
        // 方法1：清除聚焦单元格
        if (typeof api.clearFocusedCell === 'function') {
          api.clearFocusedCell()
        }
        // 方法2：设置聚焦到 null
        else if (typeof api.setFocusedCell === 'function') {
          api.setFocusedCell(0, '')
        }
        // 方法3：刷新单元格
        else {
          api.refreshCells({ force: true })
        }
      } catch (error) {
        console.warn('清除单元格聚焦失败:', error)
      }
    })

    // 方法4：直接通过 DOM 移除聚焦类
    if (gridContainer.value) {
      // gridContainer.value 是 Vue 组件实例，需要获取其 DOM 元素
      const containerElement = gridContainer.value.$el || gridContainer.value
      if (containerElement) {
        const focusedCells = containerElement.querySelectorAll('.ag-cell-focus')
        focusedCells.forEach((cell: Element) => {
          cell.classList.remove('ag-cell-focus')
        })
      }
    }
  }

  /** 复制聚焦单元格内容到剪贴板 */
  const copySelectedCellsToClipboard = () => {
    safeGridApiCall(api => {
      try {
        // 获取聚焦的单元格
        const focusedCell = api.getFocusedCell()
        if (!focusedCell) {
          return
        }

        // 获取聚焦单元格的行数据
        const rowNode = api.getDisplayedRowAtIndex(focusedCell.rowIndex)
        if (!rowNode || !rowNode.data) {
          return
        }

        // 获取聚焦单元格的值
        const column = api.getColumnDef(focusedCell.column.getColId())
        const field = focusedCell.column.getColId()
        const value = rowNode.data[field]

        // 如果有值格式化器，使用它来格式化值
        let displayValue = value
        if (column && column.valueFormatter && typeof column.valueFormatter === 'function') {
          try {
            displayValue = column.valueFormatter({
              value: value,
              data: rowNode.data,
              node: rowNode,
              colDef: column,
              column: focusedCell.column,
              api: api,
              context: {},
            })
          } catch (_error) {
            displayValue = value
          }
        }

        const clipboardData = String(displayValue || '')

        // 复制到剪贴板
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(clipboardData).catch(() => {
            // 降级方案：使用 document.execCommand
            fallbackCopyToClipboard(clipboardData)
          })
        } else {
          // 降级方案：使用 document.execCommand
          fallbackCopyToClipboard(clipboardData)
        }
      } catch (_error) {
        // 静默处理错误
      }
    })
  }

  /** 降级复制方案 */
  const fallbackCopyToClipboard = (text: string) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-999999px'
    textarea.style.top = '-999999px'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()

    try {
      document.execCommand('copy')
    } catch (_err) {
      // 静默处理错误
    } finally {
      document.body.removeChild(textarea)
    }
  }

  // ==================== Loading 控制方法 ====================

  /** 显示加载遮罩层（v32+ 使用 setGridOption，v31- 回退） */
  const showLoadingOverlay = () => {
    safeGridApiCall(api => {
      if ('setGridOption' in api) {
        ;(api as any).setGridOption('loading', true)
      } else {
        ;(api as any).showLoadingOverlay?.()
      }
    })
  }

  /** 隐藏遮罩层（v32+ 使用 setGridOption，v31- 回退） */
  const hideOverlay = () => {
    safeGridApiCall(api => {
      if ('setGridOption' in api) {
        ;(api as any).setGridOption('loading', false)
      } else {
        ;(api as any).hideOverlay?.()
      }
    })
  }

  /** 显示无数据遮罩层（接口未废弃，保留） */
  const showNoRowsOverlay = () => {
    safeGridApiCall(api => {
      ;(api as any).showNoRowsOverlay?.()
    })
  }

  /** 设置加载状态（统一控制方法，推荐使用） */
  const setLoading = (loading: boolean) => {
    safeGridApiCall(api => {
      if ('setGridOption' in api) {
        ;(api as any).setGridOption('loading', !!loading)
      } else {
        if (loading) {
          ;(api as any).showLoadingOverlay?.()
        } else {
          ;(api as any).hideOverlay?.()
        }
      }
    })
  }

  // ==================== 监听器 ====================

  // 监听来自外部的 rowData 引用变化（用于“整体替换”场景）
  // 说明：仅监听引用变化，不做深度监听，避免频繁刷新和滚动位置抖动
  watch(
    () => props.value.rowData,
    next => {
      const normalized = Array.isArray(next) ? next : []
      rowData.value = normalized
      // v32+ 使用 setGridOption，旧版回退
      safeGridApiCall(api => {
        if ('setGridOption' in api) {
          ;(api as any).setGridOption('rowData', normalized)
        } else {
          ;(api as any).setRowData?.(normalized)
        }
      })
    },
    { deep: false }
  )

  /** 监听列定义变化 */
  watch(
    () => props.value.columnDefs,
    () => {
      // 列定义变化时，需要重新设置列定义以触发样式重新应用
      if (gridApi.value) {
        // 重新设置列定义，这会触发 AG Grid 重新处理列样式
        gridApi.value.setGridOption('columnDefs', processedColumnDefs.value)
        // 然后刷新单元格
        gridApi.value.refreshCells()
      }
    },
    { deep: true }
  )

  /** 监听配色配置变化 */
  watch(
    () => props.value.colorConfig,
    () => {
      // 配色配置变化时，需要重新应用样式
      if (gridApi.value) {
        // 重新设置网格样式
        const containerElement = gridContainer.value?.$el || gridContainer.value
        if (containerElement) {
          Object.assign(containerElement.style, gridStyle.value)
        }
      }
    },
    { deep: true }
  )

  /** 监听尺寸配置变化 */
  watch(
    () => props.value.sizeConfig,
    () => {
      // 尺寸配置变化时，需要重新应用尺寸设置
      if (gridApi.value) {
        // 重新设置网格样式
        const containerElement = gridContainer.value?.$el || gridContainer.value
        if (containerElement) {
          Object.assign(containerElement.style, gridStyle.value)
        }

        // 重新应用 AG Grid 的尺寸设置
        const sizeOptions = sizeConfigToGridOptions(mergedSizeConfig.value)

        // 更新行高 - 通过重新设置 gridOptions
        if (sizeOptions.rowHeight) {
          gridApi.value.setGridOption('rowHeight', sizeOptions.rowHeight)
        }

        // 更新表头高度 - 通过重新设置 gridOptions
        if (sizeOptions.headerHeight) {
          gridApi.value.setGridOption('headerHeight', sizeOptions.headerHeight)
        }

        // 更新默认列宽 - 通过重新设置 gridOptions
        const currentDefaultColDef = gridApi.value.getGridOption('defaultColDef') || {}
        gridApi.value.setGridOption('defaultColDef', {
          ...currentDefaultColDef,
          width: sizeOptions.defaultColDef?.width,
        })

        // 如果切换到 auto 列宽，触发自动调整列宽
        if (mergedSizeConfig.value.defaultColumnWidth === 'auto') {
          setTimeout(() => {
            autoSizeColumns()
          }, 0)
        }

        // 更新最小列宽 - 通过重新设置 gridOptions
        if (sizeOptions.defaultColDef?.minWidth) {
          gridApi.value.setGridOption('defaultColDef', {
            ...gridApi.value.getGridOption('defaultColDef'),
            minWidth: sizeOptions.defaultColDef.minWidth,
          })
        }

        // 更新最大列宽 - 通过重新设置 gridOptions
        if (sizeOptions.defaultColDef?.maxWidth) {
          gridApi.value.setGridOption('defaultColDef', {
            ...gridApi.value.getGridOption('defaultColDef'),
            maxWidth: sizeOptions.defaultColDef.maxWidth,
          })
        }

        // 更新对齐方式 - 通过重新设置 gridOptions
        gridApi.value.setGridOption('defaultColDef', {
          ...currentDefaultColDef,
          cellStyle: {
            ...currentDefaultColDef.cellStyle,
            textAlign: mergedSizeConfig.value.globalCellTextAlign || 'center',
            display: 'flex',
            alignItems:
              mergedSizeConfig.value.globalCellVerticalAlign === 'top'
                ? 'flex-start'
                : mergedSizeConfig.value.globalCellVerticalAlign === 'bottom'
                  ? 'flex-end'
                  : 'center',
            justifyContent:
              mergedSizeConfig.value.globalCellTextAlign === 'center'
                ? 'center'
                : mergedSizeConfig.value.globalCellTextAlign === 'right'
                  ? 'flex-end'
                  : 'flex-start',
          },
          headerClass: `ag-header-${mergedSizeConfig.value.globalHeaderTextAlign || 'center'} ag-header-${mergedSizeConfig.value.globalHeaderVerticalAlign || 'middle'}`,
        })

        // 如果启用了自适应列宽，重新计算
        if (props.value.fitColumnsToViewport) {
          setTimeout(() => {
            gridApi.value?.sizeColumnsToFit()
          }, 0)
        }
      }
    },
    { deep: true }
  )

  /** 监听系统尺寸模式变化 */
  watch(
    () => sizeStore.size,
    () => {
      // 系统尺寸模式变化时，需要重新应用尺寸设置
      if (gridApi.value) {
        // 重新设置网格样式
        const containerElement = gridContainer.value?.$el || gridContainer.value
        if (containerElement) {
          Object.assign(containerElement.style, gridStyle.value)
        }

        // 重新应用 AG Grid 的尺寸设置
        const sizeOptions = sizeConfigToGridOptions(mergedSizeConfig.value)

        // 更新行高
        if (sizeOptions.rowHeight) {
          gridApi.value.setGridOption('rowHeight', sizeOptions.rowHeight)
        }

        // 更新表头高度
        if (sizeOptions.headerHeight) {
          gridApi.value.setGridOption('headerHeight', sizeOptions.headerHeight)
        }

        // 更新默认列宽
        const currentDefaultColDef = gridApi.value.getGridOption('defaultColDef') || {}
        gridApi.value.setGridOption('defaultColDef', {
          ...currentDefaultColDef,
          width: sizeOptions.defaultColDef?.width,
        })

        // 如果切换到 auto 列宽，触发自动调整列宽
        if (mergedSizeConfig.value.defaultColumnWidth === 'auto') {
          setTimeout(() => {
            autoSizeColumns()
          }, 0)
        }

        // 更新最小列宽
        if (sizeOptions.defaultColDef?.minWidth) {
          gridApi.value.setGridOption('defaultColDef', {
            ...gridApi.value.getGridOption('defaultColDef'),
            minWidth: sizeOptions.defaultColDef.minWidth,
          })
        }

        // 更新最大列宽
        if (sizeOptions.defaultColDef?.maxWidth) {
          gridApi.value.setGridOption('defaultColDef', {
            ...gridApi.value.getGridOption('defaultColDef'),
            maxWidth: sizeOptions.defaultColDef.maxWidth,
          })
        }

        // 更新对齐方式
        gridApi.value.setGridOption('defaultColDef', {
          ...currentDefaultColDef,
          cellStyle: {
            ...currentDefaultColDef.cellStyle,
            textAlign: mergedSizeConfig.value.globalCellTextAlign || 'center',
            display: 'flex',
            alignItems:
              mergedSizeConfig.value.globalCellVerticalAlign === 'top'
                ? 'flex-start'
                : mergedSizeConfig.value.globalCellVerticalAlign === 'bottom'
                  ? 'flex-end'
                  : 'center',
            justifyContent:
              mergedSizeConfig.value.globalCellTextAlign === 'center'
                ? 'center'
                : mergedSizeConfig.value.globalCellTextAlign === 'right'
                  ? 'flex-end'
                  : 'flex-start',
          },
          headerClass: `ag-header-${mergedSizeConfig.value.globalHeaderTextAlign || 'center'} ag-header-${mergedSizeConfig.value.globalHeaderVerticalAlign || 'middle'}`,
        })

        // 如果启用了自适应列宽，重新计算
        if (props.value.fitColumnsToViewport) {
          setTimeout(() => {
            gridApi.value?.sizeColumnsToFit()
          }, 0)
        }

        // 触发重新渲染
        gridApi.value.refreshCells()
      }
    }
  )

  // 移除 enableCellSpan 的动态监听，改为在组件层面处理

  /** 动态设置合并单元格样式 */
  const setMergedCellStyles = () => {
    if (!gridContainer.value) {
      return
    }

    // 获取当前配色配置
    const colorConfig = props.value.colorConfig || {}
    const enableZebraStripe = props.value.enableZebraStripe || false

    // 获取 DOM 元素 - gridContainer.value 是 Vue 组件实例，需要获取其 DOM 元素
    const containerElement = gridContainer.value.$el || gridContainer.value
    if (!containerElement || !containerElement.querySelectorAll) {
      return
    }

    // 查找所有单元格
    const allCells = containerElement.querySelectorAll('.ag-cell')

    // 遍历所有单元格，检查是否为合并单元格
    allCells.forEach((cell: any) => {
      const style = cell.style
      const computedStyle = window.getComputedStyle(cell)

      // 检查是否为合并单元格（通过高度或宽度判断）
      const height = parseInt(style.height) || parseInt(computedStyle.height)
      const width = parseInt(style.width) || parseInt(computedStyle.width)

      // 如果高度大于正常行高（通常是38px），说明是行合并
      // 如果宽度大于正常列宽，说明是列合并
      if (height > 40 || width > 150) {
        // 获取单元格所在的行信息
        const rowElement = cell.closest('.ag-row')
        const rowIndex = Array.from(rowElement?.parentNode?.children || []).indexOf(rowElement)
        const isOddRow = rowIndex % 2 === 1

        // 确定背景色
        let backgroundColor = ''

        if (enableZebraStripe) {
          // 开启斑马线：奇行使用 backgroundColor，偶行使用 oddRowBackgroundColor
          backgroundColor = isOddRow
            ? colorConfig.backgroundColor || 'var(--bg100)'
            : colorConfig.oddRowBackgroundColor || 'var(--bg200)'
        } else {
          // 未开启斑马线：所有行使用 backgroundColor
          backgroundColor = colorConfig.backgroundColor || 'var(--bg100)'
        }

        // 设置样式
        cell.style.backgroundColor = backgroundColor
        cell.style.background = backgroundColor
        cell.style.zIndex = '1000'
      }
    })
  }

  /** 监听功能开关变化 */
  watch(
    () => [
      props.value.enableSorting,
      props.value.enableFilter,
      props.value.enableColumnResize,
      props.value.rowSelection,
      props.value.enableRowClickSelection,
      props.value.selectionCheckboxPosition,
      props.value.enableRowHoverHighlight,
      props.value.enableCellFocusHighlight,
      props.value.enableColumnDrag,
      props.value.enableZebraStripe,
      props.value.enableVerticalSplitLine,
      props.value.enableHorizontalSplitLine,
      props.value.fitColumnsToViewport,
    ],
    () => {
      // 功能开关变化时，需要重新设置网格选项
      if (gridApi.value && !gridApi.value.isDestroyed()) {
        // 动态更新 defaultColDef
        const currentDefaultColDef = gridApi.value.getGridOption('defaultColDef') || {}
        gridApi.value.setGridOption('defaultColDef', {
          ...currentDefaultColDef,
          sortable: props.value.enableSorting ?? false,
          filter: props.value.enableFilter ?? false,
          resizable: props.value.enableColumnResize ?? false,
          suppressMovable: props.value.enableColumnDrag === false ? true : false,
        })

        // 延迟设置合并单元格样式
        setTimeout(() => {
          setMergedCellStyles()
        }, 100)

        // 动态更新 rowSelection
        const selection = (() => {
          if (!props.value.rowSelection) {
            return undefined
          }
          const isMultiple = props.value.rowSelection === 'multiple'
          const selectionObj: any = {
            mode: isMultiple ? 'multiRow' : 'singleRow',
            enableClickSelection: !!props.value.enableRowClickSelection,
            enableSelectionWithoutKeys: isMultiple ? true : false,
          }
          if (!selectionObj.enableClickSelection) {
            selectionObj.checkboxes = {
              headerCheckbox: isMultiple ? true : false,
              position: (props.value.selectionCheckboxPosition || 'left') as 'left' | 'right',
            }
          } else if (isMultiple) {
            selectionObj.checkboxes = {
              headerCheckbox: true,
              position: (props.value.selectionCheckboxPosition || 'left') as 'left' | 'right',
            }
          }
          return selectionObj
        })()

        // 动态更新 selectionColumnDef
        const selectionColumnDef = (() => {
          if (!props.value.rowSelection) {
            return undefined
          }
          const pos = (props.value.selectionCheckboxPosition || 'left') as 'left' | 'right'
          return {
            headerName: '',
            pinned: pos,
            width: 48,
            minWidth: 40,
            maxWidth: 60,
            resizable: false,
            sortable: false,
            suppressHeaderMenuButton: true,
            suppressMovable: true,
          } as any
        })()

        gridApi.value.setGridOption('rowSelection', selection)
        gridApi.value.setGridOption('selectionColumnDef', selectionColumnDef)

        // 重新设置列定义以确保选择框列位置正确
        gridApi.value.setGridOption('columnDefs', processedColumnDefs.value)

        // 动态更新 suppressRowHoverHighlight
        gridApi.value.setGridOption(
          'suppressRowHoverHighlight',
          props.value.enableRowHoverHighlight === false ? true : undefined
        )

        // 动态更新 columnHoverHighlight
        gridApi.value.setGridOption(
          'columnHoverHighlight',
          props.value.enableColumnHoverHighlight === false ? false : true
        )

        // 重新设置列定义以触发样式重新应用
        gridApi.value.setGridOption('columnDefs', processedColumnDefs.value)

        // 触发重新渲染以应用新的功能设置
        gridApi.value.refreshCells()

        // 如果启用了自适应列宽，重新计算
        if (props.value.fitColumnsToViewport) {
          setTimeout(() => {
            gridApi.value?.sizeColumnsToFit()
          }, 0)
        }
      }
    },
    { deep: true }
  )

  // ==================== 生命周期 ====================

  /** 处理点击外部区域清除聚焦 */
  const handleDocumentClick = (event: MouseEvent) => {
    // 检查点击是否在表格容器内
    if (gridContainer.value) {
      // gridContainer.value 是 Vue 组件实例，需要获取其 DOM 元素
      const containerElement = gridContainer.value.$el || gridContainer.value
      if (containerElement && !containerElement.contains(event.target as Node)) {
        clearCellFocus()
      }
    }
  }

  /** 处理键盘事件（复制功能） */
  const handleKeyDown = (event: KeyboardEvent) => {
    // 检查是否按下了 Ctrl+C 或 Cmd+C
    if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
      // 检查是否在表格容器内
      if (gridContainer.value) {
        const containerElement = gridContainer.value.$el || gridContainer.value
        if (containerElement && containerElement.contains(event.target as Node)) {
          // 阻止默认的复制行为
          event.preventDefault()
          // 执行自定义复制
          copySelectedCellsToClipboard()
        }
      }
    }
  }

  // 监听 enableCellFocusHighlight 变化，动态添加/移除事件监听器
  watch(
    () => props.value.enableCellFocusHighlight,
    enabled => {
      if (enabled) {
        document.addEventListener('click', handleDocumentClick)
      } else {
        document.removeEventListener('click', handleDocumentClick)
      }
    },
    { immediate: true }
  )

  // 监听 enableClipboard 变化，动态添加/移除键盘事件监听器
  watch(
    () => props.value.enableClipboard,
    enabled => {
      if (enabled) {
        document.addEventListener('keydown', handleKeyDown)
      } else {
        document.removeEventListener('keydown', handleKeyDown)
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    if (props.value.enableCellFocusHighlight) {
      document.addEventListener('click', handleDocumentClick)
    }
    if (props.value.enableClipboard) {
      document.addEventListener('keydown', handleKeyDown)
    }
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleDocumentClick)
    document.removeEventListener('keydown', handleKeyDown)
  })

  // ==================== 返回对象 ====================

  return {
    // 状态
    gridApi,
    rowData,
    selectedRows,
    gridContainer,

    // 计算属性
    gridOptions,
    mergedGridOptions,
    columnDefs: processedColumnDefs,
    gridStyle,
    gridClass,
    scrollbarStyles,
    toolbarStyle,
    statusBarStyle,

    // 方法
    autoSizeColumns,
    exportData,
    getFilteredData,
    setRowData,
    addRow,
    addRows,
    loadMoreData,
    updateRow,
    deleteRow,
    clearSelection,
    selectAll,
    deselectAll,
    clearCellFocus,
    copySelectedCellsToClipboard,
    showLoadingOverlay,
    hideOverlay,
    showNoRowsOverlay,
    setLoading,
  }
}

// ==================== 辅助组合式函数 ====================

/**
 * 使用表格验证
 */
export function useGridValidation(columnDefs: Ref<ExtendedColDef[]>, rowData: Ref<any[]>) {
  const validationErrors = ref<string[]>([])

  const validate = () => {
    const columnErrors = validateColumnDefs(columnDefs.value)
    const dataErrors = validateData(rowData.value, columnDefs.value)
    validationErrors.value = [...columnErrors, ...dataErrors]
    return validationErrors.value.length === 0
  }

  const clearErrors = () => {
    validationErrors.value = []
  }

  return {
    validationErrors: computed(() => validationErrors.value),
    validate,
    clearErrors,
  }
}

/**
 * 使用表格数据管理
 */
export function useGridData(initialData: any[] = []) {
  const data = ref<any[]>(initialData)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const setData = (newData: any[]) => {
    data.value = newData
  }

  const addData = (item: any) => {
    data.value.push(item)
  }

  const updateData = (index: number, item: any) => {
    if (index >= 0 && index < data.value.length) {
      data.value[index] = item
    }
  }

  const removeData = (index: number) => {
    if (index >= 0 && index < data.value.length) {
      data.value.splice(index, 1)
    }
  }

  const clearData = () => {
    data.value = []
  }

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  return {
    data,
    loading,
    error,
    setData,
    addData,
    updateData,
    removeData,
    clearData,
    setLoading,
    setError,
  }
}
