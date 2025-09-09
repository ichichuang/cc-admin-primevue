<script setup lang="tsx">
import type { GridTableConfig } from '@/components/modules/grid-table/utils/types'
import { computed, ref } from 'vue'
import ActionButtons from './components/ActionButtons.vue'

// 使用新的配置方式
const gridConfig = computed(
  (): GridTableConfig => ({
    columns: [
      {
        field: 'id',
        headerName: 'ID',
        type: 'number',
        width: 80,
        pinned: 'left',
        textAlign: 'center',
        style: {
          fontWeight: 'bold',
          color: '#666',
        },
      },
      {
        field: 'name',
        headerName: '姓名',
        type: 'text',
        width: 120,
        sortable: true,
        filter: 'agTextColumnFilter', // 使用正确的属性名
        style: {
          textAlign: 'left',
          fontWeight: 'bold',
        },
      },
      {
        field: 'age',
        headerName: '年龄',
        type: 'number',
        width: 80,
        sortable: true,
        filter: 'agNumberColumnFilter', // 使用正确的属性名
        textAlign: 'center',
      },
      {
        field: 'email',
        headerName: '邮箱',
        type: 'text',
        width: 200,
        filter: 'agTextColumnFilter', // 使用正确的属性名
        style: {
          textAlign: 'left',
          color: '#007bff',
        },
      },
      {
        field: 'department',
        headerName: '部门',
        type: 'select',
        width: 120,
        filter: 'agTextColumnFilter', // 使用正确的属性名
        textAlign: 'center',
      },
      {
        field: 'position',
        headerName: '职位',
        type: 'text',
        width: 120,
        filter: 'agTextColumnFilter', // 使用正确的属性名
      },
      {
        field: 'salary',
        headerName: '薪资',
        type: 'number',
        width: 100,
        sortable: true,
        textAlign: 'right',
        valueFormatter: (params: any) => `¥${params.value?.toLocaleString() || 0}`,
        style: {
          fontWeight: 'bold',
          color: '#28a745',
        },
      },
      {
        field: 'status',
        headerName: '状态',
        type: 'select',
        width: 100,
        filter: 'agTextColumnFilter', // 使用正确的属性名
        textAlign: 'center',
        cellRenderer: (params: any) => {
          const statusMap: Record<string, { text: string; class: string }> = {
            在职: { text: '在职', class: 'status-active' },
            离职: { text: '离职', class: 'status-inactive' },
            试用期: { text: '试用期', class: 'status-trial' },
          }
          const status = statusMap[params.value] || { text: params.value, class: '' }
          return `<span class="status-badge ${status.class}">${status.text}</span>`
        },
      },
      {
        field: 'joinDate',
        headerName: '入职日期',
        type: 'date',
        minWidth: 120,
        sortable: true,
        filter: 'agDateColumnFilter', // 使用正确的属性名
        textAlign: 'center',
        valueFormatter: (params: any) => {
          if (!params.value) {
            return ''
          }
          return new Date(params.value).toLocaleDateString('zh-CN')
        },
      },
      {
        field: 'actions',
        headerName: '操作',
        type: 'actions',
        width: 120,
        pinned: 'right',
        resizable: false,
        sortable: false,
        filter: false as any, // 使用正确的属性名
        cellRenderer: 'actionButtons',
        style: {
          textAlign: 'center',
        },
      },
    ],
    data: rowData.value,
    layout: {
      height: '500px',
      bordered: true,
      striped: true,
      hoverable: true,
      rowHeight: 40,
      headerHeight: 45,
    },
    pagination: {
      enabled: true,
      pageSize: 10,
      pageSizeOptions: [5, 10, 20, 50],
      showPageSizeSelector: true,
      showPageInfo: true,
    },
    selection: {
      mode: 'multiRow', // 修复：使用正确的模式名称
      checkboxes: true,
      clickToSelect: false,
      keyboardToSelect: true,
    },
    export: {
      csv: true,
      excel: false,
      fileName: '员工数据',
      params: {
        columnSeparator: ',',
        fileName: '员工数据.csv',
      },
    },
    components: {
      actionButtons: ActionButtons,
    },
    gridOptions: {
      animateRows: true,
      enableCellTextSelection: true,
      // 移除 cellSelection，因为需要企业版模块
    },
  })
)

// 模拟数据
const rowData = ref([
  {
    id: 1,
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
    department: '技术部',
    position: '前端工程师',
    salary: 15000,
    status: '在职',
    joinDate: '2022-01-15',
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    email: 'lisi@example.com',
    department: '产品部',
    position: '产品经理',
    salary: 18000,
    status: '在职',
    joinDate: '2021-06-20',
  },
  {
    id: 3,
    name: '王五',
    age: 25,
    email: 'wangwu@example.com',
    department: '设计部',
    position: 'UI设计师',
    salary: 12000,
    status: '试用期',
    joinDate: '2023-03-10',
  },
  {
    id: 4,
    name: '赵六',
    age: 35,
    email: 'zhaoliu@example.com',
    department: '技术部',
    position: '后端工程师',
    salary: 20000,
    status: '在职',
    joinDate: '2020-09-05',
  },
  {
    id: 5,
    name: '钱七',
    age: 29,
    email: 'qianqi@example.com',
    department: '运营部',
    position: '运营专员',
    salary: 13000,
    status: '在职',
    joinDate: '2022-08-12',
  },
  {
    id: 6,
    name: '孙八',
    age: 27,
    email: 'sunba@example.com',
    department: '市场部',
    position: '市场专员',
    salary: 11000,
    status: '离职',
    joinDate: '2021-12-01',
  },
  {
    id: 7,
    name: '周九',
    age: 31,
    email: 'zhoujiu@example.com',
    department: '技术部',
    position: '架构师',
    salary: 25000,
    status: '在职',
    joinDate: '2019-04-18',
  },
  {
    id: 8,
    name: '吴十',
    age: 26,
    email: 'wushi@example.com',
    department: '产品部',
    position: '产品助理',
    salary: 10000,
    status: '试用期',
    joinDate: '2023-05-22',
  },
  {
    id: 9,
    name: '郑十一',
    age: 33,
    email: 'zhengshiyi@example.com',
    department: '设计部',
    position: '视觉设计师',
    salary: 16000,
    status: '在职',
    joinDate: '2021-02-14',
  },
  {
    id: 10,
    name: '王十二',
    age: 24,
    email: 'wangshier@example.com',
    department: '技术部',
    position: '测试工程师',
    salary: 9000,
    status: '试用期',
    joinDate: '2023-07-08',
  },
  {
    id: 11,
    name: '李十三',
    age: 30,
    email: 'lishisan@example.com',
    department: '运营部',
    position: '运营经理',
    salary: 17000,
    status: '在职',
    joinDate: '2020-11-30',
  },
  {
    id: 12,
    name: '张十四',
    age: 28,
    email: 'zhangshisi@example.com',
    department: '市场部',
    position: '市场经理',
    salary: 19000,
    status: '在职',
    joinDate: '2021-08-25',
  },
  {
    id: 13,
    name: '刘十五',
    age: 35,
    email: 'liushiwu@example.com',
    department: '技术部',
    position: '技术总监',
    salary: 30000,
    status: '在职',
    joinDate: '2018-03-12',
  },
  {
    id: 14,
    name: '陈十六',
    age: 27,
    email: 'chenshiliu@example.com',
    department: '产品部',
    position: '产品总监',
    salary: 28000,
    status: '在职',
    joinDate: '2019-10-15',
  },
  {
    id: 15,
    name: '杨十七',
    age: 29,
    email: 'yangshiqi@example.com',
    department: '设计部',
    position: '设计总监',
    salary: 22000,
    status: '在职',
    joinDate: '2020-05-20',
  },
])

const gridTableRef = ref()

// 工具栏处理函数
const handleRefresh = () => {
  console.log('刷新数据')
  // 这里可以调用 API 刷新数据
}

const handleExport = () => {
  console.log('导出数据')
  // 这里可以调用导出功能
}

const handleAdd = () => {
  console.log('新增数据')
  // 这里可以打开新增对话框
}

const handleDelete = () => {
  console.log('删除数据')
  // 这里可以删除选中的数据
}
</script>
<template lang="pug">
.full.between-col.gap-gap
  .h-100.c-card.between-col.center-start
    .color-accent100.font-bold GridTable 基础示例（新配置方式）
    .flex.gap-gap
      Button(
        label='刷新数据',
        icon='pi pi-refresh',
        severity='secondary',
        size='small',
        @click='handleRefresh'
      )
      Button(
        label='导出CSV',
        icon='pi pi-download',
        severity='secondary',
        size='small',
        @click='handleExport'
      )
      Button(
        label='新增数据',
        icon='pi pi-plus',
        severity='secondary',
        size='small',
        @click='handleAdd'
      )
      Button(
        label='删除数据',
        icon='pi pi-trash',
        severity='danger',
        size='small',
        @click='handleDelete'
      )

  div(class='h-[calc(100%-200px)]')
    GridTable(ref='gridTableRef', :config='gridConfig', v-model='rowData')

  .h-100.c-card.between-col.center-start
    div
      span 总数据量:
      span.color-accent100 {{ rowData.length }} 条
    div
      span 功能特性:
      span.color-accent100 分页、排序、过滤、选择、导出
</template>
