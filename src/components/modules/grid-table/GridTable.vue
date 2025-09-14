<script setup lang="ts">
import { useGridTable } from '@/hooks'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'
import { computed, ref, useAttrs, watch } from 'vue'
import { DatePickerEditor, DatePickerRenderer } from './components/date'
import { InputNumberEditor, InputNumberRenderer } from './components/number'
import { ToggleSwitchEditor, ToggleSwitchRenderer } from './components/switch'
import { InputTextEditor, InputTextRenderer } from './components/text'
import { GRID_TABLE_DEFAULT_CONFIG, GRID_TABLE_DEFAULT_PROPS } from './utils/constants'
import { extractListeners } from './utils/helper'
import { transformGridConfig } from './utils/transformer'
import type { GridTableConfig, GridTableProps } from './utils/types'

// 导入 AG Grid 基础样式与主题样式（Quartz）
// 注意：使用 Theming API 的 theme 选项时，不需要额外引入 ag-theme-quartz.css
// 若引入会导致主题参数被 CSS 默认值覆盖，参考官方错误 #239 文档

// 注册社区模块，修复错误 #272（无注册模块）
ModuleRegistry.registerModules([AllCommunityModule])

const attrs = useAttrs()
const listeners = computed(() => extractListeners(attrs))

const props = withDefaults(defineProps<GridTableProps>(), GRID_TABLE_DEFAULT_PROPS)

// 判断是否使用新的配置模式
const useConfigMode = computed(() => 'config' in props && props.config)

// 合并配置
const mergedConfig = computed(() => {
  if (useConfigMode.value) {
    return {
      ...GRID_TABLE_DEFAULT_CONFIG,
      ...props.config,
    } as GridTableConfig
  }
  return null
})

// 转换配置为 AG Grid 格式
const transformedConfig = computed(() => {
  if (mergedConfig.value) {
    return transformGridConfig(mergedConfig.value)
  }
  return null
})

// 兼容旧版本的列定义和数据
const columnDefs = computed(() => {
  if (transformedConfig.value) {
    return transformedConfig.value.columnDefs
  }
  return (props as any).columnDefs || []
})

const rowData = computed(() => {
  // 检查是否使用 infinite 行模型
  const isInfiniteModel = transformedConfig.value?.gridOptions?.rowModelType === 'infinite'
  if (isInfiniteModel) {
    return undefined // infinite 行模型不需要 rowData
  }

  if (transformedConfig.value) {
    return transformedConfig.value.gridOptions.rowData || props.modelValue || []
  }
  return (props as any).rowData || props.modelValue || []
})

const gridOptions = computed(() => {
  if (transformedConfig.value) {
    return transformedConfig.value.gridOptions
  }
  return (props as any).gridOptions || {}
})

// 内置组件注册
const builtinComponents = {
  // Text 组件
  inputTextRenderer: InputTextRenderer,
  inputTextEditor: InputTextEditor,
  // Number 组件
  inputNumberRenderer: InputNumberRenderer,
  inputNumberEditor: InputNumberEditor,
  // Date 组件
  datePickerRenderer: DatePickerRenderer,
  datePickerEditor: DatePickerEditor,
  // Boolean 组件
  toggleSwitchRenderer: ToggleSwitchRenderer,
  toggleSwitchEditor: ToggleSwitchEditor,
}

// 框架组件注册 - 内置组件 + 使用者传入的组件
const frameworkComponents = computed(() => {
  const userComponents = transformedConfig.value?.components || (props as any).components || {}
  return {
    ...builtinComponents,
    ...userComponents,
  }
})

// 使用 GridTable Hook
const { gridKey, mergedGridOptions, exposedApi } = useGridTable(props, {
  initialGridOptions: gridOptions,
  enableSelectionPersistence: true,
  autoSizeOnMount: true,
})

// 根容器用于查询内部滚动视口
const rootRef = ref<HTMLElement | null>(null)

// 容器样式
const containerStyle = computed(() => {
  const height = mergedConfig.value?.layout?.height || (props as any).height
  const width = mergedConfig.value?.layout?.width || (props as any).width

  // 处理 auto 高度：当高度为 auto 时，不设置容器高度，让 AG Grid 自动撑开
  const containerHeight = height === 'auto' ? undefined : height

  return {
    height: containerHeight,
    width,
  }
})

// 动态类名
const containerClasses = computed(() => {
  const classes = ['ag-theme-quartz', 'full']

  // 添加分割线控制类名
  const lineClasses = mergedGridOptions.value?.context?.lineClasses
  if (lineClasses && Array.isArray(lineClasses)) {
    classes.push(...lineClasses)
  }

  // 行/单元格高亮控制类
  const layout = mergedConfig.value?.layout || {}
  if (layout?.selectedCellBorderHighlight) {
    classes.push('cc-cell-border-highlight-on')
  }
  if (layout?.selectedCellBackgroundHighlight) {
    classes.push('cc-cell-background-highlight-on')
  }

  return classes
})

// 监听配置变化，更新数据
watch(
  () => props.modelValue,
  newData => {
    if (newData && exposedApi.updateData) {
      exposedApi.updateData(newData)
    }
  },
  { deep: true }
)

// 暴露 API
defineExpose(exposedApi)
</script>
<template lang="pug">
.full(:style='containerStyle')
  //- 使用自定义主题，不再需要手动设置 CSS 变量
  .full(ref='rootRef', :class='containerClasses')
    AgGridVue.full(
      :key='gridKey',
      :grid-options='mergedGridOptions',
      :row-data='rowData',
      :column-defs='columnDefs',
      :components='frameworkComponents',
      v-on='listeners'
    )
</template>
<style lang="scss" scope>
// ==================== 基础布局样式 ====================

/* 单元格包装器：确保内容占满整个单元格 */
.ag-cell-wrapper {
  width: 100%;
  height: 100%;
}

// ==================== 表头对齐控制 ====================

/* 表头标签：默认居中对齐 */
.ag-header-cell-label {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 表头对齐：与 transformer 中注入的 headerClass（left/center/right）配合 */
.ag-header-cell.left .ag-header-cell-label {
  justify-content: flex-start;
}
.ag-header-cell.center .ag-header-cell-label {
  justify-content: center;
}
.ag-header-cell.right .ag-header-cell-label {
  justify-content: flex-end;
}

// ==================== 单元格、表头内边距 ====================

/* 统一设置表头和单元格的内边距 */
.ag-header-cell,
.ag-cell {
  padding-left: var(--gaps) !important;
  padding-right: var(--gaps) !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
  margin: 0 !important;
  gap: 0 !important;
}

// ==================== 选中状态高亮样式 ====================

/* 单元格边框 */
.ag-cell-focus {
  border: none;
  outline: none;
}
.ag-cell-focus:not(.ag-cell-range-selected):focus-within,
.ag-cell-range-single-cell,
.ag-cell-range-single-cell.ag-cell-range-handle,
.ag-context-menu-open .ag-cell-focus:not(.ag-cell-range-selected),
.ag-context-menu-open .ag-full-width-row.ag-row-focus .ag-cell-wrapper.ag-row-group,
.ag-full-width-row.ag-row-focus:focus .ag-cell-wrapper.ag-row-group {
  border-color: transparent;
  outline-color: transparent;
}
/* 选中单元格边框 */
.cc-ag-cell-border-highlight {
  .ag-cell-focus {
    box-shadow: inset 0 0 0 1px var(--accent100);
  }
}
/* 选中单元格背景 */
.cc-ag-cell-background-highlight {
  .ag-cell-focus {
    background: color-mix(in srgb, var(--accent100) 15%, transparent);
  }
}

/* 选中行边框 */
.cc-ag-row-border-highlight {
  .ag-row-focus {
    box-shadow: inset 0 0 0 1px var(--accent100) !important;
  }
  .ag-pinned-left-cols-container {
    .ag-row-focus > * {
      border-top: 1px solid var(--accent100) !important;
      border-bottom: 1px solid var(--accent100) !important;
    }
    .ag-row-focus > *:first-child {
      border-left: 1px solid var(--accent100) !important;
    }
  }
}
/* 固定的左侧列 */
.ag-pinned-left-cols-container {
  .ag-row {
    padding: 0 !important;
    gap: 0 !important;
    margin: 0 !important;
    &:before {
      z-index: 12 !important;
    }
    .ag-cell {
      outline-color: transparent !important;
    }
    .ag-cell:not(:first-child) {
      border-right: 1px solid var(--bg300) !important;
    }
  }
}
/* 选中行背景 */
.cc-ag-row-background-highlight-on {
  .ag-row-focus {
    .ag-cell {
      background: color-mix(in srgb, var(--accent100) 15%, transparent) !important;
    }
  }
}
.cc-ag-row-background-highlight-off {
  .ag-row-focus {
    .ag-cell {
      background: transparent !important;
    }
  }
}
// ==================== 分割线控制样式 ====================

.ag-row-position-absolute {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  .ag-column-hover {
    background: color-mix(in srgb, var(--accent100) 6%, transparent) !important;
  }
}
/* 横向分割线控制 */
.cc-ag-horizontal-lines {
  .ag-row {
    border-top: 1px solid var(--bg300) !important;
    border-bottom: 1px solid var(--bg300) !important;
  }
  .ag-pinned-left-cols-container {
    .ag-row {
      .ag-cell {
        border-top: 1px solid var(--bg300) !important;
        border-bottom: 1px solid var(--bg300) !important;
      }
    }
  }
}
.cc-ag-no-horizontal-lines {
  .ag-row {
    border-bottom: 1px solid transparent !important;
  }
}
/* 纵向分割线控制 */
.cc-ag-vertical-lines {
  .ag-cell {
    border-right: 1px solid var(--bg300) !important;
  }
}
.cc-ag-no-vertical-lines {
  .ag-cell {
    border-right: 1px solid transparent !important;
  }
}
</style>
