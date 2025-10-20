<script setup lang="tsx">
import type { ExtendedColDef } from '@/components/modules/grid-table'
import { GridTable } from '@/components/modules/grid-table'
import { PrimeVueDialog, addDialog, dialogStore } from '@/components/modules/prime-dialog'
import { SchemaForm } from '@/components/modules/schema-form'
import type { Schema } from '@/components/modules/schema-form/utils/types'
import { ScrollbarWrapper } from '@/components/modules/scrollbar-wrapper'
import { useDialog } from '@/hooks/components/useDialog'
import { ref } from 'vue'

// 注意：ActionCell 组件现在由 GridTable 组件自动注册，无需手动定义 gridOptions

// ==================== 列定义（含操作列） ====================

const columnDefs = ref<ExtendedColDef[]>([
  {
    field: 'id',
    headerName: 'ID',
    pinned: 'left',
    width: 50,
    minWidth: 50,
    maxWidth: 50,
  },
  {
    field: 'name',
    headerName: '姓名',
    minWidth: 80,
  },
  {
    field: 'age',
    headerName: '年龄',
    width: 80,
    minWidth: 70,
    maxWidth: 120,
  },
  {
    field: 'email',
    headerName: '邮箱',
    minWidth: 200,
  },
  {
    field: 'department',
    headerName: '部门',
    minWidth: 100,
  },
  {
    field: 'position',
    headerName: '职位',
    minWidth: 80,
  },
  {
    field: 'salary',
    headerName: '薪资',
    sortable: true,
    valueFormatter: (params: any) => {
      return `¥${params.value?.toLocaleString() || 0}`
    },
    minWidth: 100,
  },
  {
    field: 'status',
    headerName: '状态',
    valueGetter: (params: any) => {
      const status = params.data?.status
      const statusMap = {
        active: '在职',
        inactive: '离职',
        pending: '待定',
      }
      return statusMap[status as keyof typeof statusMap] || status
    },
    width: 100,
    minWidth: 90,
  },
  {
    field: 'joinDate',
    headerName: '入职日期',
    valueFormatter: (_params: any) => {
      if (!_params.value) {
        return ''
      }
      return new Date(_params.value).toLocaleDateString('zh-CN')
    },
    minWidth: 140,
  },
  {
    field: 'phone',
    headerName: '电话',
    minWidth: 130,
  },
  {
    field: 'address',
    headerName: '地址',
    minWidth: 160,
  },
  {
    field: 'actions',
    headerName: '操作',
    pinned: 'right',
    minWidth: 280,
    sortable: false,
    filter: false,
    cellRenderer: 'actionCell',
    cellRendererParams: {
      showView: true,
      showEdit: true,
      showDelete: true,
      buttonLabels: {
        view: '查看详情',
        edit: '编辑内容',
        delete: '移除项',
      },
      onView: (row: any) => handleView(row),
      onEdit: (row: any) => handleEdit(row),
      onDelete: (row: any) => handleDelete(row),
    },
  },
])

// ==================== 假数据（人员管理） ====================

const rowData = ref([
  {
    id: 1,
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
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
    age: 32,
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
    age: 25,
    email: 'wangwu@example.com',
    department: '设计部',
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
    age: 35,
    email: 'zhaoliu@example.com',
    department: '产品部',
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
])

// ==================== 事件与 CRUD 逻辑 ====================

const gridRef = ref<InstanceType<typeof GridTable> | null>(null)
const { openDialog, closeDialog } = useDialog()

// ==================== SchemaForm 构建器 ====================
function buildPersonSchema(initial?: Record<string, any>): Schema {
  const init = initial || {}
  return {
    columns: [
      {
        field: 'name',
        label: '姓名',
        component: 'InputText',
        rules: 'required',
        defaultValue: init.name ?? '',
      },
      {
        field: 'age',
        label: '年龄',
        component: 'InputNumber',
        rules: 'required|min:1|max:120|integer',
        defaultValue: init.age ?? 25,
        props: { min: 1, max: 120, step: 1 },
      },
      {
        field: 'email',
        label: '邮箱',
        component: 'InputText',
        rules: 'required|email',
        defaultValue: init.email ?? '',
      },
      {
        field: 'department',
        label: '部门',
        component: 'InputText',
        defaultValue: init.department ?? '',
      },
      {
        field: 'position',
        label: '职位',
        component: 'InputText',
        defaultValue: init.position ?? '',
      },
      {
        field: 'salary',
        label: '薪资',
        component: 'InputNumber',
        rules: 'min:0',
        defaultValue: init.salary ?? 0,
        props: { min: 0, step: 100 },
      },
      {
        field: 'status',
        label: '状态',
        component: 'Select',
        rules: 'required',
        defaultValue: init.status ?? 'active',
        props: {
          options: [
            { label: '在职', value: 'active' },
            { label: '离职', value: 'inactive' },
            { label: '待定', value: 'pending' },
          ],
        },
      },
      {
        field: 'joinDate',
        label: '入职日期',
        component: 'DatePicker',
        defaultValue: init.joinDate ? new Date(init.joinDate) : null,
        props: { showIcon: true, dateFormat: 'yy-mm-dd' },
      },
      { field: 'phone', label: '电话', component: 'InputText', defaultValue: init.phone ?? '' },
      { field: 'address', label: '地址', component: 'InputText', defaultValue: init.address ?? '' },
    ],
    layout: { labelAlign: 'top', labelPosition: 'left', labelWidth: 120 },
    gapY: 0,
  }
}

function handleView(record: any) {
  addDialog({
    header: `查看人员：${record.name}`,
    hideFooter: true,
    contentRenderer: () => (
      <div class="wa min-w-20vw max-w-60vw between-col gap-paddings">
        <div class="flex items-center gap-gap p-paddings">
          <label class="w-100 text-right color-text200">姓名：</label>
          <span>{record.name}</span>
        </div>
        <div class="flex items-center gap-gap p-paddings">
          <label class="w-100 text-right color-text200">年龄：</label>
          <span>{String(record.age)}</span>
        </div>
        <div class="flex items-center gap-gap p-paddings">
          <label class="w-100 text-right color-text200">邮箱：</label>
          <span>{record.email}</span>
        </div>
        <div class="flex items-center gap-gap p-paddings">
          <label class="w-100 text-right color-text200">部门：</label>
          <span>{record.department}</span>
        </div>
        <div class="flex items-center gap-gap p-paddings">
          <label class="w-100 text-right color-text200">职位：</label>
          <span>{record.position}</span>
        </div>
        <div class="flex items-center gap-gap p-paddings">
          <label class="w-100 text-right color-text200">薪资：</label>
          <span>{`¥${record.salary?.toLocaleString?.() || 0}`}</span>
        </div>
        <div class="flex items-center gap-gap p-paddings">
          <label class="w-100 text-right color-text200">状态：</label>
          <span>{record.status}</span>
        </div>
        <div class="flex items-center gap-gap p-paddings">
          <label class="w-100 text-right color-text200">入职日期：</label>
          <span>{record.joinDate}</span>
        </div>
        <div class="flex items-center gap-gap p-paddings">
          <label class="w-100 text-right color-text200">电话：</label>
          <span>{record.phone}</span>
        </div>
        <div class="flex items-center gap-gap p-paddings">
          <label class="w-100 text-right color-text200">地址：</label>
          <span>{record.address}</span>
        </div>
      </div>
    ),
  })
}

function handleEdit(record: any) {
  const schema: Schema = buildPersonSchema(record)
  const schemaFormRef = ref<any>(null)
  const dialogIndex = openDialog({
    header: `修改人员：${record.name}`,
    contentRenderer: () => {
      return (
        <div class="w-80vw md:w-40vw h-60vh">
          <ScrollbarWrapper wrapper-class="p-padding pr-20px">
            <SchemaForm
              schema={schema as any}
              ref={schemaFormRef}
            />
          </ScrollbarWrapper>
        </div>
      )
    },
    footerButtons: [
      {
        label: '取消',
        severity: 'secondary',
        text: true,
        btnClick: () => closeDialog(dialogIndex),
      },
      {
        label: '确定',
        severity: 'primary',
        btnClick: async () => {
          const result = await schemaFormRef.value?.validate?.()
          if (!result || !result.valid) {
            return
          }
          const values = schemaFormRef.value?.values || {}
          const index = rowData.value.findIndex(item => item.id === record.id)
          if (index !== -1) {
            rowData.value[index] = {
              ...rowData.value[index],
              ...values,
              joinDate: values.joinDate ? new Date(values.joinDate).toISOString().slice(0, 10) : '',
            }
          }
          gridRef.value?.setRowData?.(rowData.value)
          closeDialog(dialogIndex)
        },
      },
    ],
  })
}

function handleAdd() {
  const schema: Schema = buildPersonSchema({ joinDate: new Date().toISOString().slice(0, 10) })
  const schemaFormRef = ref<any>(null)
  const dialogIndex = openDialog({
    header: '新增人员',
    contentRenderer: () => {
      return (
        <div class="w-80vw md:w-40vw h-60vh">
          <ScrollbarWrapper wrapper-class="p-padding pr-20px">
            <SchemaForm
              schema={schema as any}
              ref={schemaFormRef}
            />
          </ScrollbarWrapper>
        </div>
      )
    },
    footerButtons: [
      {
        label: '取消',
        severity: 'secondary',
        text: true,
        btnClick: () => closeDialog(dialogIndex),
      },
      {
        label: '确定',
        severity: 'primary',
        btnClick: async () => {
          const result = await schemaFormRef.value?.validate?.()
          if (!result || !result.valid) {
            return
          }
          const values = schemaFormRef.value?.values || {}
          const nextId = Math.max(...rowData.value.map(r => r.id), 0) + 1
          const newRow = {
            id: nextId,
            ...values,
            joinDate: values.joinDate ? new Date(values.joinDate).toISOString().slice(0, 10) : '',
          }
          rowData.value.push(newRow)
          gridRef.value?.addRow?.(newRow)
          closeDialog(dialogIndex)
        },
      },
    ],
  })
}

function handleBatchDelete() {
  const api = gridRef.value?.gridApi ?? null
  const selected = (api && api.getSelectedRows ? api.getSelectedRows() : []) as any[]

  // 无选择时提示
  if (!selected || selected.length === 0) {
    const tipIndex = openDialog({
      header: '提示',
      contentRenderer: () => (
        <div class="p-padding fs-appFontSizes color-text100">请先选择需要删除的记录。</div>
      ),
      footerButtons: [
        {
          label: '确定',
          severity: 'primary',
          btnClick: () => closeDialog(tipIndex),
        },
      ],
    })
    return
  }

  // 有选择时二次确认
  const count = selected.length
  const dialogIndex = openDialog({
    header: '批量删除',
    contentRenderer: () => (
      <div class="p-padding fs-appFontSizes color-text100">
        已选择 <b class="color-danger100">{count}</b> 条记录，确定要删除吗？删除后无法恢复。
      </div>
    ),
    footerButtons: [
      {
        label: '取消',
        severity: 'secondary',
        text: true,
        btnClick: () => closeDialog(dialogIndex),
      },
      {
        label: '确定',
        severity: 'danger',
        btnClick: () => {
          const ids = new Set(selected.map((r: any) => r.id))
          rowData.value = rowData.value.filter(r => !ids.has(r.id))
          gridRef.value?.setRowData?.(rowData.value)
          // 清空选择
          api?.deselectAll?.()
          closeDialog(dialogIndex)
        },
      },
    ],
  })
}

function handleDelete(record: any) {
  const dialogIndex = openDialog({
    header: '删除确认',
    contentRenderer: () => (
      <div>
        <div class="p-padding fs-appFontSizes">确定删除“{record.name}”吗？删除后无法恢复。</div>
      </div>
    ),
    footerButtons: [
      {
        label: '取消',
        severity: 'secondary',
        text: true,
        btnClick: () => closeDialog(dialogIndex),
      },
      {
        label: '确定',
        severity: 'danger',
        btnClick: () => {
          const idx = rowData.value.findIndex(item => item.id === record.id)
          if (idx !== -1) {
            const removed = rowData.value.splice(idx, 1)[0]
            gridRef.value?.deleteRow?.(removed)
          }
          closeDialog(dialogIndex)
        },
      },
    ],
  })
}

// 旧的临时表单渲染已替换为 SchemaForm
</script>

<template lang="pug">
.full
  // 工具栏 + 表格 + 状态栏
  GridTable(
    ref='gridRef',
    :column-defs='columnDefs',
    :row-data='rowData',
    :show-toolbar='true',
    :show-status-bar='true',
    :row-selection='"multiple"'
  )
    template(#toolbar-left)
      .center.gap-gap
        Button(severity='primary', @click='handleAdd') 新增
        Button(severity='danger', @click='handleBatchDelete') 批量删除

  // 页面内挂载对话框渲染器
  PrimeVueDialog(:dialog-store='dialogStore')
</template>
