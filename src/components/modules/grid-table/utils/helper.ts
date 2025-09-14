// @/components/grid-table/utils/helper.ts
/**
 * helper.ts
 * - GridTable 工具方法
 * - 选择状态管理
 * - 主题配置构建
 * - 网格选项构建
 * - 国际化文本构建
 */
import type { Column, CsvExportParams, GridApi, GridOptions } from 'ag-grid-community'
import { DEFAULT_GRID_OPTIONS, THEME_SPACING } from './constants'
import type { GridOptionsHooks, LocaleTextMap, ThemeParams } from './types'

// ==================== 网格选项构建 ====================

/**
 * 构建网格选项
 */
export function buildGridOptions(
  user: GridOptions | undefined,
  hooks: GridOptionsHooks
): GridOptions {
  // 注意：getRowId 是初始属性，不能被用户配置覆盖
  const { getRowId: _getRowId, ...userOptions } = user || {}
  const base: GridOptions = {
    ...DEFAULT_GRID_OPTIONS,
    onGridReady: hooks.onGridReady,
  }
  return {
    ...base,
    ...userOptions,
    // 确保 getRowId 始终使用默认值
    getRowId: DEFAULT_GRID_OPTIONS.getRowId,
  }
}

// ==================== 网格 API 操作 ====================

/**
 * 自适应列宽
 */
export function sizeColumnsToFit(api: GridApi | null | undefined) {
  api?.sizeColumnsToFit()
}

/**
 * 刷新所有单元格
 */
export function refreshAllCells(api: GridApi | null | undefined) {
  api?.refreshCells({ force: true })
}

/**
 * 自动调整所有列宽
 */
export function autoSizeAllColumns(columnApi: any | null | undefined, skipHeader: boolean = false) {
  const cols = columnApi?.getColumns() || []
  const allColIds = (cols as Column[]).map((c: Column) => c.getColId())
  if (allColIds.length) {
    columnApi?.autoSizeColumns(allColIds, skipHeader)
  }
}

/**
 * 导出 CSV
 */
export function exportCsv(api: GridApi | null | undefined, params?: CsvExportParams) {
  api?.exportDataAsCsv(params)
}

// ==================== 选择状态管理 ====================

/**
 * 捕获当前选择状态
 */
export function captureSelection(api: GridApi | null | undefined): Set<string> {
  if (!api) {
    return new Set()
  }
  const ids = api.getSelectedNodes().map(n => String(n.id))
  return new Set(ids)
}

/**
 * 恢复选择状态
 */
export function restoreSelection(api: GridApi | null | undefined, preservedSelection: Set<string>) {
  if (!api || preservedSelection.size === 0) {
    return
  }
  api.forEachNode(node => {
    if (preservedSelection.has(String(node.id))) {
      node.setSelected(true)
    }
  })
}

// ==================== 主题配置构建 ====================

/**
 * 构建主题参数
 */
export function buildThemeParams(isDark: boolean, colorStore: any, sizeStore: any): ThemeParams {
  return {
    // 基础配置
    spacing: sizeStore.isCompact
      ? THEME_SPACING.compact
      : sizeStore.isComfortable
        ? THEME_SPACING.comfortable
        : THEME_SPACING.spacious,
    accentColor: colorStore.getAccent100,

    // 头部
    headerBackgroundColor: colorStore.getBg200,
    headerFontSize: sizeStore.getFontSizeValue,
    headerTextColor: colorStore.getText100,

    // 主体
    backgroundColor: colorStore.getBg100,
    browserColorScheme: isDark ? 'dark' : 'light',
    foregroundColor: colorStore.getText100,
    fontSize: sizeStore.getFontSizeValue,

    // 表格项选中样式
    borderColor: colorStore.getBg300,
  }
}

// ==================== 国际化文本构建 ====================

/**
 * 根据项目 i18n t 函数构建 AG Grid localeText
 */
export function buildLocaleText(t: (key: string) => string): LocaleTextMap {
  const $ = (k: string, d: string) => t(k) || d
  return {
    // 通用
    page: $('common.pagination.page', 'Page'),
    more: $('common.more', 'More'),
    to: $('common.pagination.to', 'to'),
    of: $('common.pagination.of', 'of'),
    next: $('common.pagination.next', 'Next'),
    last: $('common.pagination.last', 'Last'),
    first: $('common.pagination.first', 'First'),
    previous: $('common.pagination.previous', 'Previous'),
    loadingOoo: $('common.loading', 'Loading...'),

    // 分页
    pageSizeSelectorLabel: $('common.pagination.pageSize', 'Items per page'),
    showing: $('common.pagination.showing', 'Showing'),
    items: $('common.pagination.items', 'items'),
    total: $('common.pagination.total', 'of'),

    // 过滤
    filterOoo: $('common.filter.placeholder', 'Filter...'),
    applyFilter: $('common.filter.apply', 'Apply'),
    clearFilter: $('common.filter.clear', 'Clear'),
    equals: $('common.filter.equals', 'Equals'),
    notEqual: $('common.filter.notEqual', 'Not equal'),
    contains: $('common.filter.contains', 'Contains'),
    notContains: $('common.filter.notContains', 'Not contains'),
    startsWith: $('common.filter.startsWith', 'Starts with'),
    endsWith: $('common.filter.endsWith', 'Ends with'),
    blank: $('common.filter.blank', 'Blank'),
    notBlank: $('common.filter.notBlank', 'Not blank'),
    lessThan: $('common.filter.lessThan', 'Less than'),
    lessThanOrEqual: $('common.filter.lessThanOrEqual', 'Less than or equal'),
    greaterThan: $('common.filter.greaterThan', 'Greater than'),
    greaterThanOrEqual: $('common.filter.greaterThanOrEqual', 'Greater than or equal'),
    andCondition: $('common.filter.andCondition', 'AND'),
    orCondition: $('common.filter.orCondition', 'OR'),

    // 侧边栏/列
    columns: $('common.columns', 'Columns'),
    filters: $('common.filters', 'Filters'),
  }
}

// ==================== 网格键生成 ====================

/**
 * 生成网格重建键
 */
export function generateGridKey(
  locale: string,
  isDark: boolean,
  themeValue: string,
  sizeValue: string,
  selectionConfig?: any
): string {
  const selectionKey = selectionConfig
    ? `${selectionConfig.mode || 'none'}-${selectionConfig.checkboxes || false}-${selectionConfig.clickToSelect || false}`
    : 'none'
  return `ag-grid-${locale}-${isDark ? 'dark' : 'light'}-${themeValue}-${sizeValue}-${selectionKey}`
}

// ==================== 事件监听器处理 ====================

/**
 * 从 attrs 中提取事件监听器
 */
export function extractListeners(attrs: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(attrs)) {
    if (key.startsWith('on') && (typeof value === 'function' || Array.isArray(value))) {
      result[key] = value
    }
  }
  return result
}
