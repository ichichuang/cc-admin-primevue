import { useTimeoutFn } from '@vueuse/core'
import { ref } from 'vue'
import PrimeVueDialog from './PrimeVueDialog.vue'
import { defaultDialogProps } from './utils/constants'
import type { ArgsType, ButtonProps, ConfirmOptions, DialogOptions, EventType } from './utils/types'

// 对话框存储
const dialogStore: any = ref<DialogOptions[]>([])

/**
 * 添加对话框
 */
function addDialog(options: DialogOptions) {
  const mergedOptions = {
    ...defaultDialogProps,
    ...options,
    visible: true,
    type: 'dialog' as const,
  }
  dialogStore.value.push(mergedOptions)

  if (options?.openDelay) {
    useTimeoutFn(() => {
      const index = dialogStore.value.findIndex((item: any) => item === mergedOptions)
      if (index !== -1) {
        dialogStore.value[index].visible = true
      }
    }, options.openDelay)
  }
}

/**
 * 关闭对话框
 */
function closeDialog(options: DialogOptions, index: number, _args?: ArgsType) {
  if (dialogStore.value[index]) {
    // 先设置 visible 为 false 触发关闭动画
    dialogStore.value[index].visible = false

    // 延时移除对话框，等待动画完成
    const delay = options?.closeDelay || 200
    useTimeoutFn(() => {
      dialogStore.value.splice(index, 1)
    }, delay)
  }
}

/**
 * 更新对话框
 */
function updateDialog(value: any, key = 'header', index = 0) {
  if (dialogStore.value[index]) {
    ;(dialogStore.value[index] as any)[key] = value
  }
}

/**
 * 关闭所有对话框
 */
function closeAllDialog() {
  dialogStore.value = []
}

/**
 * 添加确认对话框
 */
function addConfirmDialog(confirmOptions: ConfirmOptions, callback?: (result: boolean) => void) {
  const options: DialogOptions = {
    type: 'confirm',
    visible: true,
    confirmOptions,
    closeCallBack: ({ args }) => {
      const result = args?.command === 'sure'
      if (callback) {
        callback(result)
      }
    },
  }
  addDialog(options)
}

/**
 * 添加动态对话框
 */
function addDynamicDialog(
  component: any,
  props?: any,
  data?: any,
  listeners?: any,
  style?: any,
  className?: string
) {
  const options: DialogOptions = {
    type: 'dynamic',
    visible: true,
    component,
    props,
    data,
    listeners,
    style,
    class: className,
  }
  addDialog(options)
}

export type { ArgsType, ButtonProps, ConfirmOptions, DialogOptions, EventType }

export {
  addConfirmDialog,
  addDialog,
  addDynamicDialog,
  closeAllDialog,
  closeDialog,
  dialogStore,
  PrimeVueDialog,
  updateDialog,
}
