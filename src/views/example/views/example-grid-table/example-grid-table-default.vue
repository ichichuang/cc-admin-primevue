<script setup lang="tsx">
import type { GridTableConfig } from '@/components/modules/grid-table/utils/types'
import { computed, ref } from 'vue'

const gridConfig = computed(
  (): GridTableConfig => ({
    columns: [
      {
        field: 'id',
        headerName: 'ID',
        type: 'number',
        pinned: 'left',
      },
      {
        field: 'name',
        headerName: '姓名',
      },
      {
        field: 'age',
        headerName: '年龄',
        type: 'number',
      },
      {
        field: 'sex',
        headerName: '性别',
        cellRenderer: (params: any) => {
          const sexMap: Record<number, { text: string; color: string }> = {
            1: { text: '男', color: '#007bff' },
            2: { text: '女', color: '#e83e8c' },
          }
          const sex = sexMap[params.value] || { text: '未知', color: '#6c757d' }
          return `<span style="color: ${sex.color}; font-weight: bold;">${sex.text}</span>`
        },
        filter: 'agTextColumnFilter',
        filterParams: {
          filterOptions: ['equals'],
          suppressAndOrCondition: true,
          maxNumConditions: 1,
          textFormatter: (input: any) => {
            if (typeof input !== 'string') {
              return input
            }

            const trimmedInput = input.trim()

            if (trimmedInput === '男') {
              return 1
            }
            if (trimmedInput === '女') {
              return 2
            }

            return trimmedInput
          },
        },
        valueFormatter: (params: any) => {
          const value = params.value
          if (value === 1) {
            return '男'
          }
          if (value === 2) {
            return '女'
          }
          return value
        },
      },
      {
        field: 'email',
        headerName: '邮箱',
      },
      {
        field: 'department',
        headerName: '部门',
        cellRenderer: (params: any) => {
          const deptColors: Record<string, string> = {
            技术部: '#007bff',
            产品部: '#28a745',
            设计部: '#ffc107',
            运营部: '#17a2b8',
            市场部: '#dc3545',
          }
          const color = deptColors[params.value] || '#6c757d'
          return `<span style="color: ${color}; font-weight: bold;">${params.value}</span>`
        },
      },
      {
        field: 'position',
        headerName: '职位',
      },
      {
        field: 'salary',
        headerName: '薪资',
        type: 'number',
        valueFormatter: (params: any) => `¥${params.value?.toLocaleString() || 0}`,
        filterParams: {
          filterOptions: ['equals', 'greaterThan', 'lessThan'],
        },
      },
      {
        field: 'isActive',
        headerName: '是否在职',
        type: 'boolean',
      },
      {
        field: 'status',
        headerName: '状态',
        pinned: 'right',
        cellRenderer: (params: any) => {
          const statusMap: Record<string, { text: string; class: string; color: string }> = {
            在职: { text: '在职', class: 'status-active', color: '#28a745' },
            离职: { text: '离职', class: 'status-inactive', color: '#dc3545' },
            试用期: { text: '试用期', class: 'status-trial', color: '#ffc107' },
          }
          const status = statusMap[params.value] || {
            text: params.value,
            class: '',
            color: '#6c757d',
          }
          return `<span class="status-badge ${status.class}" style="color: ${status.color}; font-weight: bold;">${status.text}</span>`
        },
      },
      {
        field: 'joinDate',
        headerName: '入职日期',
        type: 'date',
        valueFormatter: (params: any) => {
          if (!params.value) {
            return ''
          }
          return new Date(params.value).toLocaleDateString('zh-CN')
        },
      },
      {
        field: 'lastLogin',
        headerName: '最后登录',
        type: 'date',
        valueFormatter: (params: any) => {
          if (!params.value) {
            return '从未登录'
          }
          const date = new Date(params.value)
          const now = new Date()
          const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

          if (diffDays === 0) {
            return '今天'
          }
          if (diffDays === 1) {
            return '昨天'
          }
          if (diffDays < 7) {
            return `${diffDays}天前`
          }
          return date.toLocaleDateString('zh-CN')
        },
      },
    ],
    data: rowData.value,
    layout: {
      // 使用 'auto' 让表格自动撑开高度，适应内容
      height: 'auto',
      horizontalLines: true,
      verticalLines: true,
    },
  })
)

// 模拟数据
const rowData = ref([
  {
    id: 1,
    name: '张三',
    age: 28,
    sex: 1,
    email: 'zhangsan@example.com',
    department: '技术部',
    position: '前端工程师',
    salary: 15000,
    status: '在职',
    isActive: true,
    joinDate: '2022-01-15',
    lastLogin: '2024-01-15',
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    sex: 2,
    email: 'lisi@example.com',
    department: '产品部',
    position: '产品经理',
    salary: 18000,
    status: '在职',
    isActive: true,
    joinDate: '2021-06-20',
    lastLogin: '2024-01-14',
  },
  {
    id: 3,
    name: '王五',
    age: 25,
    sex: 1,
    email: 'wangwu@example.com',
    department: '设计部',
    position: 'UI设计师',
    salary: 12000,
    status: '试用期',
    isActive: true,
    isEnabled: false,
    joinDate: '2023-03-10',
    lastLogin: '2024-01-13',
  },
  {
    id: 4,
    name: '赵六',
    age: 35,
    sex: 1,
    email: 'zhaoliu@example.com',
    department: '技术部',
    position: '后端工程师',
    salary: 20000,
    status: '在职',
    isActive: true,
    joinDate: '2020-09-05',
    lastLogin: '2024-01-12',
  },
  {
    id: 5,
    name: '钱七',
    age: 29,
    sex: 2,
    email: 'qianqi@example.com',
    department: '运营部',
    position: '运营专员',
    salary: 13000,
    status: '在职',
    isActive: true,
    joinDate: '2022-08-12',
    lastLogin: '2024-01-11',
  },
  {
    id: 6,
    name: '孙八',
    age: 27,
    sex: 1,
    email: 'sunba@example.com',
    department: '市场部',
    position: '市场专员',
    salary: 11000,
    status: '离职',
    isActive: false,
    isEnabled: false,
    joinDate: '2021-12-01',
    lastLogin: '2023-12-01',
  },
  {
    id: 7,
    name: '周九',
    age: 31,
    sex: 1,
    email: 'zhoujiu@example.com',
    department: '技术部',
    position: '架构师',
    salary: 25000,
    status: '在职',
    isActive: true,
    joinDate: '2019-04-18',
    lastLogin: '2024-01-10',
  },
  {
    id: 8,
    name: '吴十',
    age: 26,
    sex: 2,
    email: 'wushi@example.com',
    department: '产品部',
    position: '产品助理',
    salary: 10000,
    status: '试用期',
    isActive: true,
    isEnabled: false,
    joinDate: '2023-05-22',
    lastLogin: '2024-01-09',
  },
  {
    id: 9,
    name: '郑十一',
    age: 33,
    sex: 2,
    email: 'zhengshiyi@example.com',
    department: '设计部',
    position: '视觉设计师',
    salary: 16000,
    status: '在职',
    isActive: true,
    joinDate: '2021-02-14',
    lastLogin: '2024-01-08',
  },
  {
    id: 10,
    name: '王十二',
    age: 24,
    sex: 1,
    email: 'wangshier@example.com',
    department: '技术部',
    position: '测试工程师',
    salary: 9000,
    status: '试用期',
    isActive: true,
    joinDate: '2023-07-08',
    lastLogin: '2024-01-07',
  },
  {
    id: 11,
    name: '李十三',
    age: 30,
    sex: 1,
    email: 'lishisan@example.com',
    department: '运营部',
    position: '运营经理',
    salary: 17000,
    status: '在职',
    isActive: true,
    joinDate: '2020-11-30',
    lastLogin: '2024-01-06',
  },
  {
    id: 12,
    name: '张十四',
    age: 28,
    sex: 2,
    email: 'zhangshisi@example.com',
    department: '市场部',
    position: '市场经理',
    salary: 19000,
    status: '在职',
    isActive: true,
    joinDate: '2021-08-25',
    lastLogin: '2024-01-05',
  },
  {
    id: 13,
    name: '刘十五',
    age: 35,
    sex: 1,
    email: 'liushiwu@example.com',
    department: '技术部',
    position: '技术总监',
    salary: 30000,
    status: '在职',
    isActive: true,
    joinDate: '2018-03-12',
    lastLogin: '2024-01-04',
  },
  {
    id: 14,
    name: '陈十六',
    age: 27,
    sex: 2,
    email: 'chenshiliu@example.com',
    department: '产品部',
    position: '产品总监',
    salary: 28000,
    status: '在职',
    isActive: true,
    joinDate: '2019-10-15',
    lastLogin: '2024-01-03',
  },
  {
    id: 15,
    name: '杨十七',
    age: 29,
    sex: 2,
    email: 'yangshiqi@example.com',
    department: '设计部',
    position: '设计总监',
    salary: 22000,
    status: '在职',
    isActive: true,
    joinDate: '2020-05-20',
    lastLogin: '2024-01-02',
  },
])
</script>
<template lang="pug">
.full.between-col.gap-gap
  .fs-appFontSizex GridTable 组件默认示例
    .color-text200 展示 GridTable 组件的默认配置
  //- 表格容器
  GridTable(ref='gridTableRef', :config='gridConfig', v-model='rowData')
</template>
