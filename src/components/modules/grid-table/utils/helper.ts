// @/components/modules/grid-table/utils/helper.ts
/**
 * GridTable 工具函数
 *
 * 提供配色、尺寸转换和数据处理等工具函数
 */

import type { GridApi } from 'ag-grid-community'
import { AG_GRID_CSS_VARS } from './constants'
import type {
  ColumnColorConfig,
  ExtendedColDef,
  ExtendedColGroupDef,
  GridColorConfig,
  GridSizeConfig,
} from './types'

// ==================== 配色工具函数 ====================

/**
 * 将配色配置转换为 CSS 变量
 */
export function colorConfigToCssVars(colorConfig: GridColorConfig): Record<string, string> {
  const cssVars: Record<string, string> = {}

  Object.entries(AG_GRID_CSS_VARS).forEach(([cssVar, configKey]) => {
    const value = colorConfig[configKey as keyof GridColorConfig]
    if (value) {
      cssVars[cssVar] = value
    }
  })

  return cssVars
}

/**
 * 合并列级别配色配置
 */
export function mergeColumnColorConfig(
  globalConfig: GridColorConfig,
  columnConfig?: ColumnColorConfig
): ColumnColorConfig {
  if (!columnConfig) {
    return {}
  }

  return {
    headerBackgroundColor: columnConfig.headerBackgroundColor || globalConfig.headerBackgroundColor,
    headerTextColor: columnConfig.headerTextColor || globalConfig.headerTextColor,
    backgroundColor: columnConfig.backgroundColor || globalConfig.backgroundColor,
    textColor: columnConfig.textColor || globalConfig.rowTextColor,
    hoverBackgroundColor: columnConfig.hoverBackgroundColor || globalConfig.rowHoverBackgroundColor,
    hoverTextColor: columnConfig.hoverTextColor || globalConfig.rowHoverBackgroundColor,
  }
}

/**
 * 应用列级别配色到列定义
 */
export function applyColumnColorToColDef(
  colDef: ExtendedColDef,
  globalColorConfig: GridColorConfig,
  globalSizeConfig: GridSizeConfig
): ExtendedColDef {
  // 从 context 中读取配色配置
  const context = colDef.context as any

  // 生成唯一的列标识符
  const columnId = colDef.field || colDef.headerName || 'unknown'
  const columnClass = `custom-column-${columnId.replace(/[^a-zA-Z0-9]/g, '-')}`

  // 如果没有配色配置，清理已存在的样式并恢复到默认配置
  if (!context || !context.colorConfig) {
    // 清理已存在的样式
    const styleId = `column-style-${columnClass}`
    const existingStyle = document.getElementById(styleId)
    if (existingStyle) {
      existingStyle.remove()
    }

    // 清理 cellStyle 中的自定义样式，恢复到默认配置
    let cleanCellStyle = colDef.cellStyle
    if (typeof cleanCellStyle === 'object' && cleanCellStyle !== null) {
      // 移除自定义的配色样式，但保留其他样式
      const { backgroundColor: _backgroundColor, color: _color, ...rest } = cleanCellStyle as any
      cleanCellStyle = rest

      // 如果清理后为空对象，设置为 undefined，让 AG Grid 使用 defaultColDef 中的 cellStyle
      if (
        cleanCellStyle &&
        typeof cleanCellStyle === 'object' &&
        Object.keys(cleanCellStyle).length === 0
      ) {
        cleanCellStyle = undefined
      }
    } else {
      // 如果没有 cellStyle，设置为 undefined，让 AG Grid 使用 defaultColDef 中的 cellStyle
      cleanCellStyle = undefined
    }

    // 清理 headerClass 中的自定义类名，并恢复默认对齐方式
    let cleanHeaderClass = colDef.headerClass
    if (typeof cleanHeaderClass === 'string') {
      // 移除自定义类名
      cleanHeaderClass = cleanHeaderClass
        .replace(new RegExp(`\\b${columnClass}\\b`, 'g'), '')
        .trim()

      // 如果清理后为空，设置为 undefined，让 AG Grid 使用 defaultColDef 中的 headerClass
      if (!cleanHeaderClass) {
        cleanHeaderClass = undefined
      }
    } else {
      // 如果没有 headerClass，设置为 undefined，让 AG Grid 使用 defaultColDef 中的 headerClass
      cleanHeaderClass = undefined
    }

    return {
      ...colDef,
      cellStyle: cleanCellStyle,
      headerClass: cleanHeaderClass,
    }
  }

  const mergedColorConfig = mergeColumnColorConfig(globalColorConfig, context.colorConfig)

  // 注入列级 CSS 样式
  injectColumnStyles(columnClass, mergedColorConfig)

  // 单元格样式 - 只应用单元格相关的样式，保留原有的对齐方式
  const cellStyles: Record<string, string> = {}
  // 不在单元格层面设置背景色，避免与斑马线/选中/悬停等行级背景产生冲突
  if (mergedColorConfig.textColor) {
    cellStyles['color'] = mergedColorConfig.textColor
  }

  // 处理单元格对齐方式 - 按照优先级处理对齐方式
  // 优先级：1. context.cellTextAlign 2. globalSizeConfig.globalCellTextAlign 3. 默认配置
  const cellTextAlign = context?.cellTextAlign || globalSizeConfig.globalCellTextAlign || 'center'
  const cellVerticalAlign =
    context?.cellVerticalAlign || globalSizeConfig.globalCellVerticalAlign || 'middle'

  // 设置单元格对齐样式
  cellStyles['textAlign'] = cellTextAlign
  cellStyles['display'] = 'flex'
  cellStyles['alignItems'] =
    cellVerticalAlign === 'top'
      ? 'flex-start'
      : cellVerticalAlign === 'bottom'
        ? 'flex-end'
        : 'center'
  cellStyles['justifyContent'] =
    cellTextAlign === 'center' ? 'center' : cellTextAlign === 'right' ? 'flex-end' : 'flex-start'

  // 处理 headerClass - 按照优先级处理对齐方式
  let finalHeaderClass = colDef.headerClass
  if (finalHeaderClass) {
    // 如果已有 headerClass，添加自定义类名
    finalHeaderClass = `${finalHeaderClass} ${columnClass}`
  } else {
    // 如果没有 headerClass，按照优先级确定对齐方式
    // 优先级：1. context.headerTextAlign 2. globalSizeConfig.globalHeaderTextAlign 3. 默认配置
    const headerTextAlign =
      context?.headerTextAlign || globalSizeConfig.globalHeaderTextAlign || 'center'
    const headerVerticalAlign =
      context?.headerVerticalAlign || globalSizeConfig.globalHeaderVerticalAlign || 'middle'

    // 构建对齐类名
    const alignClass = `ag-header-${headerTextAlign} ag-header-${headerVerticalAlign}`
    finalHeaderClass = `${alignClass} ${columnClass}`
  }

  return {
    ...colDef,
    cellStyle: {
      ...colDef.cellStyle,
      ...cellStyles,
    },
    headerClass: finalHeaderClass,
  }
}

/**
 * 注入列级 CSS 样式
 */
function injectColumnStyles(columnClass: string, colorConfig: ColumnColorConfig) {
  const styleId = `column-style-${columnClass}`

  // 移除已存在的样式
  const existingStyle = document.getElementById(styleId)
  if (existingStyle) {
    existingStyle.remove()
  }

  // 创建新的样式
  const style = document.createElement('style')
  style.id = styleId

  let css = ''

  // 表头样式 - 只处理配色，不影响对齐方式
  const headerStyles: string[] = []
  if (colorConfig.headerBackgroundColor) {
    headerStyles.push(`background-color: ${colorConfig.headerBackgroundColor} !important`)
  }
  if (colorConfig.headerTextColor) {
    headerStyles.push(`color: ${colorConfig.headerTextColor} !important`)
  }
  if (headerStyles.length > 0) {
    // 使用更具体的选择器，只覆盖配色相关的样式，不影响对齐
    // 确保不覆盖 text-align 属性
    css += `[class^="ag-theme"] .ag-header-cell.${columnClass} { ${headerStyles.join('; ')}; }\n`
  }

  // 表头悬停样式（不影响行级背景）
  const headerHoverStyles: string[] = []
  if (colorConfig.hoverBackgroundColor) {
    headerHoverStyles.push(`background-color: ${colorConfig.hoverBackgroundColor} !important`)
  }
  if (colorConfig.hoverTextColor) {
    headerHoverStyles.push(`color: ${colorConfig.hoverTextColor} !important`)
  }
  if (headerHoverStyles.length > 0) {
    css += `[class^="ag-theme"] .ag-header-cell.${columnClass}:hover { ${headerHoverStyles.join('; ')}; }\n`
  }

  // 单元格悬停样式（不设置背景，交由全局 .ag-row-hover 控制，避免冲突）
  const cellHoverStyles: string[] = []
  if (colorConfig.hoverTextColor) {
    cellHoverStyles.push(`color: ${colorConfig.hoverTextColor} !important`)
  }
  if (cellHoverStyles.length > 0) {
    css += `[class^="ag-theme"] .ag-cell.${columnClass}:hover { ${cellHoverStyles.join('; ')}; }\n`
  }

  style.textContent = css
  document.head.appendChild(style)
}

// ==================== 尺寸工具函数 ====================

/**
 * 将尺寸配置转换为 AG Grid 选项
 */
export function sizeConfigToGridOptions(sizeConfig: GridSizeConfig) {
  return {
    rowHeight: sizeConfig.rowHeight,
    headerHeight: sizeConfig.headerHeight,
    defaultColDef: {
      width: sizeConfig.defaultColumnWidth === 'auto' ? undefined : sizeConfig.defaultColumnWidth,
      minWidth: sizeConfig.minColumnWidth,
      maxWidth: sizeConfig.maxColumnWidth,
    },
  }
}

/**
 * 应用列级别尺寸到列定义
 * 注意：此函数现在主要用于处理 context 中的对齐配置
 */
export function applyColumnSizeToColDef(
  colDef: ExtendedColDef,
  globalSizeConfig: GridSizeConfig
): ExtendedColDef {
  // 处理对齐方式 - 从 context 中读取
  const context = colDef.context as any
  if (
    !context ||
    (!context.cellTextAlign &&
      !context.headerTextAlign &&
      !context.cellVerticalAlign &&
      !context.headerVerticalAlign)
  ) {
    return colDef
  }

  const cellStyle = {
    ...colDef.cellStyle,
    textAlign: context.cellTextAlign || globalSizeConfig.globalCellTextAlign || 'left',
    display: 'flex',
    alignItems:
      context.cellVerticalAlign === 'top'
        ? 'flex-start'
        : context.cellVerticalAlign === 'bottom'
          ? 'flex-end'
          : 'center',
    justifyContent:
      context.cellTextAlign === 'center'
        ? 'center'
        : context.cellTextAlign === 'right'
          ? 'flex-end'
          : 'flex-start',
  }

  const headerClass = `ag-header-${context.headerTextAlign || globalSizeConfig.globalHeaderTextAlign || 'left'} ag-header-${context.headerVerticalAlign || globalSizeConfig.globalHeaderVerticalAlign || 'middle'}`

  return {
    ...colDef,
    cellStyle,
    headerClass,
  }
}

// ==================== 列定义处理函数 ====================

/**
 * 处理列定义，应用配色和尺寸配置
 */
export function processColumnDefs(
  columnDefs: ExtendedColDef[],
  colorConfig: GridColorConfig,
  sizeConfig: GridSizeConfig
): ExtendedColDef[] {
  return columnDefs.map(colDef => {
    // 检查是否有自定义配色配置
    const context = colDef.context as any
    const hasCustomColor = context && context.colorConfig

    let processedColDef = colDef

    // 只有当列有自定义配色配置时才应用配色处理
    if (hasCustomColor) {
      processedColDef = applyColumnColorToColDef(colDef, colorConfig, sizeConfig)
    }

    // 应用尺寸配置
    processedColDef = applyColumnSizeToColDef(processedColDef, sizeConfig)

    return processedColDef
  })
}

/**
 * 添加行号列
 */
export function addRowNumberColumn(columnDefs: ExtendedColDef[]): ExtendedColDef[] {
  const rowNumberCol: ExtendedColDef = {
    field: 'rowNumber',
    headerName: '#',
    width: 60,
    minWidth: 60,
    maxWidth: 60,
    resizable: false,
    sortable: false,
    pinned: 'left',
    valueGetter: (params: any) => {
      return params.node.rowIndex + 1
    },
  }

  return [rowNumberCol, ...columnDefs]
}

/**
 * 添加选择列
 */
// v32+ 选择列由 rowSelection.checkboxes 控制，此函数保留兼容导出但不做任何处理
export function addSelectionColumn(columnDefs: ExtendedColDef[]): ExtendedColDef[] {
  return columnDefs
}

/**
 * 生成自定义主题 CSS
 */
export function generateCustomThemeCss(colorConfig: GridColorConfig): string {
  const cssVars = colorConfigToCssVars(colorConfig)

  let css = '.ag-theme-custom {\n'

  Object.entries(cssVars).forEach(([varName, value]) => {
    css += `  ${varName}: ${value};\n`
  })

  css += '}\n'

  // 添加列级别样式
  css += `
.ag-theme-custom .custom-column-header {
  /* 列头自定义样式 */
}

.ag-theme-custom .ag-row:hover {
  /* 行悬停样式 */
}

.ag-theme-custom .ag-row-selected {
  /* 选中行样式 */
}
`

  return css
}

// ==================== 数据处理工具函数 ====================

/**
 * 格式化数据
 */
export function formatData(data: any[], formatters: Record<string, (value: any) => string>): any[] {
  return data.map(row => {
    const formattedRow = { ...row }

    Object.entries(formatters).forEach(([field, formatter]) => {
      if (formattedRow[field] !== undefined) {
        formattedRow[field] = formatter(formattedRow[field])
      }
    })

    return formattedRow
  })
}

/**
 * 过滤数据
 */
export function filterData(data: any[], filters: Record<string, any>): any[] {
  return data.filter(row => {
    return Object.entries(filters).every(([field, filterValue]) => {
      if (filterValue === null || filterValue === undefined || filterValue === '') {
        return true
      }

      const rowValue = row[field]
      if (typeof filterValue === 'string') {
        return String(rowValue).toLowerCase().includes(filterValue.toLowerCase())
      }

      return rowValue === filterValue
    })
  })
}

/**
 * 排序数据
 */
export function sortData(data: any[], sortField: string, sortOrder: 'asc' | 'desc'): any[] {
  return [...data].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue === bValue) {
      return 0
    }

    const comparison = aValue < bValue ? -1 : 1
    return sortOrder === 'asc' ? comparison : -comparison
  })
}

// ==================== 导出工具函数 ====================

/**
 * 导出为 CSV 格式
 */
export function exportToCsv(data: any[], filename: string = 'export.csv'): void {
  if (!data.length) {
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

/**
 * 导出为 Excel 格式（简单实现）
 */
export function exportToExcel(data: any[], filename: string = 'export.xls'): void {
  if (!data.length) {
    return
  }

  const headers = Object.keys(data[0])

  // 使用 Excel 兼容的 HTML 表格导出（.xls）
  const tableRows = data
    .map(
      row =>
        `<tr>${headers
          .map(
            h =>
              `<td>${(row[h] ?? '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;')}</td>`
          )
          .join('')}</tr>`
    )
    .join('')

  const tableHeader = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body><table>${tableHeader}${tableRows}</table></body></html>`

  const blob = new Blob([html], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download =
    filename.endsWith('.xls') || filename.endsWith('.xlsx') ? filename : `${filename}.xls`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ==================== 导出辅助：按列定义转换显示值 ====================

function flattenColumns(cols: (ExtendedColDef | ExtendedColGroupDef)[]): ExtendedColDef[] {
  const result: ExtendedColDef[] = []
  const walk = (items: (ExtendedColDef | ExtendedColGroupDef)[]) => {
    items.forEach(col => {
      const anyCol: any = col as any
      if ('children' in anyCol && Array.isArray((anyCol as ExtendedColGroupDef).children)) {
        walk((anyCol as ExtendedColGroupDef).children)
      } else {
        result.push(col as ExtendedColDef)
      }
    })
  }
  walk(cols)
  return result
}

/**
 * 根据列定义将数据转换为“显示值”，用于导出（应用 valueGetter/valueFormatter）
 */
export function transformDataForExport(
  data: any[],
  columnDefs: (ExtendedColDef | ExtendedColGroupDef)[],
  api?: GridApi | null
): any[] {
  const flatCols = flattenColumns(columnDefs).filter(c => !(c as any).hide)
  const headers = flatCols.map(c => c.headerName || (c.field as string) || '')

  const mapped = data.map(row => {
    const record: Record<string, any> = {}
    flatCols.forEach((col, idx) => {
      const key = headers[idx] || col.field || `col_${idx}`
      let value: any = col.field ? row[col.field] : undefined
      // valueGetter 优先
      if (typeof (col as any).valueGetter === 'function') {
        try {
          value = (col as any).valueGetter({
            data: row,
            api,
            getValue: (field: string) => row[field],
            colDef: col,
          })
        } catch (_e) {
          // ignore valueGetter error during export
        }
      }
      // valueFormatter 应用于最终显示
      if (typeof (col as any).valueFormatter === 'function') {
        try {
          value = (col as any).valueFormatter({ value, data: row, api, colDef: col })
        } catch (_e) {
          // ignore valueFormatter error during export
        }
      }
      record[key] = value ?? ''
    })
    return record
  })

  // 确保至少一个字段，避免导出函数报错
  if (mapped.length === 0 && headers.length) {
    mapped.push(Object.fromEntries(headers.map(h => [h, ''])))
  }
  return mapped
}

// ==================== 验证工具函数 ====================

/**
 * 验证列定义
 */
export function validateColumnDefs(columnDefs: ExtendedColDef[]): string[] {
  const errors: string[] = []

  columnDefs.forEach((colDef, index) => {
    if (!colDef.field && !colDef.headerName) {
      errors.push(`列 ${index} 缺少 field 或 headerName`)
    }

    if (colDef.width && colDef.minWidth && colDef.width < colDef.minWidth) {
      errors.push(`列 ${index} 的 width 不能小于 minWidth`)
    }

    if (colDef.width && colDef.maxWidth && colDef.width > colDef.maxWidth) {
      errors.push(`列 ${index} 的 width 不能大于 maxWidth`)
    }
  })

  return errors
}

/**
 * 验证数据格式
 */
export function validateData(data: any[], columnDefs: ExtendedColDef[]): string[] {
  const errors: string[] = []

  if (!Array.isArray(data)) {
    errors.push('数据必须是数组格式')
    return errors
  }

  const requiredFields = columnDefs.filter(col => col.field && !col.hide).map(col => col.field!)

  data.forEach((row, rowIndex) => {
    if (typeof row !== 'object' || row === null) {
      errors.push(`行 ${rowIndex} 数据格式错误`)
      return
    }

    requiredFields.forEach(field => {
      if (!(field in row)) {
        errors.push(`行 ${rowIndex} 缺少必需字段: ${field}`)
      }
    })
  })

  return errors
}

/**
 * 生成滚动条样式的 CSS 字符串
 * AG Grid 的滚动条样式需要通过 ::-webkit-scrollbar 伪元素控制
 */
export function generateScrollbarStyles(
  colorConfig: GridColorConfig,
  scrollbarSize: number = 12,
  options?: {
    enableHorizontalSplitLine?: boolean
    enableVerticalSplitLine?: boolean
    enableCellFocusHighlight?: boolean
    enableRowHoverHighlight?: boolean
    enableColumnHoverHighlight?: boolean
  }
): string {
  const scrollbarColor = colorConfig.scrollbarColor || 'var(--bg300)'
  const scrollbarHoverColor = colorConfig.scrollbarHoverColor || 'var(--primary100)'
  const scrollbarTrackColor = colorConfig.scrollbarTrackColor || 'var(--bg100)'
  const dndBg = (colorConfig as any).toolbarBackgroundColor || 'var(--bg200)'
  const dndBorder = colorConfig.borderColor || 'var(--bg300)'
  const dndText = colorConfig.headerTextColor || 'var(--text200)'

  const disableHorizontalBorders = options && options.enableHorizontalSplitLine === false
  const disableVerticalBorders = options && options.enableVerticalSplitLine === false
  const enableRowHoverHighlight = options && options.enableRowHoverHighlight !== false
  const enableColumnHoverHighlight = options && options.enableColumnHoverHighlight !== false

  const splitColor = colorConfig.borderColor || 'var(--bg300)'
  const rowHoverColor =
    colorConfig.rowHoverBackgroundColor || 'color-mix(in srgb, var(--bg300) 20%, transparent)'
  const selectedRowColor =
    colorConfig.selectedRowBackgroundColor ||
    'color-mix(in srgb, var(--accent100) 18%, transparent)'

  return `
    /* 滚动条整体样式 */
    .ag-theme-alpine ::-webkit-scrollbar {
      width: ${scrollbarSize}px;
      height: ${scrollbarSize}px;
    }

    /* 选中行高亮：确保中心区与左右固定列一致高亮 */
    [class^="ag-theme"] .ag-row-selected .ag-cell {
      background-color: ${selectedRowColor} !important;
    }
    [class^="ag-theme"] .ag-pinned-left-cols-container .ag-row-selected .ag-cell,
    [class^="ag-theme"] .ag-pinned-right-cols-container .ag-row-selected .ag-cell,
    [class^="ag-theme"] .ag-center-cols-container .ag-row-selected .ag-cell {
      background-color: ${selectedRowColor} !important;
    }

    /* 选中行时，合并单元格依然保持继承背景，避免露底 */
    [class^="ag-theme"] .ag-row-selected .ag-cell[style*='height: 76px'],
    [class^="ag-theme"] .ag-row-selected .ag-cell[style*='height: 114px'],
    [class^="ag-theme"] .ag-row-selected .ag-cell[style*='height: 152px'],
    [class^="ag-theme"] .ag-row-selected .ag-cell[style*='height: 190px'] {
      background-color: inherit !important;
    }

    /* 滚动条轨道样式 */
    .ag-theme-alpine ::-webkit-scrollbar-track {
      background: ${scrollbarTrackColor};
      border-radius: 6px;
    }

    /* 滚动条滑块样式 */
    .ag-theme-alpine ::-webkit-scrollbar-thumb {
      background: ${scrollbarColor};
      border-radius: 6px;
      border: 2px solid ${scrollbarTrackColor};
    }

    /* 滚动条滑块悬停样式 */
    .ag-theme-alpine ::-webkit-scrollbar-thumb:hover {
      background: ${scrollbarHoverColor};
    }

    /* 滚动条角落样式 */
    .ag-theme-alpine ::-webkit-scrollbar-corner {
      background: ${scrollbarTrackColor};
    }

    /* 拖拽表头 Ghost 样式融合系统颜色 */
    [class^="ag-theme"] .ag-dnd-ghost {
      background: ${dndBg} !important;
      border: 1px solid ${dndBorder} !important;
      color: ${dndText} !important;
      box-shadow: 0 4px 14px rgba(0,0,0,.18);
    }

    /* 圆角：仅给根容器加圆角，不影响内部滚动 */
    [class^="ag-theme"] .ag-root-wrapper,
    [class^="ag-theme"] .ag-root {
      border-radius: var(--rounded);
    }

    ${
      enableRowHoverHighlight
        ? `
    /* 斑马线：强制在所有容器中的单元格应用行级奇偶背景，避免被其他样式干扰 */
    [class^="ag-theme"] .ag-row-odd .ag-cell {
      background-color: var(--ag-odd-row-background-color) !important;
    }
    [class^="ag-theme"] .ag-row-even .ag-cell {
      background-color: var(--ag-background-color) !important;
    }

    /* 行悬停高亮样式 - 使用 AG Grid 的 ag-row-hover 类，确保所有列都能正确高亮 */
    [class^="ag-theme"] .ag-row-hover .ag-cell {
      background-color: ${rowHoverColor} !important;
    }

    /* 固定列悬停高亮 - 使用 ag-row-hover 类 */
    [class^="ag-theme"] .ag-row-hover .ag-pinned-left-cols-container .ag-cell,
    [class^="ag-theme"] .ag-row-hover .ag-pinned-right-cols-container .ag-cell {
      background-color: ${rowHoverColor} !important;
    }

    /* 中心列悬停高亮 - 使用 ag-row-hover 类 */
    [class^="ag-theme"] .ag-row-hover .ag-center-cols-container .ag-cell {
      background-color: ${rowHoverColor} !important;
    }

    ${
      // 仅在开启聚焦高亮时，才让“焦点高亮”覆盖行悬停高亮
      options && options.enableCellFocusHighlight !== false
        ? `
    /* 焦点优先级：当单元格处于焦点时，优先显示焦点高亮而非悬停高亮 */
    [class^="ag-theme"] .ag-row-hover .ag-cell.ag-cell-focus,
    [class^="ag-theme"] .ag-cell.ag-cell-focus {
      background-color: var(--ag-cell-focus-background-color, ${rowHoverColor}) !important;
    }
    `
        : ''
    }

    /* 排除合并单元格的悬停高亮 - 避免半透明背景露出底层单元格 */
    [class^="ag-theme"] .ag-row-hover .ag-cell[style*='height: 76px'],
    [class^="ag-theme"] .ag-row-hover .ag-cell[style*='height: 114px'],
    [class^="ag-theme"] .ag-row-hover .ag-cell[style*='height: 152px'],
    [class^="ag-theme"] .ag-row-hover .ag-cell[style*='height: 190px'] {
      background-color: inherit !important;
    }

    /* 注意：不再使用基于宽度的选择器来识别列合并，避免误伤正常列 */
    `
        : `
    /* 关闭行悬停高亮 */
    [class^="ag-theme"] .ag-row-hover .ag-cell {
      background-color: transparent !important;
    }
    `
    }

    ${
      enableColumnHoverHighlight
        ? `
    /* 列悬停高亮样式 - 使用更强特异性的选择器覆盖斑马线/基础背景 */
    [class^="ag-theme"] .ag-cell.ag-column-hover,
    [class^="ag-theme"] .ag-column-hover,
    [class^="ag-theme"] .ag-pinned-left-cols-container .ag-cell.ag-column-hover,
    [class^="ag-theme"] .ag-pinned-right-cols-container .ag-cell.ag-column-hover,
    [class^="ag-theme"] .ag-center-cols-container .ag-cell.ag-column-hover {
      background-color: ${rowHoverColor} !important;
    }
    /* 表头列悬停（与行效果一致） */
    [class^="ag-theme"] .ag-header-cell.ag-column-hover {
      background-color: ${rowHoverColor} !important;
    }
    ${
      options && options.enableCellFocusHighlight !== false
        ? `
    /* 焦点优先级：当单元格处于焦点时，优先显示焦点高亮 */
    [class^="ag-theme"] .ag-cell.ag-column-hover.ag-cell-focus,
    [class^="ag-theme"] .ag-cell-focus.ag-column-hover {
      background-color: var(--ag-cell-focus-background-color, ${rowHoverColor}) !important;
    }
    `
        : ''
    }
    `
        : `
    /* 关闭列悬停高亮 */
    [class^="ag-theme"] .ag-cell.ag-column-hover,
    [class^="ag-theme"] .ag-column-hover {
      background-color: transparent !important;
    }
    `
    }

    ${
      disableHorizontalBorders
        ? `
    /* 关闭横向分割线（行间边框） */
    [class^="ag-theme"] .ag-row {
      border-top: 0 !important;
      border-bottom: 0 !important;
    }
    `
        : ''
    }

    ${
      disableVerticalBorders
        ? `
    /* 关闭纵向分割线（列间边框） */
    [class^="ag-theme"] .ag-cell,
    [class^="ag-theme"] .ag-header-cell,
    [class^="ag-theme"] .ag-cell-last-left-pinned,
    [class^="ag-theme"] .ag-header-cell-resize::after {
      border-right: 0 !important;
      border-left: 0 !important;
    }
    `
        : `
    /* 开启纵向分割线：中心区域普通列添加右侧边框（排除最后一列） */
    [class^="ag-theme"] .ag-center-cols-container .ag-row > .ag-cell:not(:last-child) {
      border-right: 1px solid ${splitColor};
    }

    /* 合并单元格背景色 - 通过高度和宽度识别合并单元格 */
    [class^="ag-theme"] .ag-cell {
      /* 默认样式 */
    }

    /* 行合并单元格（高度大于正常行高） - 使用继承背景色 */
    [class^="ag-theme"] .ag-cell[style*="height: 76px"],
    [class^="ag-theme"] .ag-cell[style*="height: 114px"],
    [class^="ag-theme"] .ag-cell[style*="height: 152px"] {
      background-color: inherit !important;
      background: inherit !important;
    }

    /* 取消基于宽度识别列合并的规则（会误判普通列导致配色错位） */

    /* 合并单元格：尽量交给 AG Grid 默认渲染，避免覆盖到相邻列/斑马线背景 */

    /* 表头纵向分割线：确保表头也有分割线 */
    [class^="ag-theme"] .ag-center-cols-container .ag-header-row > .ag-header-cell:not(:last-child),
    [class^="ag-theme"] .ag-header-row > .ag-header-cell:not(:last-child),
    [class^="ag-theme"] .ag-header-cell:not(:last-child) {
      border-right: 1px solid ${splitColor} !important;
    }
    `
    }

    /* 固定列边界：无论是否开启纵向分割线都显示边界线 */
    /* 固定在左侧的列：无论是否开启纵向分割线，都显示右侧分割线 */
    [class^="ag-theme"] .ag-pinned-left-header,
    [class^="ag-theme"] .ag-pinned-left-cols-container,
    [class^="ag-theme"] .ag-pinned-left-cols-viewport {
      border-right: 1px solid ${splitColor} !important;
      box-shadow: inset -1px 0 0 ${splitColor};
    }
    /* 使用伪元素在容器最右侧画一条独立的分割线，避免被单元格样式覆盖 */
    [class^="ag-theme"] .ag-pinned-left-cols-container,
    [class^="ag-theme"] .ag-pinned-left-header {
      position: relative !important;
    }
    [class^="ag-theme"] .ag-pinned-left-cols-container::after,
    [class^="ag-theme"] .ag-pinned-left-header::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 1px;
      height: 100%;
      background: ${splitColor};
      pointer-events: none;
      z-index: 2;
    }
    /* 左固定列的“最后一个单元格”强制右边框（逐格兜底，确保每行都有分割线） */
    [class^="ag-theme"] .ag-pinned-left-cols-container .ag-cell-last-left-pinned {
      border-right: 1px solid ${splitColor} !important;
    }
    /* 左固定表头的“最后一个表头单元格”强制右边框 */
    [class^="ag-theme"] .ag-pinned-left-header .ag-header-cell:last-child {
      border-right: 1px solid ${splitColor} !important;
    }
    [class^="ag-theme"] .ag-pinned-right-header,
    [class^="ag-theme"] .ag-pinned-right-cols-container {
      border-left: 1px solid ${splitColor} !important;
    }

    /* 避免边界重复：移除紧邻边界的单元格内部边框（防止看起来更粗） */
    [class^="ag-theme"] .ag-pinned-right-cols-container .ag-row > .ag-cell:first-child {
      border-left: 0 !important;
    }
    [class^="ag-theme"] .ag-pinned-left-cols-container .ag-row > .ag-cell:last-child {
      border-right: 0 !important;
    }
    [class^="ag-theme"] .ag-pinned-right-header .ag-header-cell:first-child {
      border-left: 0 !important;
    }
    [class^="ag-theme"] .ag-pinned-left-header .ag-header-cell:last-child {
      border-right: 0 !important;
    }

    /* 单元格聚焦背景色高亮 */
    ${
      options && options.enableCellFocusHighlight !== false
        ? `
    [class^="ag-theme"] .ag-cell-focus {
      background-color: ${colorConfig.cellFocusBackgroundColor || 'color-mix(in srgb, var(--accent100) 20%, transparent)'} !important;
    }
    `
        : `
    [class^="ag-theme"] .ag-cell-focus {
      /* 关闭聚焦高亮时，继承所在行/列的背景，不遮挡行/列高亮 */
      background-color: inherit !important;
    }
    `
    }

    /* 表头对齐样式 - 使用更具体的选择器 */
    [class^="ag-theme"] .ag-header-cell.ag-header-left .ag-header-cell-label,
    [class^="ag-theme"] .ag-header-cell.ag-header-left {
      text-align: left !important;
      display: flex !important;
      align-items: center !important;
      justify-content: flex-start !important;
    }
    [class^="ag-theme"] .ag-header-cell.ag-header-center .ag-header-cell-label,
    [class^="ag-theme"] .ag-header-cell.ag-header-center {
      text-align: center !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    [class^="ag-theme"] .ag-header-cell.ag-header-right .ag-header-cell-label,
    [class^="ag-theme"] .ag-header-cell.ag-header-right {
      text-align: right !important;
      display: flex !important;
      align-items: center !important;
      justify-content: flex-end !important;
    }

    /* 表头垂直对齐样式 */
    [class^="ag-theme"] .ag-header-cell.ag-header-top {
      align-items: flex-start !important;
    }
    [class^="ag-theme"] .ag-header-cell.ag-header-middle {
      align-items: center !important;
    }
    [class^="ag-theme"] .ag-header-cell.ag-header-bottom {
      align-items: flex-end !important;
    }
  `
}

// ==================== 配置工具函数 ====================

/**
 * 根据尺寸模式获取尺寸配置
 * @param mode 尺寸模式：'compact'(紧凑)、'default'(默认)、'comfortable'(宽松)
 * @returns 对应的尺寸配置
 */
// 已移除多尺寸模式，仅保留 DEFAULT_GRID_SIZE_CONFIG

/**
 * 合并配色配置 - 将用户自定义配置与默认配置合并
 * @param base 基础配色配置
 * @param override 用户自定义的配色配置（部分覆盖）
 * @returns 合并后的配色配置
 */
export function mergeColorConfig(
  base: GridColorConfig,
  override: Partial<GridColorConfig>
): GridColorConfig {
  return { ...base, ...override }
}

/**
 * 合并尺寸配置 - 将用户自定义配置与默认配置合并
 * @param base 基础尺寸配置
 * @param override 用户自定义的尺寸配置（部分覆盖）
 * @returns 合并后的尺寸配置
 */
export function mergeSizeConfig(
  base: GridSizeConfig,
  override: Partial<GridSizeConfig>
): GridSizeConfig {
  return { ...base, ...override }
}
