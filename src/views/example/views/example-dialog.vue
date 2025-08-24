<script setup lang="ts">
import { dialogStore } from '@/components/modules/prime-dialog'
import { useDialog } from '@/hooks/components/useDialog'
import { useConfirm } from 'primevue/useconfirm'
import { useDialog as usePrimeDialog } from 'primevue/usedialog'
import { h } from 'vue'

const { openDialog, info, success, warning, error, confirm, update, closeDialog } = useDialog()

// PrimeVue 的确认对话框
const confirmDialog = useConfirm()

// PrimeVue 的动态对话框
const dynamicDialog = usePrimeDialog()

// 打开标准对话框
const openStandardDialog = () => {
  console.log('打开标准对话框')
  const dialogIndex = dialogStore.value.length
  openDialog({
    header: '标准对话框',
    contentRenderer: () => h('div', { class: 'p-4' }, '这是一个标准对话框的内容'),
    footerButtons: [
      {
        label: '取消',
        severity: 'secondary',
        text: true,
        btnClick: () => {
          console.log('取消按钮点击')
          closeDialog(dialogIndex)
        },
      },
      {
        label: '确定',
        severity: 'primary',
        text: true,
        btnClick: () => {
          console.log('确定按钮点击')
          closeDialog(dialogIndex)
        },
      },
    ],
  })
}

// 打开可最大化对话框
const openMaximizableDialog = () => {
  console.log('打开可最大化对话框')
  openDialog({
    header: '可最大化对话框',
    maximizable: true,
    contentRenderer: () => h('div', { class: 'p-4' }, '这是一个可以最大化的对话框'),
  })
}

// 打开确认对话框
const openConfirmDialog = () => {
  console.log('打开确认对话框')
  confirmDialog.require({
    header: '确认操作',
    message: '确定要执行此操作吗？',
    acceptLabel: '确定',
    rejectLabel: '取消',
    accept: () => {
      success('操作已确认')
    },
    reject: () => {
      info('操作已取消')
    },
  })
}

// 打开删除确认对话框
const openDeleteConfirmDialog = () => {
  console.log('打开删除确认对话框')
  confirmDialog.require({
    header: '删除确认',
    message: '确定要删除这条记录吗？删除后无法恢复。',
    acceptLabel: '删除',
    rejectLabel: '取消',
    acceptClass: 'p-button-danger',
    accept: () => {
      success('删除成功')
    },
    reject: () => {
      info('已取消删除')
    },
  })
}

// 打开动态对话框
const openDynamicDialog = () => {
  console.log('打开动态对话框')
  dynamicDialog.open('div', {
    props: {
      style: 'padding: 1rem;',
    },
    data: {
      content: [
        h('h3', { class: 'text-lg font-semibold mb-4' }, '动态对话框'),
        h('p', { class: 'text-gray-600' }, '这是一个动态创建的对话框内容'),
        h('div', { class: 'mt-4' }, [
          h(
            'button',
            {
              class: 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700',
              onClick: () => {
                success('动态对话框操作成功')
              },
            },
            '点击我'
          ),
        ]),
      ],
    },
  })
}

// 打开自定义头部对话框
const openCustomHeaderDialog = () => {
  console.log('打开自定义头部对话框')
  openDialog({
    header: '自定义头部对话框',
    contentRenderer: () => h('div', { class: 'p-4' }, '这是一个带有自定义头部的对话框'),
    hideFooter: true,
  })
}

// 打开加载状态对话框
const openLoadingDialog = () => {
  console.log('打开加载状态对话框')
  const dialogIndex = dialogStore.value.length
  openDialog({
    header: '加载状态对话框',
    contentRenderer: () => h('div', { class: 'p-4 text-center' }, '正在处理中...'),
    sureBtnLoading: true,
    footerButtons: [
      {
        label: '取消',
        severity: 'secondary',
        text: true,
        btnClick: () => {
          console.log('取消')
          closeDialog(dialogIndex)
        },
      },
      {
        label: '确定',
        severity: 'primary',
        text: true,
        btnClick: () => {
          // 模拟异步操作
          setTimeout(() => {
            console.log('操作完成')
            closeDialog(dialogIndex)
          }, 2000)
        },
      },
    ],
  })
}

// 打开不可点击遮罩关闭的对话框
const openNonDismissableDialog = () => {
  console.log('打开不可点击遮罩关闭的对话框')
  const dialogIndex = dialogStore.value.length
  openDialog({
    header: '不可点击遮罩关闭的对话框',
    closeOnMask: false,
    closeOnEscape: false,
    contentRenderer: () =>
      h('div', { class: 'p-4' }, '这个对话框不能通过点击遮罩或按ESC键关闭，只能通过按钮关闭'),
    footerButtons: [
      {
        label: '关闭',
        severity: 'primary',
        text: true,
        btnClick: () => {
          console.log('关闭对话框')
          closeDialog(dialogIndex)
        },
      },
    ],
  })
}

// 打开可拖拽对话框
const openDraggableDialog = () => {
  console.log('打开可拖拽对话框')
  openDialog({
    header: '可拖拽对话框',
    draggable: true,
    contentRenderer: () => h('div', { class: 'p-4' }, '这个对话框可以通过拖拽标题栏来移动位置'),
  })
}

// 打开无遮罩对话框
const openNoModalDialog = () => {
  console.log('打开无遮罩对话框')
  openDialog({
    header: '无遮罩对话框',
    modal: false,
    contentRenderer: () => h('div', { class: 'p-4' }, '这个对话框没有背景遮罩，后面的元素可以点击'),
  })
}

// 打开自定义位置对话框
const openCustomPositionDialog = () => {
  console.log('打开自定义位置对话框')
  openDialog({
    header: '自定义位置对话框',
    position: 'top',
    contentRenderer: () => h('div', { class: 'p-4' }, '这个对话框显示在页面顶部'),
  })
}

// 打开嵌套对话框
const openNestedDialog = () => {
  console.log('打开嵌套对话框')
  openDialog({
    header: '外层对话框',
    contentRenderer: () =>
      h('div', { class: 'p-4' }, [
        h('p', '这是外层对话框'),
        h(
          'button',
          {
            class: 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2',
            onClick: () => {
              openDialog({
                header: '内层对话框',
                contentRenderer: () => h('div', { class: 'p-4' }, '这是内层对话框'),
              })
            },
          },
          '打开内层对话框'
        ),
      ]),
  })
}

// 打开可更新属性的对话框
const openUpdatableDialog = () => {
  console.log('打开可更新属性的对话框')
  const dialogIndex = dialogStore.value.length
  openDialog({
    header: '可更新属性的对话框',
    contentRenderer: () => h('div', { class: 'p-4' }, '这个对话框的属性可以被动态更新'),
    footerButtons: [
      {
        label: '更新标题',
        severity: 'secondary',
        text: true,
        btnClick: () => {
          update('更新后的标题', 'header', dialogIndex)
        },
      },
      {
        label: '关闭',
        severity: 'primary',
        text: true,
        btnClick: () => {
          console.log('关闭对话框')
          closeDialog(dialogIndex)
        },
      },
    ],
  })
}
</script>

<template lang="pug">
.grid.grid-cols-1.gap-gapx.p-gapx(class='sm:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4')
  // 基础对话框
  .full.c-card-primary.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 基础对话框
    p.color-text200 标准对话框，支持自定义内容和按钮
    Button(label='打开标准对话框', severity='primary', @click='openStandardDialog')

  // 可最大化对话框
  .full.c-card-primary.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 可最大化对话框
    p.color-text200 支持最大化、最小化操作的对话框
    Button(label='打开可最大化对话框', severity='secondary', @click='openMaximizableDialog')

  // 确认对话框
  .full.c-card-primary.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 确认对话框
    p.color-text200 基于 PrimeVue ConfirmDialog 的确认对话框
    Button(label='打开确认对话框', severity='info', @click='openConfirmDialog')

  // 删除确认对话框
  .full.c-card-primary.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 删除确认对话框
    p.color-text200 专门用于删除操作的确认对话框
    Button(label='打开删除确认对话框', severity='danger', @click='openDeleteConfirmDialog')

  // 动态对话框
  .full.c-card-primary.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 动态对话框
    p.color-text200 基于 PrimeVue DynamicDialog 的动态组件对话框
    Button(label='打开动态对话框', severity='success', @click='openDynamicDialog')

  // 自定义头部对话框
  .full.c-card-primary.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 自定义头部对话框
    p.color-text200 支持自定义头部渲染的对话框
    Button(label='打开自定义头部对话框', severity='warning', @click='openCustomHeaderDialog')

  // 加载状态对话框
  .full.c-card-primary.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 加载状态对话框
    p.color-text200 支持按钮加载状态的对话框
    Button(label='打开加载状态对话框', severity='help', @click='openLoadingDialog')

  // 不可点击遮罩关闭的对话框
  .full.c-card-primary.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 不可点击遮罩关闭的对话框
    p.color-text200 不能通过点击遮罩或按ESC键关闭的对话框
    Button(label='打开不可点击遮罩关闭的对话框', severity='warning', @click='openNonDismissableDialog')

  // 可拖拽对话框
  .full.c-card-primary.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 可拖拽对话框
    p.color-text200 可以通过拖拽标题栏移动位置的对话框
    Button(label='打开可拖拽对话框', severity='info', @click='openDraggableDialog')

  // 无遮罩对话框
  .full.c-card-primary.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 无遮罩对话框
    p.color-text200 没有背景遮罩，后面元素可点击的对话框
    Button(label='打开无遮罩对话框', severity='secondary', @click='openNoModalDialog')

  // 自定义位置对话框
  .full.c-card-primary.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 自定义位置对话框
    p.color-text200 显示在页面顶部的对话框
    Button(label='打开自定义位置对话框', severity='success', @click='openCustomPositionDialog')

  // 嵌套对话框
  .full.c-card-primary.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 嵌套对话框
    p.color-text200 支持在对话框内再打开对话框
    Button(label='打开嵌套对话框', severity='warning', @click='openNestedDialog')

  // 可更新属性对话框
  .full.c-card-primary.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 可更新属性对话框
    p.color-text200 支持动态更新对话框属性的对话框
    Button(label='打开可更新属性对话框', severity='help', @click='openUpdatableDialog')

  // 便捷方法
  .full.c-card-primary.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 便捷方法
    p.color-text200 快速打开各种类型的对话框
    .between
      Button(label='信息提示', severity='info', text, @click='() => info("这是一条信息提示")')
      Button(label='成功提示', severity='success', text, @click='() => success("操作成功完成")')
      Button(label='警告提示', severity='warning', text, @click='() => warning("请注意这个警告")')
      Button(label='错误提示', severity='danger', text, @click='() => error("发生了一个错误")')

  // 确认操作
  .full.c-card-primary.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 确认操作
    p.color-text200 快速确认操作
    Button(
      label='确认操作',
      severity='primary',
      outlined,
      @click='() => confirm( "确定要执行此操作吗？", "确认", () => success("操作已确认"), () => info("操作已取消"), )'
    )
</template>
