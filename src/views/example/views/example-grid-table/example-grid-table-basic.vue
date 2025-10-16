<script setup lang="tsx">
import type { ExtendedColDef, ExtendedColGroupDef } from '@/components/modules/grid-table'
import {
  GridTable,
  type GridColorConfig,
  type GridSizeConfig,
} from '@/components/modules/grid-table'
import { computed, ref } from 'vue'

// ==================== 表格列配置示例 ====================

// 每列只展示一个独特的配置项示例
const idColumnWidthMode = ref('fixed' as 'auto' | 'fixed') // ID列：列宽模式
const nameColumnSortable = ref(true) // 姓名列：排序功能
const ageColumnResizable = ref(false) // 年龄列：列宽调整
const emailColumnFilterable = ref(true) // 邮箱列：过滤功能
const departmentColumnMovable = ref(true) // 部门列：列移动
const positionColumnPinned = ref(null as 'left' | 'right' | null) // 职位列：列固定位置
const salaryColumnHeaderAlign = ref('right' as 'left' | 'center' | 'right') // 薪资列：表头对齐
const statusColumnCellAlign = ref('center' as 'left' | 'center' | 'right') // 状态列：单元格对齐
const phoneColumnVisible = ref(true) // 电话列：列显示
const addressColumnEditable = ref(false) // 地址列：列编辑

// 通用选项
const columnPinnedOptions = [
  { label: '职位列不固定', value: null },
  { label: '职位列左侧固定', value: 'left' },
  { label: '职位列右侧固定', value: 'right' },
]
const columnHeaderAlignOptions = [
  { label: '薪资列表头左对齐', value: 'left' },
  { label: '薪资列表头居中', value: 'center' },
  { label: '薪资列表头右对齐', value: 'right' },
]
const columnCellAlignOptions = [
  { label: '状态列左对齐', value: 'left' },
  { label: '状态列居中', value: 'center' },
  { label: '状态列右对齐', value: 'right' },
]
// ==================== 列定义 ====================

// 列定义 - 支持列分组和单元格合并功能
const columnDefs = computed((): (ExtendedColDef | ExtendedColGroupDef)[] => {
  if (enableColumnGrouping.value) {
    // 启用列分组
    return [
      {
        headerName: '基本信息',
        marryChildren: true,
        children: [
          {
            field: 'id',
            headerName: 'ID',
            width: idColumnWidthMode.value === 'auto' ? undefined : 50,
            pinned: 'left',
          },
          {
            field: 'name',
            headerName: '姓名',
            sortable: nameColumnSortable.value,
          },
          {
            field: 'age',
            headerName: '年龄',
            resizable: ageColumnResizable.value,
          },
        ],
      },
      {
        headerName: '联系信息',
        marryChildren: true,
        children: [
          {
            field: 'email',
            headerName: '邮箱',
            minWidth: 200,
            filter: emailColumnFilterable.value,
          },
          {
            field: 'phone',
            headerName: '电话',
            hide: !phoneColumnVisible.value,
          },
          {
            field: 'address',
            headerName: '地址',
            editable: addressColumnEditable.value,
          },
        ],
      },
      {
        headerName: '工作信息',
        marryChildren: true,
        children: [
          {
            field: 'department',
            headerName: '部门',
            suppressMovable: !departmentColumnMovable.value,
            rowSpan: params => {
              // 如果部门相同则合并行
              const currentDept = params.data.department
              const rowIndex = params.node?.rowIndex
              const api = params.api

              // 检查参数有效性
              if (rowIndex === null || rowIndex === undefined) {
                return 1
              }

              // 检查上一行是否相同部门
              if (rowIndex > 0) {
                const prevRow = api.getDisplayedRowAtIndex(rowIndex - 1)
                if (prevRow && prevRow.data.department === currentDept) {
                  return 0 // 隐藏当前单元格
                }
              }

              // 计算需要合并的行数
              let spanCount = 1
              let nextIndex = rowIndex + 1
              while (nextIndex < api.getDisplayedRowCount()) {
                const nextRow = api.getDisplayedRowAtIndex(nextIndex)
                if (nextRow && nextRow.data.department === currentDept) {
                  spanCount++
                  nextIndex++
                } else {
                  break
                }
              }

              return spanCount
            },
          },
          {
            field: 'position',
            headerName: '职位',
            pinned: positionColumnPinned.value,
          },
          {
            field: 'salary',
            headerName: '薪资',
            context: {
              headerTextAlign: salaryColumnHeaderAlign.value,
              cellTextAlign: 'right',
            },
            valueFormatter: (params: any) => {
              return `¥${params.value?.toLocaleString() || 0}`
            },
          },
        ],
      },
      {
        headerName: '状态信息',
        marryChildren: true,
        children: [
          {
            field: 'status',
            headerName: '状态',
            context: {
              headerTextAlign: 'center',
              cellTextAlign: statusColumnCellAlign.value,
            },
            valueGetter: (params: any) => {
              const status = params.data?.status
              const statusMap = {
                active: '在职',
                inactive: '离职',
                pending: '待定',
              }
              return statusMap[status as keyof typeof statusMap] || status
            },
          },
          {
            field: 'joinDate',
            headerName: '入职日期',
            pinned: 'right',
            valueFormatter: (params: any) => {
              if (!params.value) {
                return ''
              }
              return new Date(params.value).toLocaleDateString('zh-CN')
            },
          },
        ],
      },
    ]
  } else {
    // 普通列定义（无分组）
    return [
      {
        field: 'id',
        headerName: 'ID',
        width: idColumnWidthMode.value === 'auto' ? undefined : 50,
        pinned: 'left',
      },
      {
        field: 'name',
        headerName: '姓名',
        sortable: nameColumnSortable.value,
        colSpan: params => {
          // 当名字是 '陈十八' 时，这个单元格横跨 2 列
          return params.data.name === '陈十八' ? 2 : 1
        },
        rowSpan: params => {
          // 当名字是 '陈十八' 时，这个单元格纵跨 2 列
          return params.data.name === '陈十八' ? 2 : 1
        },
      },
      {
        field: 'age',
        headerName: '年龄',
        resizable: ageColumnResizable.value,
      },
      {
        field: 'email',
        headerName: '邮箱',
        minWidth: 200,
        filter: emailColumnFilterable.value,
      },
      {
        field: 'phone',
        headerName: '电话',
        hide: !phoneColumnVisible.value,
      },
      {
        field: 'address',
        headerName: '地址',
        editable: addressColumnEditable.value,
      },
      {
        field: 'department',
        headerName: '部门',
        suppressMovable: !departmentColumnMovable.value,
        rowSpan: params => {
          // 如果部门相同则合并行
          const currentDept = params.data.department
          const rowIndex = params.node?.rowIndex
          const api = params.api

          // 检查参数有效性
          if (rowIndex === null || rowIndex === undefined) {
            return 1
          }

          // 检查上一行是否相同部门
          if (rowIndex > 0) {
            const prevRow = api.getDisplayedRowAtIndex(rowIndex - 1)
            if (prevRow && prevRow.data.department === currentDept) {
              return 0 // 隐藏当前单元格
            }
          }

          // 计算需要合并的行数
          let spanCount = 1
          let nextIndex = rowIndex + 1
          while (nextIndex < api.getDisplayedRowCount()) {
            const nextRow = api.getDisplayedRowAtIndex(nextIndex)
            if (nextRow && nextRow.data.department === currentDept) {
              spanCount++
              nextIndex++
            } else {
              break
            }
          }

          return spanCount
        },
      },
      {
        field: 'position',
        headerName: '职位',
        pinned: positionColumnPinned.value,
      },
      {
        field: 'salary',
        headerName: '薪资',
        context: {
          headerTextAlign: salaryColumnHeaderAlign.value,
          cellTextAlign: 'right',
        },
        valueFormatter: (params: any) => {
          return `¥${params.value?.toLocaleString() || 0}`
        },
      },
      {
        field: 'status',
        headerName: '状态',
        context: {
          headerTextAlign: 'center',
          cellTextAlign: statusColumnCellAlign.value,
        },
        valueGetter: (params: any) => {
          const status = params.data?.status
          const statusMap = {
            active: '在职',
            inactive: '离职',
            pending: '待定',
          }
          return statusMap[status as keyof typeof statusMap] || status
        },
      },
      {
        field: 'joinDate',
        headerName: '入职日期',
        pinned: 'right',
        valueFormatter: (params: any) => {
          if (!params.value) {
            return ''
          }
          return new Date(params.value).toLocaleDateString('zh-CN')
        },
      },
    ]
  }
})

/* 自定义家数据 */
const rowData = [
  {
    id: 1,
    name: '陈十八',
    age: 28,
    email: 'chen18@example.com',
    department: '技术部',
    position: '前端工程师',
    salary: 15000,
    status: 'active',
    joinDate: '2022-03-15',
    phone: '13800138001',
    address: '北京市朝阳区',
  },
  {
    id: 2,
    name: '李四',
    age: 28,
    email: 'lisi@example.com',
    department: '技术部',
    position: '后端工程师',
    salary: 18000,
    status: 'active',
    joinDate: '2021-08-20',
    phone: '13800138002',
    address: '上海市浦东新区',
  },
  {
    id: 3,
    name: '王五',
    age: 28,
    email: 'wangwu@example.com',
    department: '技术部',
    position: 'UI设计师',
    salary: 12000,
    status: 'active',
    joinDate: '2023-01-10',
    phone: '13800138003',
    address: '广州市天河区',
  },
  {
    id: 4,
    name: '赵六',
    age: 28,
    email: 'zhaoliu@example.com',
    department: '技术部',
    position: '产品经理',
    salary: 20000,
    status: 'active',
    joinDate: '2020-06-01',
    phone: '13800138004',
    address: '深圳市南山区',
  },
  {
    id: 5,
    name: '钱七',
    age: 29,
    email: 'qianqi@example.com',
    department: '运营部',
    position: '运营专员',
    salary: 10000,
    status: 'inactive',
    joinDate: '2022-11-15',
    phone: '13800138005',
    address: '杭州市西湖区',
  },
  {
    id: 6,
    name: '孙八',
    age: 27,
    email: 'sunba@example.com',
    department: '技术部',
    position: '测试工程师',
    salary: 13000,
    status: 'active',
    joinDate: '2023-05-20',
    phone: '13800138006',
    address: '成都市武侯区',
  },
  {
    id: 7,
    name: '周九',
    age: 31,
    email: 'zhoujiu@example.com',
    department: '市场部',
    position: '市场专员',
    salary: 11000,
    status: 'active',
    joinDate: '2022-09-01',
    phone: '13800138007',
    address: '武汉市江汉区',
  },
  {
    id: 8,
    name: '吴十',
    age: 26,
    email: 'wushi@example.com',
    department: '人事部',
    position: '人事专员',
    salary: 9000,
    status: 'pending',
    joinDate: '2023-08-15',
    phone: '13800138008',
    address: '南京市鼓楼区',
  },
  {
    id: 9,
    name: '郑十一',
    age: 33,
    email: 'zhengshiyi@example.com',
    department: '财务部',
    position: '会计',
    salary: 14000,
    status: 'active',
    joinDate: '2021-12-01',
    phone: '13800138009',
    address: '西安市雁塔区',
  },
  {
    id: 10,
    name: '王十二',
    age: 24,
    email: 'wangshier@example.com',
    department: '技术部',
    position: '实习生',
    salary: 5000,
    status: 'active',
    joinDate: '2023-10-01',
    phone: '13800138010',
    address: '重庆市渝中区',
  },
  {
    id: 11,
    name: '李十三',
    age: 30,
    email: 'lishisan@example.com',
    department: '销售部',
    position: '销售经理',
    salary: 16000,
    status: 'active',
    joinDate: '2022-01-15',
    phone: '13800138011',
    address: '天津市和平区',
  },
  {
    id: 12,
    name: '张十四',
    age: 28,
    email: 'zhangshisi@example.com',
    department: '客服部',
    position: '客服主管',
    salary: 12000,
    status: 'active',
    joinDate: '2022-07-01',
    phone: '13800138012',
    address: '苏州市姑苏区',
  },
  {
    id: 13,
    name: '刘十五',
    age: 35,
    email: 'liushiwu@example.com',
    department: '技术部',
    position: '架构师',
    salary: 25000,
    status: 'active',
    joinDate: '2020-03-01',
    phone: '13800138013',
    address: '长沙市岳麓区',
  },
  {
    id: 14,
    name: '陈十六',
    age: 27,
    email: 'chenshiliu@example.com',
    department: '设计部',
    position: '平面设计师',
    salary: 11000,
    status: 'active',
    joinDate: '2023-02-20',
    phone: '13800138014',
    address: '福州市鼓楼区',
  },
  {
    id: 15,
    name: '杨十七',
    age: 29,
    email: 'yangshiqi@example.com',
    department: '运营部',
    position: '运营经理',
    salary: 15000,
    status: 'active',
    joinDate: '2022-05-10',
    phone: '13800138015',
    address: '郑州市金水区',
  },
  // 添加更多相同部门的数据用于演示合并功能
  {
    id: 16,
    name: '陈十八',
    age: 26,
    email: 'chenshiba@example.com',
    department: '技术部',
    position: '全栈工程师',
    salary: 16000,
    status: 'active',
    joinDate: '2023-03-15',
    phone: '13800138016',
    address: '杭州市西湖区',
  },
  {
    id: 17,
    name: '林十九',
    age: 31,
    email: 'linshijiu@example.com',
    department: '技术部',
    position: '架构师',
    salary: 22000,
    status: 'active',
    joinDate: '2021-09-20',
    phone: '13800138017',
    address: '成都市武侯区',
  },
  {
    id: 18,
    name: '黄二十',
    age: 28,
    email: 'huangershi@example.com',
    department: '设计部',
    position: '交互设计师',
    salary: 13000,
    status: 'active',
    joinDate: '2022-11-01',
    phone: '13800138018',
    address: '武汉市江汉区',
  },
  {
    id: 19,
    name: '吴二一',
    age: 33,
    email: 'wuereryi@example.com',
    department: '设计部',
    position: '视觉设计师',
    salary: 14000,
    status: 'inactive',
    joinDate: '2020-12-15',
    phone: '13800138019',
    address: '南京市鼓楼区',
  },
  {
    id: 20,
    name: '徐二二',
    age: 27,
    email: 'xuerer@example.com',
    department: '产品部',
    position: '产品助理',
    salary: 11000,
    status: 'pending',
    joinDate: '2023-07-01',
    phone: '13800138020',
    address: '西安市雁塔区',
  },
  {
    id: 21,
    name: '孙二三',
    age: 30,
    email: 'sunersan@example.com',
    department: '产品部',
    position: '产品总监',
    salary: 25000,
    status: 'active',
    joinDate: '2020-04-10',
    phone: '13800138021',
    address: '重庆市渝中区',
  },
  {
    id: 22,
    name: '马二四',
    age: 25,
    email: 'maersi@example.com',
    department: '运营部',
    position: '内容运营',
    salary: 9000,
    status: 'active',
    joinDate: '2023-06-15',
    phone: '13800138022',
    address: '天津市和平区',
  },
  {
    id: 23,
    name: '朱二五',
    age: 32,
    email: 'zhuerwu@example.com',
    department: '运营部',
    position: '用户运营',
    salary: 12000,
    status: 'active',
    joinDate: '2021-10-20',
    phone: '13800138023',
    address: '苏州市姑苏区',
  },
  {
    id: 24,
    name: '胡二六',
    age: 29,
    email: 'huerliu@example.com',
    department: '市场部',
    position: '市场专员',
    salary: 10000,
    status: 'inactive',
    joinDate: '2022-08-05',
    phone: '13800138024',
    address: '长沙市岳麓区',
  },
  {
    id: 25,
    name: '郭二七',
    age: 26,
    email: 'guoerqi@example.com',
    department: '市场部',
    position: '品牌经理',
    salary: 15000,
    status: 'active',
    joinDate: '2023-01-10',
    phone: '13800138025',
    address: '福州市鼓楼区',
  },
]

/* 自定义配色 */
const customColorConfig: GridColorConfig = {
  // ==================== 表格整体配色 ====================
  backgroundColor: '#ffffff', // 纯白背景
  borderColor: '#000000', // 纯黑边框，强烈对比

  // ==================== 表头配色 ====================
  headerBackgroundColor: '#0078d7', // 明亮蓝色表头
  headerTextColor: '#ffffff', // 白色表头文字
  headerCellHoverBackgroundColor: '#0099ff', // 悬停更亮蓝
  headerCellMovingBackgroundColor: '#005a9e', // 拖动更深蓝

  // ==================== 行配色 ====================
  rowTextColor: '#222222', // 深灰主文字
  rowHoverBackgroundColor: '#d0f0ff', // 悬停浅蓝

  // ==================== 奇偶行配色 ====================
  oddRowBackgroundColor: '#f5faff', // 淡蓝灰，易区分

  // ==================== 选中行配色 ====================
  selectedRowBackgroundColor: '#ffeb3b', // 明黄色，强提示

  // ==================== 聚焦与复选框配色 ====================
  checkboxCheckedBackgroundColor: '#00c853', // 选中绿
  checkboxUncheckedBackgroundColor: '#ffffff', // 未选白
  checkboxUncheckedBorderColor: '#9e9e9e', // 中灰边框
  checkboxBorderWidth: '2px',
  cellFocusBackgroundColor: '#ffcc80', // 聚焦橙

  // ==================== 编辑状态配色 ====================
  editingCellBackgroundColor: '#fff3e0', // 编辑状态浅橙底
  editingCellTextColor: '#000000', // 编辑文字黑色
  editingCellBorderColor: '#ff6f00', // 编辑边框亮橙

  // ==================== 滚动条配色 ====================
  scrollbarColor: '#9c27b0', // 紫色滚动条滑块
  scrollbarHoverColor: '#ba68c8', // 悬停淡紫
  scrollbarTrackColor: '#e1bee7', // 轨道浅紫粉

  // ==================== 加载和空状态配色 ====================
  loadingOverlayBackgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明黑背景
  loadingOverlayTextColor: '#ffffff', // 白色加载文字
  noRowsOverlayBackgroundColor: '#ffebee', // 无数据淡粉背景
  noRowsOverlayTextColor: '#d32f2f', // 无数据红文字

  // ==================== 工具栏和状态栏配色 ====================
  toolbarBackgroundColor: '#2196f3', // 工具栏亮蓝
  statusBarBackgroundColor: '#4caf50', // 状态栏亮绿
  statusBarTextColor: '#ffffff', // 白色文字
}
const colorConfig = {}
const isCustomColorConfig = ref(false)
const currentColorConfig = computed(() => {
  return isCustomColorConfig.value ? customColorConfig : colorConfig
})

/* 默认尺寸 - 表格会自动响应系统尺寸模式变化（紧凑/舒适/宽松） */
const sizeConfig: GridSizeConfig = {
  heightMode: 'fill', //内容自动撑满容器
  defaultColumnWidth: 'auto', //默认列宽自适应
  // 注意：表格会根据系统尺寸模式自动调整行高、表头高度、列宽等
  // 紧凑模式：行高32px，表头36px，滚动条6px
  // 舒适模式：行高38px，表头42px，滚动条8px
  // 宽松模式：行高48px，表头52px，滚动条12px
}
const customSizeConfig: GridSizeConfig = {
  rowHeight: 28, //行高
  headerHeight: 52, //表头高度
  defaultColumnWidth: 150,
  height: 400, //固定高度400px
  heightMode: 'fixed', //固定高度
  globalCellTextAlign: 'right', //全局单元格水平对齐方式
  globalCellVerticalAlign: 'middle', //全局单元格垂直对齐方式
  globalHeaderTextAlign: 'right', //全局表头水平对齐方式
  globalHeaderVerticalAlign: 'middle', //全局表头垂直对齐方式
}
const isCustomSizeConfig = ref(false)
const currentSizeConfig = computed(() => {
  return isCustomSizeConfig.value ? customSizeConfig : sizeConfig
})

// ==================== 表格功能配置示例 ====================

// 表格选项配置
const customGridOptions = {
  onRowClicked: (_event: any) => {
    // console.log('行被点击:', event.data)
  },
  onCellClicked: (_event: any) => {
    // console.log('单元格被点击:', event.value, '列:', event.colDef.field)
  },
  onRowDoubleClicked: (_event: any) => {
    // console.log('行被双击:', event.data)
  },
  onCellDoubleClicked: (_event: any) => {
    // console.log('单元格被双击:', event.value, '列:', event.colDef.field)
  },
}
const gridOptions = {}
const isCustomGridOptions = ref(true)
const currentGridOptions = computed(() => {
  return isCustomGridOptions.value ? customGridOptions : gridOptions
})

// 边框显示

// 行号显示
const showRowNumbers = ref(false)

// 行选择模式
const rowSelectionOptions = [
  { label: '无选择', value: null },
  { label: '单选', value: 'single' },
  { label: '多选', value: 'multiple' },
]
const currentRowSelection = ref(null)
// 是否能点击行选中
const enableRowClickSelection = ref(false)

// 排序功能
const enableSorting = ref(false)

// 过滤功能
const enableFilter = ref(false)

// 列宽调整
const enableColumnResize = ref(false)

// 工具栏显示
const showToolbar = ref(false)

// 状态栏显示
const showStatusBar = ref(false)

// 自定义CSS类名
const customClass = ref('')

// 自定义样式
const customStyle = ref({})

// 复选框位置
const selectionCheckboxPositionOptions = [
  { label: '左侧', value: 'left' },
  { label: '右侧', value: 'right' },
]
const currentSelectionCheckboxPosition = ref('left' as 'left' | 'right')

// 行悬停高亮
const enableRowHoverHighlight = ref(true)

// 列适配视口
const fitColumnsToViewport = ref(true)

// 单元格聚焦高亮
const enableCellFocusHighlight = ref(false)

// 斑马线
const enableZebraStripe = ref(false)

// 列拖拽
const enableColumnDrag = ref(false)

// 纵向分割线
const enableVerticalSplitLine = ref(true)

// 横向分割线
const enableHorizontalSplitLine = ref(true)

// 剪贴板功能
const enableClipboard = ref(false)

// 跟随系统尺寸
const followSystemSize = ref(true)

// 单元格跨越功能
// 注意：enableCellSpan 和 spanRows 是 AG Grid 企业版功能，社区版不支持
// const enableCellSpan = ref(false)

// 列分组功能
const enableColumnGrouping = ref(false)
</script>

<template lang="pug">
.full.between-col.gap-gap
  .c-border(class='h-40%')
    ScrollbarWrapper(ref='scrollbarRef', wrapper-class='pr-6', :size='2')
      .p-padding
        .color-accent100.mb-gaps 表格配置
        .grid.grid-cols-3.gap-gap(class='sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xxl:grid-cols-8')
          // ==================== 基础配置 ====================
          Button(
            :severity='isCustomColorConfig ? "primary" : "secondary"',
            @click='isCustomColorConfig = !isCustomColorConfig'
          ) {{ isCustomColorConfig ? '自定义配色' : '默认配色' }}
          Button(
            :severity='isCustomSizeConfig ? "success" : "secondary"',
            @click='isCustomSizeConfig = !isCustomSizeConfig'
          ) {{ isCustomSizeConfig ? '自定义尺寸' : '默认尺寸' }}

          // ==================== 表格功能 ====================
          Button(
            :severity='showRowNumbers ? "success" : "secondary"',
            @click='showRowNumbers = !showRowNumbers'
          ) {{ showRowNumbers ? '显示行号' : '隐藏行号' }}
          Button(
            :severity='enableSorting ? "success" : "secondary"',
            @click='enableSorting = !enableSorting'
          ) {{ enableSorting ? '启用排序' : '禁用排序' }}
          Button(
            :severity='enableFilter ? "success" : "secondary"',
            @click='enableFilter = !enableFilter'
          ) {{ enableFilter ? '启用过滤' : '禁用过滤' }}
          Button(
            :severity='enableColumnResize ? "success" : "secondary"',
            @click='enableColumnResize = !enableColumnResize'
          ) {{ enableColumnResize ? '可调列宽' : '固定列宽' }}

          // ==================== 选择功能 ====================
          Select(
            v-model='currentRowSelection',
            :options='rowSelectionOptions',
            option-label='label',
            option-value='value',
            placeholder='选择模式'
          )
          Select(
            v-model='currentSelectionCheckboxPosition',
            :options='selectionCheckboxPositionOptions',
            option-label='label',
            option-value='value',
            placeholder='复选框位置'
          )
          Button(
            :severity='enableRowClickSelection ? "success" : "secondary"',
            @click='enableRowClickSelection = !enableRowClickSelection'
          ) {{ enableRowClickSelection ? '可点击行选中' : '禁用点击行选中' }}
          // ==================== 视觉效果 ====================
          Button(
            :severity='enableRowHoverHighlight ? "success" : "secondary"',
            @click='enableRowHoverHighlight = !enableRowHoverHighlight'
          ) {{ enableRowHoverHighlight ? '行悬停高亮' : '禁用悬停' }}

          Button(
            :severity='enableCellFocusHighlight ? "success" : "secondary"',
            @click='enableCellFocusHighlight = !enableCellFocusHighlight'
          ) {{ enableCellFocusHighlight ? '单元格聚焦' : '禁用聚焦' }}
          Button(
            :severity='enableZebraStripe ? "success" : "secondary"',
            @click='enableZebraStripe = !enableZebraStripe'
          ) {{ enableZebraStripe ? '斑马线' : '禁用斑马线' }}
          Button(
            :severity='enableVerticalSplitLine ? "success" : "secondary"',
            @click='enableVerticalSplitLine = !enableVerticalSplitLine'
          ) {{ enableVerticalSplitLine ? '纵向分割线' : '禁用纵向线' }}
          Button(
            :severity='enableHorizontalSplitLine ? "success" : "secondary"',
            @click='enableHorizontalSplitLine = !enableHorizontalSplitLine'
          ) {{ enableHorizontalSplitLine ? '横向分割线' : '禁用横向线' }}

          // ==================== 交互功能 ====================
          Button(
            :severity='enableColumnDrag ? "success" : "secondary"',
            @click='enableColumnDrag = !enableColumnDrag'
          ) {{ enableColumnDrag ? '列拖拽' : '禁用拖拽' }}
          Button(
            :severity='fitColumnsToViewport ? "success" : "secondary"',
            @click='fitColumnsToViewport = !fitColumnsToViewport'
          ) {{ fitColumnsToViewport ? '适配视口' : '固定列宽' }}
          Button(
            :severity='enableClipboard ? "success" : "secondary"',
            @click='enableClipboard = !enableClipboard'
          ) {{ enableClipboard ? '剪贴板' : '禁用剪贴板' }}
          Button(
            :severity='followSystemSize ? "success" : "secondary"',
            @click='followSystemSize = !followSystemSize'
          ) {{ followSystemSize ? '跟随系统尺寸' : '自定义尺寸' }}
          // 注意：单元格合并功能需要 AG Grid 企业版，社区版不支持
          Button(
            :severity='enableColumnGrouping ? "success" : "secondary"',
            @click='enableColumnGrouping = !enableColumnGrouping'
          ) {{ enableColumnGrouping ? '启用列分组' : '禁用列分组' }}
        .color-accent100.mt-gap.mb-gaps 高级功能说明
        .text-sm.color-text200.mb-2
          | • 列合并（colSpan）：当姓名为"陈十八"时，该单元格会横跨2列、纵跨两列
          br
          | • 部门合并：相同部门的单元格会自动合并显示
          br
          | • 注意：合并功能仅在视觉层面生效，不影响数据结构和排序筛选
        .text-sm.text-text200
          p • <strong>列分组</strong>：将相关列组织在一起，创建分组表头
          p • <strong>单元格合并</strong>：相同值的连续行会自动合并显示
          p • <strong>数据说明</strong>：已添加更多相同部门/状态的数据用于演示合并效果

          // ==================== 工具栏和状态栏 ====================
          Button(
            :severity='showToolbar ? "success" : "secondary"',
            @click='showToolbar = !showToolbar'
          ) {{ showToolbar ? '显示工具栏' : '隐藏工具栏' }}
          Button(
            :severity='showStatusBar ? "success" : "secondary"',
            @click='showStatusBar = !showStatusBar'
          ) {{ showStatusBar ? '显示状态栏' : '隐藏状态栏' }}
        .color-accent100.mt-gap.mb-gaps 表格列配置
        .grid.grid-cols-3.gap-gap(class='sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xxl:grid-cols-8')
          // ==================== 每列独特配置项示例 ====================
          Button(
            :severity='idColumnWidthMode === "auto" ? "success" : "secondary"',
            @click='idColumnWidthMode = idColumnWidthMode === "auto" ? "fixed" : "auto"'
          ) ID列宽{{ idColumnWidthMode === 'auto' ? '自适应' : '固定' }}
          Button(
            :severity='nameColumnSortable ? "success" : "secondary"',
            @click='nameColumnSortable = !nameColumnSortable'
          ) 姓名列{{ nameColumnSortable ? '可排序' : '禁用排序' }}
          Button(
            :severity='ageColumnResizable ? "success" : "secondary"',
            @click='ageColumnResizable = !ageColumnResizable'
          ) 年龄列{{ ageColumnResizable ? '可调宽' : '固定宽' }}
          Button(
            :severity='emailColumnFilterable ? "success" : "secondary"',
            @click='emailColumnFilterable = !emailColumnFilterable'
          ) 邮箱列{{ emailColumnFilterable ? '可过滤' : '禁用过滤' }}
          Button(
            :severity='departmentColumnMovable ? "success" : "secondary"',
            @click='departmentColumnMovable = !departmentColumnMovable'
          ) 部门列{{ departmentColumnMovable ? '可移动' : '固定位置' }}
          Select(
            v-model='positionColumnPinned',
            :options='columnPinnedOptions',
            option-label='label',
            option-value='value',
            placeholder='职位列固定位置'
          )
          Select(
            v-model='salaryColumnHeaderAlign',
            :options='columnHeaderAlignOptions',
            option-label='label',
            option-value='value',
            placeholder='薪资列表头对齐'
          )
          Select(
            v-model='statusColumnCellAlign',
            :options='columnCellAlignOptions',
            option-label='label',
            option-value='value',
            placeholder='状态列单元格对齐'
          )
          Button(
            :severity='phoneColumnVisible ? "success" : "secondary"',
            @click='phoneColumnVisible = !phoneColumnVisible'
          ) 电话列{{ phoneColumnVisible ? '显示' : '隐藏' }}
          Button(
            :severity='addressColumnEditable ? "success" : "secondary"',
            @click='addressColumnEditable = !addressColumnEditable'
          ) 地址列{{ addressColumnEditable ? '可编辑' : '只读' }}
  div(class='h-60%')
    GridTable(
      :column-defs='columnDefs',
      :row-data='rowData',
      :color-config='currentColorConfig',
      :size-config='currentSizeConfig',
      :grid-options='currentGridOptions',
      :show-row-numbers='showRowNumbers',
      :row-selection='currentRowSelection',
      :enable-sorting='enableSorting',
      :enable-filter='enableFilter',
      :enable-column-resize='enableColumnResize',
      :enable-row-click-selection='enableRowClickSelection',
      :show-toolbar='showToolbar',
      :show-status-bar='showStatusBar',
      :custom-class='customClass',
      :custom-style='customStyle',
      :selection-checkbox-position='currentSelectionCheckboxPosition',
      :enable-row-hover-highlight='enableRowHoverHighlight',
      :fit-columns-to-viewport='fitColumnsToViewport',
      :enable-cell-focus-highlight='enableCellFocusHighlight',
      :enable-zebra-stripe='enableZebraStripe',
      :enable-column-drag='enableColumnDrag',
      :enable-vertical-split-line='enableVerticalSplitLine',
      :enable-horizontal-split-line='enableHorizontalSplitLine',
      :enable-clipboard='enableClipboard',
      :follow-system-size='followSystemSize'
    )
</template>
