<script setup lang="ts">
import type { ICellRendererParams } from 'ag-grid-community'

interface Props {
  params: ICellRendererParams
}

const props = defineProps<Props>()

// 解构出常用的参数
const {
  data, // 当前行数据
  colDef, // 列定义
  node, // 行节点
} = props.params

const editRow = () => {
  console.log('编辑行数据:', {
    rowData: data,
    rowIndex: node?.rowIndex,
    column: colDef?.field,
    node,
  })
  // 这里可以调用编辑逻辑
}

const deleteRow = () => {
  console.log('删除行数据:', {
    rowData: data,
    rowIndex: node?.rowIndex,
    column: colDef?.field,
    node,
  })
  // 这里可以调用删除逻辑
}
</script>
<template lang="pug">
.full.center.gap-gap
  Button.px-paddings.py-2.btn-edit(@click='editRow') 编辑
  Button.px-paddings.py-2.btn-delete(@click='deleteRow', severity='danger') 删除
</template>
