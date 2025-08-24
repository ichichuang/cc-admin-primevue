# PrimeVue Dialog 组件使用说明

## 概述

基于 PrimeVue 的 Dialog 组件封装，参考 pure-admin 的 ReDialog 组件设计，提供统一的对话框管理功能。

## 组件结构

```
src/components/modules/prime-dialog/
├── PrimeVueDialog.vue          # 主组件
├── index.ts                    # 导出文件
├── utils/
│   ├── types.ts               # 类型定义
│   └── constants.ts           # 常量定义
└── README.md                  # 详细文档
```

## 功能特性

1. **三种对话框类型**
   - 标准对话框 (Dialog)
   - 确认对话框 (ConfirmDialog)
   - 动态对话框 (DynamicDialog)

2. **统一管理**
   - 全局对话框状态管理
   - 支持多个对话框同时显示
   - 统一的 API 接口

3. **丰富的配置选项**
   - 自定义头部、内容、底部渲染
   - 支持按钮加载状态
   - 支持事件回调
   - 支持延时打开/关闭
   - 支持全屏、最大化、最小化操作

## 快速开始

### 1. 在 App.vue 中注册组件

```vue
<script setup lang="ts">
import { PrimeVueDialog, dialogStore } from '@/components/modules/prime-dialog'
</script>

<template>
  <PrimeVueDialog :dialog-store="dialogStore" />
</template>
```

### 2. 使用 useDialog Hook

```vue
<script setup lang="ts">
import { useDialog } from '@/hooks/components/useDialog'

const { openDialog, info, success, confirm } = useDialog()

// 打开标准对话框
const showDialog = () => {
  openDialog({
    header: '标题',
    contentRenderer: () => h('div', '内容'),
    footerButtons: [
      { label: '取消', severity: 'secondary', text: true },
      { label: '确定', severity: 'primary', text: true },
    ],
  })
}

// 便捷方法
const showInfo = () => info('信息提示')
const showSuccess = () => success('操作成功')
const showConfirm = () => confirm('确认操作', '确认', () => console.log('确认'))
</script>
```

## API 参考

### useDialog Hook

```typescript
const {
  // 基础方法
  openDialog, // 打开标准对话框
  openConfirm, // 打开确认对话框
  openDynamic, // 打开动态对话框
  closeDialog, // 关闭指定对话框
  closeAll, // 关闭所有对话框
  update, // 更新对话框属性

  // 便捷方法
  info, // 信息提示
  success, // 成功提示
  warning, // 警告提示
  error, // 错误提示
  confirm, // 确认对话框
  confirmDelete, // 删除确认对话框
} = useDialog()
```

### DialogOptions 配置

```typescript
interface DialogOptions {
  type?: 'dialog' | 'confirm' | 'dynamic' // 对话框类型
  visible?: boolean // 是否显示
  header?: string // 标题
  width?: string | number // 宽度
  height?: string | number // 高度
  maximizable?: boolean // 可最大化
  minimizable?: boolean // 可最小化
  closeOnEscape?: boolean // ESC键关闭
  closable?: boolean // 显示关闭按钮
  modal?: boolean // 显示遮罩
  center?: boolean // 居中显示
  destroyOnClose?: boolean // 关闭时销毁
  hideFooter?: boolean // 隐藏底部
  sureBtnLoading?: boolean // 确定按钮加载
  openDelay?: number // 打开延时
  closeDelay?: number // 关闭延时

  // 自定义渲染
  headerRenderer?: Function // 自定义头部
  contentRenderer?: Function // 自定义内容
  footerRenderer?: Function // 自定义底部
  footerButtons?: ButtonProps[] // 自定义按钮

  // 事件回调
  open?: Function // 打开回调
  close?: Function // 关闭回调
  closeCallBack?: Function // 关闭回调
  maximizeCallBack?: Function // 最大化回调
  minimizeCallBack?: Function // 最小化回调
  fullscreenCallBack?: Function // 全屏回调
  beforeCancel?: Function // 取消前回调
  beforeSure?: Function // 确定前回调
}
```

## 使用示例

### 标准对话框

```typescript
openDialog({
  header: '用户信息',
  width: '600px',
  contentRenderer: () =>
    h('div', { class: 'p-4' }, [
      h('p', '姓名：张三'),
      h('p', '年龄：25'),
      h('p', '邮箱：zhangsan@example.com'),
    ]),
  footerButtons: [
    {
      label: '取消',
      severity: 'secondary',
      text: true,
      btnClick: () => console.log('取消'),
    },
    {
      label: '确定',
      severity: 'primary',
      text: true,
      btnClick: () => console.log('确定'),
    },
  ],
})
```

### 确认对话框

```typescript
openConfirm(
  {
    header: '删除确认',
    message: '确定要删除这条记录吗？',
    acceptLabel: '删除',
    rejectLabel: '取消',
  },
  result => {
    if (result) {
      console.log('确认删除')
    } else {
      console.log('取消删除')
    }
  }
)
```

### 动态对话框

```typescript
openDynamic('div', { class: 'p-4' }, [
  h('h3', '动态内容'),
  h('p', '这是动态创建的对话框内容'),
  h(
    'button',
    {
      onClick: () => console.log('点击'),
    },
    '点击我'
  ),
])
```

### 便捷方法

```typescript
// 信息提示
info('这是一条信息提示')

// 成功提示
success('操作成功完成')

// 警告提示
warning('请注意这个警告')

// 错误提示
error('发生了一个错误')

// 确认操作
confirm(
  '确定要执行此操作吗？',
  '确认',
  () => console.log('确认'),
  () => console.log('取消')
)

// 删除确认
confirmDelete(
  '确定要删除吗？',
  '删除确认',
  () => console.log('确认删除'),
  () => console.log('取消删除')
)
```

## 注意事项

1. **组件注册**：确保在 App.vue 中正确注册了 PrimeVueDialog 组件
2. **PrimeVue 依赖**：确保项目中已正确安装和配置 PrimeVue
3. **类型安全**：使用 TypeScript 时，所有类型都已正确定义
4. **事件处理**：注意事件回调中的参数类型和结构
5. **样式定制**：可以通过 CSS 变量或深度选择器自定义样式

## 与 pure-admin ReDialog 的对比

| 特性       | pure-admin ReDialog | PrimeVue Dialog |
| ---------- | ------------------- | --------------- |
| 基础框架   | Element Plus        | PrimeVue        |
| 对话框类型 | 单一类型            | 三种类型        |
| 组件管理   | 全局状态            | 全局状态        |
| API 设计   | 统一接口            | 统一接口        |
| 类型支持   | TypeScript          | TypeScript      |
| 自定义渲染 | 支持                | 支持            |
| 事件回调   | 丰富                | 丰富            |
| 便捷方法   | 提供                | 提供            |

## 总结

这个 PrimeVue Dialog 组件封装提供了与 pure-admin ReDialog 类似的功能，但基于 PrimeVue 框架。它保持了统一的 API 设计，同时充分利用了 PrimeVue 的三种对话框组件特性，为项目提供了强大而灵活的对话框管理解决方案。
