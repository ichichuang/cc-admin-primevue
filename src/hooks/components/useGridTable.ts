// @/hooks/components/useGridTable.ts
/**
 * useGridTable.ts
 * - 提供 GridTable 组件的操作方法和状态管理
 * - 封装 AG Grid 的常用 API 操作
 * - 提供主题、国际化、选择状态等管理功能
 */

import {
  autoSizeAllColumns,
  buildGridOptions,
  buildLocaleText,
  buildThemeParams,
  captureSelection as captureSelectionUtil,
  exportCsv as exportCsvUtil,
  generateGridKey,
  refreshAllCells,
  restoreSelection as restoreSelectionUtil,
  sizeColumnsToFit as sizeColumnsToFitUtil,
} from '@/components/modules/grid-table/utils/helper'
import type { GridTableExpose, GridTableProps } from '@/components/modules/grid-table/utils/types'
import { useLocale } from '@/hooks/modules/useLocale'
import { useColorStore, useSizeStore } from '@/stores'
import type { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community'
import { themeQuartz } from 'ag-grid-community'
import { computed, ref, watch, type Ref } from 'vue'

export interface UseGridTableOptions {
  /** 初始网格选项 */
  initialGridOptions?: GridOptions
  /** 是否启用选择状态持久化 */
  enableSelectionPersistence?: boolean
  /** 是否在挂载后自动调整列宽 */
  autoSizeOnMount?: boolean
  /** 是否使用新的配置模式 */
  useConfigMode?: boolean
}

export interface UseGridTableReturn {
  // 响应式状态
  gridApi: Ref<GridApi | null>
  columnApi: Ref<any | null>
  gridKey: Ref<string>
  localeText: Ref<any>
  customTheme: Ref<any>
  mergedGridOptions: Ref<GridOptions>

  // 选择状态管理
  preservedSelection: Ref<Set<string>>
  captureSelection: () => void
  restoreSelection: () => void

  // 网格操作方法
  refreshCells: () => void
  sizeColumnsToFit: () => void
  autoSizeAll: (skipHeader?: boolean) => void
  exportCsv: (params?: any) => void
  getSelectedRows: () => any[]
  getSelectedData: () => any[]
  setSelectedRows: (rows: any[]) => void
  clearSelection: () => void
  refreshData: () => void
  updateData: (data: any[]) => void

  // 网格准备就绪处理
  onGridReady: (event: GridReadyEvent) => void

  // 暴露的 API（用于组件 defineExpose）
  exposedApi: GridTableExpose
}

export function useGridTable(
  props: GridTableProps,
  options: UseGridTableOptions = {}
): UseGridTableReturn {
  const {
    initialGridOptions = {},
    enableSelectionPersistence = true,
    autoSizeOnMount = true,
  } = options

  // Grid API 引用
  const gridApi = ref<GridApi | null>(null)
  const columnApi = ref<any | null>(null)

  // 选中行持久化（在重建前保存，重建后恢复）
  const preservedSelection = ref<Set<string>>(new Set())

  // i18n：根据当前 t 生成 localeText
  const { $t, locale } = useLocale()
  const localeText = computed(() => buildLocaleText($t))

  // 主题联动
  const colorStore = useColorStore()
  const sizeStore = useSizeStore()
  const isDark = computed(() => colorStore.isDark)

  // 语言或主题变化时，使用 key 强制重建 Grid
  // gridKey 仅与语言相关，避免主题/尺寸变化导致整表重建从而丢失分页状态
  const gridKey = computed(() => {
    return generateGridKey(locale.value, false, 'static-theme', 'static-size')
  })

  // 在重建前捕获选择
  if (enableSelectionPersistence) {
    watch(
      [
        () => locale.value,
        () => isDark.value,
        () => colorStore.getThemeValue,
        () => sizeStore.getSize,
      ],
      () => {
        // 在可能触发重建或主题更新前，捕获选择与分页
        captureSelection()
        capturePagination()
      }
    )
  }

  const customTheme = computed(() => {
    // 确保响应式地访问 sizeStore 的属性
    const themeParams = buildThemeParams(isDark.value, colorStore, {
      isCompact: sizeStore.isCompact,
      isComfortable: sizeStore.isComfortable,
      getFontSizeValue: sizeStore.getFontSizeValue,
      getSize: sizeStore.getSize,
    })
    return themeQuartz.withParams(themeParams)
  })

  // 主题/尺寸变化时，动态更新 theme，避免通过 key 触发重建
  watch([() => isDark.value, () => colorStore.getThemeValue, () => sizeStore.getSize], () => {
    if (gridApi.value) {
      gridApi.value.setGridOption('theme', customTheme.value)
      // 使用主题 spacing：移除固定行高，让 Quartz 根据 params 控制密度
      gridApi.value.setGridOption('rowHeight', null as any)
      gridApi.value.setGridOption('headerHeight', null as any)
      // 主题变化后，刷新单元格以确保 spacing 等样式即时生效
      refreshAllCells(gridApi.value)
    }
  })

  // 组合最终 gridOptions
  const mergedGridOptions = computed(() => ({
    ...buildGridOptions(initialGridOptions, { onGridReady }),
    localeText: localeText.value as unknown as Record<string, string>,
    theme: customTheme.value,
  }))

  // 选择状态管理方法
  const captureSelection = () => {
    if (enableSelectionPersistence) {
      preservedSelection.value = captureSelectionUtil(gridApi.value)
    }
  }

  const restoreSelection = () => {
    if (enableSelectionPersistence) {
      restoreSelectionUtil(gridApi.value, preservedSelection.value)
      preservedSelection.value.clear()
    }
  }

  // 分页持久化
  const preservedPageSize = ref<number | null>(null)
  const preservedCurrentPage = ref<number | null>(null)

  const capturePagination = () => {
    if (!gridApi.value) {
      return
    }
    try {
      preservedPageSize.value = gridApi.value.paginationGetPageSize?.() ?? null
      preservedCurrentPage.value = gridApi.value.paginationGetCurrentPage?.() ?? null
    } catch {
      preservedPageSize.value = null
      preservedCurrentPage.value = null
    }
  }

  const restorePagination = () => {
    if (!gridApi.value) {
      return
    }
    try {
      if (preservedPageSize.value !== null) {
        gridApi.value.setGridOption?.('paginationPageSize', preservedPageSize.value)
      }
      if (preservedCurrentPage.value !== null) {
        const totalPages = (gridApi.value as any).paginationGetTotalPages?.() ?? undefined
        const target =
          totalPages !== undefined
            ? Math.max(0, Math.min(preservedCurrentPage.value, totalPages - 1))
            : Math.max(0, preservedCurrentPage.value)
        gridApi.value.paginationGoToPage?.(target)
      }
    } finally {
      preservedPageSize.value = null
      preservedCurrentPage.value = null
    }
  }

  // 网格准备就绪处理
  function onGridReady(event: GridReadyEvent) {
    gridApi.value = event.api
    const maybeColumnApi = (event as any).columnApi ?? (event.api as any)?.getColumnApi?.()
    columnApi.value = maybeColumnApi ?? null
    restoreSelection()
    restorePagination()

    // 自动调整列宽
    if (autoSizeOnMount) {
      requestAnimationFrame(() => sizeColumnsToFitUtil(gridApi.value))
    }
  }

  // 网格操作方法
  const refreshCells = () => refreshAllCells(gridApi.value)
  const sizeColumnsToFit = () => sizeColumnsToFitUtil(gridApi.value)
  const autoSizeAll = (skipHeader: boolean = false) =>
    autoSizeAllColumns(columnApi.value, skipHeader)
  const exportCsv = (params?: any) => exportCsvUtil(gridApi.value, params)

  // 新增的网格操作方法
  const getSelectedRows = () => gridApi.value?.getSelectedRows() || []
  const getSelectedData = () => gridApi.value?.getSelectedRows() || []
  const setSelectedRows = (rows: any[]) => {
    if (gridApi.value) {
      gridApi.value.deselectAll()
      rows.forEach(row => {
        const node = gridApi.value?.getRowNode(row.id)
        if (node) {
          node.setSelected(true)
        }
      })
    }
  }
  const clearSelection = () => gridApi.value?.deselectAll()
  const refreshData = () => {
    if (gridApi.value) {
      gridApi.value.refreshCells()
    }
  }
  const updateData = (data: any[]) => {
    if (gridApi.value) {
      gridApi.value.setGridOption('rowData', data)
    }
  }

  // 暴露的 API
  const exposedApi: GridTableExpose = {
    gridApi: gridApi as any,
    columnApi,
    refreshCells,
    sizeColumnsToFit,
    autoSizeAll,
    exportCsv,
    getSelectedRows,
    getSelectedData,
    setSelectedRows,
    clearSelection,
    refreshData,
    updateData,
  }

  return {
    // 响应式状态
    gridApi,
    columnApi,
    gridKey,
    localeText,
    customTheme,
    mergedGridOptions,

    // 选择状态管理
    preservedSelection,
    captureSelection,
    restoreSelection,

    // 网格操作方法
    refreshCells,
    sizeColumnsToFit,
    autoSizeAll,
    exportCsv,
    getSelectedRows,
    getSelectedData,
    setSelectedRows,
    clearSelection,
    refreshData,
    updateData,

    // 网格准备就绪处理
    onGridReady,

    // 暴露的 API
    exposedApi,
  }
}
