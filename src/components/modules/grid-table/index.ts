export { default as ActionCell } from './components/ActionCell.tsx'
export { default as GridTable } from './GridTable.vue'

// Re-export commonly used types for external usage
export type {
  ColumnColorConfig,
  ColumnSizeConfig,
  // 工具类型
  DeepPartial,
  ExcludeKeys,
  // 列定义
  ExtendedColDef,
  ExtendedColGroupDef,
  // 配色配置
  GridColorConfig,
  // 尺寸配置
  GridSizeConfig,
  GridTableEmits,
  // 组件 Props 和事件
  GridTableProps,
  // 基础类型
  PickKeys,
  // 组合式函数返回类型
  UseRevoGridReturn,
} from './utils/types'

// Re-export constants for external usage
export {
  AG_GRID_CSS_VARS,
  COMFORTABLE_GRID_SIZE_CONFIG,
  COMPACT_GRID_SIZE_CONFIG,
  createDefaultGridTableProps,
  DEFAULT_GRID_COLOR_CONFIG,
  DEFAULT_GRID_SIZE_CONFIG,
  getGridSizeConfigByMode,
  LOOSE_GRID_SIZE_CONFIG,
  SIZE_MODE_TO_GRID_CONFIG,
  type SizeMode,
} from './utils/constants'

// Re-export helper functions for external usage
export {
  addRowNumberColumn,
  addSelectionColumn,
  applyColumnColorToColDef,
  applyColumnSizeToColDef,
  colorConfigToCssVars,
  exportToCsv,
  exportToExcel,
  filterData,
  formatData,
  generateCustomThemeCss,
  generateScrollbarStyles,
  mergeColorConfig,
  mergeColumnColorConfig,
  mergeSizeConfig,
  processColumnDefs,
  sizeConfigToGridOptions,
  sortData,
  validateColumnDefs,
  validateData,
} from './utils/helper'

// Re-export hooks for external usage
export { useGridData, useGridValidation, useRevoGrid } from '@/hooks/components/useGridTable'
