<script setup lang="ts">
import { useGridTable } from '@/hooks'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'
import { computed, ref, useAttrs, watch } from 'vue'
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

// 框架组件注册 - 由使用者通过 props 传入
const frameworkComponents = computed(() => {
  if (transformedConfig.value) {
    return transformedConfig.value.components
  }
  return (props as any).components || {}
})

// 使用 GridTable Hook
const { gridKey, mergedGridOptions, exposedApi } = useGridTable(props, {
  initialGridOptions: gridOptions.value,
  enableSelectionPersistence: true,
  autoSizeOnMount: true,
})

// 根容器用于查询内部滚动视口
const rootRef = ref<HTMLElement | null>(null)

// 容器样式
const containerStyle = computed(() => {
  const height = mergedConfig.value?.layout?.height || (props as any).height
  const width = mergedConfig.value?.layout?.width || (props as any).width
  return { height, width }
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
.grid-table-wrapper(:style='containerStyle')
  //- 使用自定义主题，不再需要手动设置 CSS 变量
  .ag-theme-quartz.full(ref='rootRef')
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
.grid-table-wrapper {
  display: flex;
  flex-direction: column;
}
.full {
  height: 100%;
  width: 100%;
}

/* 悬浮网格时才显示滚动条（纯 CSS 实现） */
/* 覆盖所有滚动视口：中心列、左右冻结列、横向滚动、垂直滚动 */
.ag-theme-quartz .ag-center-cols-viewport,
.ag-theme-quartz .ag-left-cols-viewport,
.ag-theme-quartz .ag-right-cols-viewport,
.ag-theme-quartz .ag-body-horizontal-scroll-viewport,
.ag-theme-quartz .ag-body-vertical-scroll-viewport,
.ag-theme-quartz .ag-body-viewport {
  /* Firefox 默认隐藏 */
  scrollbar-width: none;
}
.ag-theme-quartz:hover .ag-center-cols-viewport,
.ag-theme-quartz:hover .ag-left-cols-viewport,
.ag-theme-quartz:hover .ag-right-cols-viewport,
.ag-theme-quartz:hover .ag-body-horizontal-scroll-viewport,
.ag-theme-quartz:hover .ag-body-vertical-scroll-viewport,
.ag-theme-quartz:hover .ag-body-viewport {
  scrollbar-width: thin; /* Firefox 悬浮时显示细滚动条 */
}

.ag-theme-quartz .ag-center-cols-viewport::-webkit-scrollbar,
.ag-theme-quartz .ag-left-cols-viewport::-webkit-scrollbar,
.ag-theme-quartz .ag-right-cols-viewport::-webkit-scrollbar,
.ag-theme-quartz .ag-body-horizontal-scroll-viewport::-webkit-scrollbar,
.ag-theme-quartz .ag-body-vertical-scroll-viewport::-webkit-scrollbar,
.ag-theme-quartz .ag-body-viewport::-webkit-scrollbar {
  width: 0; /* WebKit 默认隐藏 */
  height: 0;
}
.ag-theme-quartz:hover .ag-center-cols-viewport::-webkit-scrollbar,
.ag-theme-quartz:hover .ag-left-cols-viewport::-webkit-scrollbar,
.ag-theme-quartz:hover .ag-right-cols-viewport::-webkit-scrollbar,
.ag-theme-quartz:hover .ag-body-horizontal-scroll-viewport::-webkit-scrollbar,
.ag-theme-quartz:hover .ag-body-vertical-scroll-viewport::-webkit-scrollbar,
.ag-theme-quartz:hover .ag-body-viewport::-webkit-scrollbar {
  width: 8px; /* WebKit 悬浮时显示垂直滚动条 */
  height: 8px; /* WebKit 悬浮时显示水平滚动条 */
}
.ag-theme-quartz .ag-center-cols-viewport::-webkit-scrollbar-thumb,
.ag-theme-quartz .ag-left-cols-viewport::-webkit-scrollbar-thumb,
.ag-theme-quartz .ag-right-cols-viewport::-webkit-scrollbar-thumb,
.ag-theme-quartz .ag-body-horizontal-scroll-viewport::-webkit-scrollbar-thumb,
.ag-theme-quartz .ag-body-vertical-scroll-viewport::-webkit-scrollbar-thumb,
.ag-theme-quartz .ag-body-viewport::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.35);
  border-radius: 4px;
}
.ag-theme-quartz .ag-center-cols-viewport::-webkit-scrollbar-track,
.ag-theme-quartz .ag-left-cols-viewport::-webkit-scrollbar-track,
.ag-theme-quartz .ag-right-cols-viewport::-webkit-scrollbar-track,
.ag-theme-quartz .ag-body-horizontal-scroll-viewport::-webkit-scrollbar-track,
.ag-theme-quartz .ag-body-vertical-scroll-viewport::-webkit-scrollbar-track,
.ag-theme-quartz .ag-body-viewport::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
