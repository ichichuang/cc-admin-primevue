<script setup lang="tsx">
import type { GridTableConfig } from '@/components/modules/grid-table/utils/types'
import { useGridTableController } from '@/hooks'
import { computed, nextTick, reactive, ref } from 'vue'

// 交互式控制状态
const controlState = reactive({
  // 布局控制
  zebra: 'none' as 'none' | 'odd' | 'even',
  zebraColor: '',

  // 功能控制
  filtering: false,
  sorting: false,
  resizing: false,
  columnMoving: false,
  allowPinnedColumnMoving: false,
  clipboard: false,
  export: false,
  pagination: true, // 分页
  hoverRowHighlight: true, // 悬停行高亮
  hoverColumnHighlight: true, // 悬停列高亮
  selectedCellBorderHighlight: false, // 选中单元格边框高亮
  selectedCellBackgroundHighlight: false, // 选中单元格背景高亮

  // 分页控制
  pageSize: 10,
  showPageSizeSelector: true,

  // 选择控制
  selectionMode: 'multiple' as 'single' | 'multiple',
  checkboxes: true,
  clickToSelect: false,
  keyboardToSelect: false,
  pinned: 'left',

  // 列控制
  nameColumnFilterable: false,
  ageColumnSortable: false,
  sexColumnFilterable: false,
  emailColumnResizable: false,

  // 预设筛选条件
  presetFilterEnabled: false,
  // 预设年龄排序
  presetAgeSortEnabled: false,

  // 分割线控制
  horizontalLines: true, // 横向分割线（行线）
  verticalLines: true, // 纵向分割线（列线）
})
// 斑马纹颜色演示已移除，使用主题默认色

// 使用新的配置方式
const gridConfig = computed(
  (): GridTableConfig => ({
    columns: [
      {
        field: 'id',
        headerName: 'ID',
        layout: {
          filtering: false,
          minWidth: 60,
          headerClass: 'bg-primary100 color-primary400',
          cellClass: 'font-bold bg-primary100 color-primary400',
        },
        type: 'number',
        pinned: 'left',
      },
      {
        field: 'name',
        headerName: '姓名',
        layout: {
          filtering: controlState.nameColumnFilterable,
          textAlign: 'left',
          headerTextAlign: 'left',
          minWidth: 100,
        },
        pinned: 'left',
      },
      {
        field: 'age',
        headerName: '年龄',
        type: 'number',
        layout: {
          sorting: controlState.ageColumnSortable,
        },
      },
      {
        field: 'sex',
        headerName: '性别',
        layout: {
          filtering: controlState.sexColumnFilterable,
        },
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
        layout: {
          minWidth: 220,
          resizing: controlState.emailColumnResizable,
          textAlign: 'left',
          headerTextAlign: 'left',
          cellClass: 'color-primary100 italic',
        },
      },
      {
        field: 'department',
        headerName: '部门',
        layout: {},
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
        layout: {
          minWidth: 120,
          textAlign: 'right',
          headerTextAlign: 'right',
        },
      },
      {
        field: 'salary',
        headerName: '薪资',
        type: 'number',
        layout: {
          minWidth: 120,
          textAlign: 'right',
          headerTextAlign: 'right',
          cellClass: 'font-bold text-green-600',
        },
        valueFormatter: (params: any) => `¥${params.value?.toLocaleString() || 0}`,
        filterParams: {
          filterOptions: ['equals', 'greaterThan', 'lessThan'],
        },
      },
      {
        field: 'isActive',
        headerName: '是否在职',
        type: 'boolean',
        pinned: 'right',
        layout: {
          minWidth: 120,
        },
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
        layout: {
          minWidth: 180,
        },
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
        layout: {
          minWidth: 180,
          textAlign: 'left',
          headerTextAlign: 'left',
        },
      },
    ],
    data: rowData.value,
    layout: {
      // 使用 '100%' 让表格占满父容器高度
      // 也可以使用 'auto' 让表格自动撑开高度，或使用固定值如 '500px'
      height: '100%',
      width: '100%',
      zebra: controlState.zebra,
      zebraColor: controlState.zebraColor || undefined,
      horizontalLines: controlState.horizontalLines,
      verticalLines: controlState.verticalLines,
      headerHeight: 40,
      hoverRowHighlight: controlState.hoverRowHighlight,
      hoverColumnHighlight: controlState.hoverColumnHighlight,
      selectedCellBorderHighlight: controlState.selectedCellBorderHighlight,
      selectedCellBackgroundHighlight: controlState.selectedCellBackgroundHighlight,
      layout: {
        minWidth: 90,
        filtering: controlState.filtering,
        sorting: controlState.sorting,
        resizing: controlState.resizing,
        columnMoving: controlState.columnMoving,
      },
    },
    features: {
      allowPinnedColumnMoving: controlState.allowPinnedColumnMoving,
      clipboard: controlState.clipboard,
      export: controlState.export,
      pagination: controlState.pagination,
    },
    pagination: {
      enabled: controlState.pagination,
      pageSize: controlState.pageSize,
      pageSizeOptions: [5, 10, 20, 50, 100],
      showPageSizeSelector: controlState.showPageSizeSelector,
    },
    selection: {
      mode: controlState.selectionMode === 'multiple' ? 'multiRow' : 'singleRow',
      checkboxes: controlState.checkboxes,
      clickToSelect: controlState.clickToSelect,
      keyboardToSelect: controlState.keyboardToSelect,
      pinned: controlState.pinned as 'left' | 'right',
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
    gridOptions: {
      animateRows: true,
      enableCellTextSelection: true,
      suppressRowHoverHighlight: !controlState.hoverRowHighlight,
      // 确保不抑制行点击选择
      suppressRowClickSelection: false,
      // 选择功能由 transformer.ts 中的 selection 配置统一处理
      // 包括复选框显示、多选模式、点击选择等所有选择相关功能
      onRowClicked: (event: any) => {
        console.log('行点击事件:', event.data)
      },
      onCellClicked: (event: any) => {
        console.log('单元格点击事件:', event.value, event.colDef.field)
      },
      onSelectionChanged: (event: any) => {
        console.log('选择变化事件:', event.api.getSelectedRows())
      },
      // Cmd/Ctrl + C 复制当前单元格内容
      onCellKeyDown: (e: any) => {
        if (!controlState.clipboard) {
          return
        }
        const kev = e.event as KeyboardEvent
        const isCopy = (kev.metaKey || kev.ctrlKey) && (kev.key === 'c' || kev.key === 'C')
        if (!isCopy) {
          return
        }
        copyToClipboard(e.value)
      },
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
  {
    id: 16,
    name: '黄十八',
    age: 26,
    sex: 1,
    email: 'huangshiba@example.com',
    department: '技术部',
    position: 'DevOps工程师',
    salary: 14000,
    status: '在职',
    isActive: true,
    isEnabled: false,
    joinDate: '2022-03-15',
    lastLogin: '2024-01-01',
  },
  {
    id: 17,
    name: '林十九',
    age: 31,
    sex: 1,
    email: 'linshijiu@example.com',
    department: '产品部',
    position: '产品运营',
    salary: 15000,
    status: '在职',
    isActive: true,
    joinDate: '2021-07-10',
    lastLogin: '2023-12-31',
  },
  {
    id: 18,
    name: '何二十',
    age: 28,
    sex: 2,
    email: 'heshi@example.com',
    department: '设计部',
    position: '交互设计师',
    salary: 13000,
    status: '离职',
    isActive: false,
    isEnabled: false,
    joinDate: '2022-01-20',
    lastLogin: '2023-11-15',
  },
  {
    id: 19,
    name: '罗二一',
    age: 33,
    sex: 1,
    email: 'luoeryi@example.com',
    department: '运营部',
    position: '数据分析师',
    salary: 16000,
    status: '在职',
    isActive: true,
    joinDate: '2020-08-30',
    lastLogin: '2023-12-30',
  },
  {
    id: 20,
    name: '高二二',
    age: 25,
    sex: 2,
    email: 'gaoershi@example.com',
    department: '市场部',
    position: '市场推广',
    salary: 12000,
    status: '试用期',
    isActive: true,
    joinDate: '2023-09-01',
    lastLogin: '2023-12-29',
  },
])

const gridTableRef = ref()
const table = useGridTableController(gridTableRef)

// 复制到剪贴板（兼容写法）
const copyToClipboard = async (text: unknown) => {
  const str = text === null || text === undefined ? '' : String(text)
  try {
    await navigator.clipboard.writeText(str)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = str
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
    } finally {
      document.body.removeChild(textarea)
    }
  }
}

const handleExport = () => {
  console.log('导出数据')
  table.exportCsv()
}

const handleClearSelection = () => {
  table.clearSelection()
}

// 控制函数
const toggleFiltering = () => {
  controlState.filtering = !controlState.filtering
}

const toggleSorting = () => {
  controlState.sorting = !controlState.sorting
}

const toggleResizing = () => {
  controlState.resizing = !controlState.resizing
}

const toggleColumnMoving = () => {
  controlState.columnMoving = !controlState.columnMoving
}

const togglePinnedColumnMoving = () => {
  controlState.allowPinnedColumnMoving = !controlState.allowPinnedColumnMoving
}

const togglePagination = () => {
  controlState.pagination = !controlState.pagination
}

const toggleHoverRowHighlight = () => {
  controlState.hoverRowHighlight = !controlState.hoverRowHighlight
}

const toggleHoverColumnHighlight = () => {
  controlState.hoverColumnHighlight = !controlState.hoverColumnHighlight
}

const toggleSelectedCellBorderHighlight = () => {
  controlState.selectedCellBorderHighlight = !controlState.selectedCellBorderHighlight
}

const toggleSelectedCellBackgroundHighlight = () => {
  controlState.selectedCellBackgroundHighlight = !controlState.selectedCellBackgroundHighlight
}

const changeSelectionMode = (mode: 'single' | 'multiple') => {
  controlState.selectionMode = mode
}

const toggleCheckboxes = () => {
  controlState.checkboxes = !controlState.checkboxes
}

const toggleClickToSelect = () => {
  controlState.clickToSelect = !controlState.clickToSelect
}

const changePinned = (pinned: 'left' | 'right') => {
  controlState.pinned = pinned
}

// 列控制函数
const toggleIdColumnFilter = () => {
  controlState.nameColumnFilterable = !controlState.nameColumnFilterable
}

const togglePresetFilter = async () => {
  controlState.presetFilterEnabled = !controlState.presetFilterEnabled

  // 获取 AG Grid API 实例
  const gridApi = table.gridApi
  if (!gridApi) {
    return
  }

  if (controlState.presetFilterEnabled) {
    // 确保姓名列的筛选功能是启用的
    controlState.nameColumnFilterable = true
    // 启用预设筛选条件：姓名包含"王"或"李"
    const filterModel = {
      name: {
        filterType: 'text',
        conditions: [
          {
            filterType: 'text',
            type: 'contains',
            filter: '王',
          },
          {
            filterType: 'text',
            type: 'contains',
            filter: '李',
          },
        ],
        operator: 'OR',
      },
    }
    await nextTick()
    setTimeout(() => {
      gridApi.setFilterModel(filterModel)
    }, 100)
  } else {
    // 清除筛选条件
    gridApi.setFilterModel(null)
  }
}

// 预设年龄排序：切换为升序/清除
const togglePresetAgeSort = () => {
  controlState.presetAgeSortEnabled = !controlState.presetAgeSortEnabled
  const gridApi = table.gridApi
  // 先启用年龄列排序功能
  controlState.ageColumnSortable = true

  if (controlState.presetAgeSortEnabled) {
    nextTick(() => {
      gridApi.applyColumnState({
        defaultState: { sort: null },
        state: [{ colId: 'age', sort: 'asc' }],
      })
    })
  } else {
    gridApi.applyColumnState({ defaultState: { sort: null }, state: [] })
  }
}

const toggleNameColumnSort = () => {
  controlState.ageColumnSortable = !controlState.ageColumnSortable
}

const toggleSexColumnFilter = () => {
  controlState.sexColumnFilterable = !controlState.sexColumnFilterable
}

const toggleAgeColumnResize = () => {
  controlState.emailColumnResizable = !controlState.emailColumnResizable
}

// 分割线控制函数
const toggleHorizontalLines = () => {
  controlState.horizontalLines = !controlState.horizontalLines
}

const toggleVerticalLines = () => {
  controlState.verticalLines = !controlState.verticalLines
}

// 新增功能控制函数
const toggleClipboard = () => {
  controlState.clipboard = !controlState.clipboard
}
</script>
<template lang="pug">
.full.between-col.gap-gap
  //- 顶部工具栏
  .c-card.h-100
    ScrollbarWrapper.full(:size='1', direction='horizontal', wrapper-class='between-start')
      .flex.gap-gap
        div
          Button.text-nowrap(@click='handleExport') 导出CSV
        div
          Button.text-nowrap(@click='handleClearSelection') 清除选择

  //- 表格容器
  GridTable(ref='gridTableRef', :config='gridConfig', v-model='rowData')

  //- 控制面板
  .h-400.rounded-0.c-border-accent
    ScrollbarWrapper.full(:size='0')
      .between-col.items-start.gap-gapl.p-padding
        //- 布局控制
        .full.c-card.p-padding.between-col
          .fs-appFontSizes.color-accent100.mb-gaps 布局控制
          .full.between-col.gap-gaps
            .between.gap-gap
              .flex-1.between.gap-gap
                p 斑马纹:
                Select.flex-1(
                  :model-value='controlState.zebra',
                  @update:model-value='v => (controlState.zebra = v)',
                  option-label='label',
                  option-value='value',
                  :options='[ { label: "无", value: "none" }, { label: "奇数行", value: "odd" }, { label: "偶数行", value: "even" }, ]'
                )
              .flex-1.between.gap-gap
                p 斑马纹颜色:
                ColorPicker.flex-1(
                  :model-value='controlState.zebraColor || null',
                  @update:model-value='v => (controlState.zebraColor = v || "")',
                  format='hex'
                )
                Button(severity='secondary', @click='controlState.zebraColor = ""') 清除
            .full.grid.grid-cols-1.gap-gap(class='sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6')
              Button(
                :label='`悬停行高亮: ${controlState.hoverRowHighlight ? "启用" : "禁用"}`',
                :severity='controlState.hoverRowHighlight ? "success" : "secondary"',
                @click='toggleHoverRowHighlight'
              )
              Button(
                :label='`悬停列高亮: ${controlState.hoverColumnHighlight ? "启用" : "禁用"}`',
                :severity='controlState.hoverColumnHighlight ? "success" : "secondary"',
                @click='toggleHoverColumnHighlight'
              )
              Button(
                :label='`选中单元格边框高亮: ${controlState.selectedCellBorderHighlight ? "启用" : "禁用"}`',
                :severity='controlState.selectedCellBorderHighlight ? "success" : "secondary"',
                @click='toggleSelectedCellBorderHighlight'
              )
              Button(
                :label='`选中单元格背景高亮: ${controlState.selectedCellBackgroundHighlight ? "启用" : "禁用"}`',
                :severity='controlState.selectedCellBackgroundHighlight ? "success" : "secondary"',
                @click='toggleSelectedCellBackgroundHighlight'
              )
              Button(
                :label='`横向分割线: ${controlState.horizontalLines ? "启用" : "禁用"}`',
                :severity='controlState.horizontalLines ? "success" : "secondary"',
                @click='toggleHorizontalLines'
              )
              Button(
                :label='`纵向分割线: ${controlState.verticalLines ? "启用" : "禁用"}`',
                :severity='controlState.verticalLines ? "success" : "secondary"',
                @click='toggleVerticalLines'
              )
        //- 功能控制
        .full.c-card.p-padding.between-col
          .fs-appFontSizes.color-accent100.mb-gaps 功能控制
          .full.grid.grid-cols-2.gap-gap(class='sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8')
            Button(
              :label='`筛选: ${controlState.filtering ? "启用" : "禁用"}`',
              :severity='controlState.filtering ? "success" : "secondary"',
              @click='toggleFiltering'
            )
            Button(
              :label='`排序: ${controlState.sorting ? "启用" : "禁用"}`',
              :severity='controlState.sorting ? "success" : "secondary"',
              @click='toggleSorting'
            )
            Button(
              :label='`调整大小: ${controlState.resizing ? "启用" : "禁用"}`',
              :severity='controlState.resizing ? "success" : "secondary"',
              @click='toggleResizing'
            )
            Button(
              :label='`列移动: ${controlState.columnMoving ? "启用" : "禁用"}`',
              :severity='controlState.columnMoving ? "success" : "secondary"',
              @click='toggleColumnMoving'
            )
            Button(
              :label='`固定列移动: ${controlState.allowPinnedColumnMoving ? "启用" : "禁用"}`',
              :severity='controlState.allowPinnedColumnMoving ? "success" : "secondary"',
              @click='togglePinnedColumnMoving'
            )
            Button(
              :label='`分页: ${controlState.pagination ? "启用" : "禁用"}`',
              :severity='controlState.pagination ? "success" : "secondary"',
              @click='togglePagination'
            )

            Button(
              :label='`复制粘贴: ${controlState.clipboard ? "启用" : "禁用"}`',
              :severity='controlState.clipboard ? "success" : "secondary"',
              @click='toggleClipboard'
            )

        //- 选择控制
        .full.c-card.p-padding.between-col
          .fs-appFontSizes.color-accent100.mb-gaps 选择控制
          .full.grid.grid-cols-2.gap-gap(class='sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8')
            .flex.gap-1.items-center
              label 选择模式:
              Select(
                :model-value='controlState.selectionMode',
                @update:model-value='changeSelectionMode',
                option-label='label',
                option-value='value',
                :options='[ { label: "单选", value: "single" }, { label: "多选", value: "multiple" }, ]',
                size='small'
              )
            .flex.gap-1.items-center
              label 固定位置:
              Select(
                :model-value='controlState.pinned',
                @update:model-value='changePinned',
                option-label='label',
                option-value='value',
                :options='[ { label: "左侧", value: "left" }, { label: "右侧", value: "right" }, ]',
                size='small'
              )
            Button(
              :label='`复选框: ${controlState.checkboxes ? "显示" : "隐藏"}`',
              :severity='controlState.checkboxes ? "success" : "secondary"',
              @click='toggleCheckboxes'
            )
            Button(
              :label='`点击选择: ${controlState.clickToSelect ? "启用" : "禁用"}`',
              :severity='controlState.clickToSelect ? "success" : "secondary"',
              @click='toggleClickToSelect'
            )

        //- 列控制
        .full.c-card.p-padding.between-col
          .fs-appFontSizes.color-accent100.mb-gaps 列控制
          .full.grid.grid-cols-2.gap-gap(class='sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5')
            Button(
              :label='`姓名列筛选: ${controlState.nameColumnFilterable ? "启用" : "禁用"}`',
              :severity='controlState.nameColumnFilterable ? "success" : "secondary"',
              @click='toggleIdColumnFilter'
            )
            Button(
              :label='`预设筛选条件: ${controlState.presetFilterEnabled ? "启用" : "禁用"}`',
              :severity='controlState.presetFilterEnabled ? "success" : "secondary"',
              @click='togglePresetFilter'
            )
            Button(
              :label='`年龄列排序: ${controlState.ageColumnSortable ? "启用" : "禁用"}`',
              :severity='controlState.ageColumnSortable ? "success" : "secondary"',
              @click='toggleNameColumnSort'
            )
            Button(
              :label='`预设年龄排序: ${controlState.presetAgeSortEnabled ? "启用" : "禁用"}`',
              :severity='controlState.presetAgeSortEnabled ? "success" : "secondary"',
              @click='togglePresetAgeSort'
            )
            Button(
              :label='`性别列筛选: ${controlState.sexColumnFilterable ? "启用" : "禁用"}`',
              :severity='controlState.sexColumnFilterable ? "success" : "secondary"',
              @click='toggleSexColumnFilter'
            )
            Button(
              :label='`邮箱列调整: ${controlState.emailColumnResizable ? "启用" : "禁用"}`',
              :severity='controlState.emailColumnResizable ? "success" : "secondary"',
              @click='toggleAgeColumnResize'
            )

        //- 功能说明
        .full.c-card.p-padding.between-col
          .fs-appFontSizes.color-accent100.mb-gaps 功能说明
          .text-sm.color-text200.space-y-1
            div • 点击表格行可以查看控制台输出的行点击事件
            div • 点击单元格可以查看控制台输出的单元格点击事件
            div • 选择行时可以查看控制台输出的选择变化事件
            div • 所有列类型都有对应的默认配置和渲染方式
            div • 支持自定义渲染器、格式化器、过滤器等
            div • 列配置优先级：列配置 > 全局配置 > 默认配置
            div • 键盘导航：支持方向键、Tab键等键盘操作
            div • 复制粘贴：支持 Ctrl+C 复制选中单元格内容
            div • 这是一个基础展示示例，不包含数据编辑功能
</template>
