import {
  addConfirmDialog,
  addDialog,
  addDynamicDialog,
  closeAllDialog,
  closeDialog,
  dialogStore,
  updateDialog,
  type ButtonProps,
  type ConfirmOptions,
  type DialogOptions,
} from '@/components/modules/prime-dialog'
import { h } from 'vue'

/**
 * 对话框操作 Hook
 * 提供便捷的对话框操作方法
 */
export function useDialog(): any {
  /**
   * 打开标准对话框
   */
  const openDialog = (options: DialogOptions) => {
    addDialog(options)
  }

  /**
   * 打开确认对话框
   */
  const openConfirm = (confirmOptions: ConfirmOptions, callback?: (result: boolean) => void) => {
    addConfirmDialog(confirmOptions, callback)
  }

  /**
   * 打开动态对话框
   */
  const openDynamic = (
    component: any,
    props?: any,
    data?: any,
    listeners?: any,
    style?: any,
    className?: string
  ) => {
    addDynamicDialog(component, props, data, listeners, style, className)
  }

  /**
   * 关闭指定对话框
   */
  const closeDialogByIndex = (index: number, args?: any) => {
    if (dialogStore.value[index]) {
      ;(closeDialog as any)(dialogStore.value[index], index, args)
    }
  }

  /**
   * 关闭所有对话框
   */
  const closeAll = () => {
    closeAllDialog()
  }

  /**
   * 更新对话框属性
   */
  const update = (value: any, key = 'header', index = 0) => {
    updateDialog(value, key, index)
  }

  /**
   * 快速打开信息对话框
   */
  const info = (message: string, title = '提示', callback?: () => void) => {
    const dialogIndex = dialogStore.value.length
    openDialog({
      header: title,
      contentRenderer: () => h('div', { class: 'text-center py-4' }, message),
      footerButtons: [
        {
          label: '确定',
          severity: 'primary',
          text: true,
          btnClick: () => {
            closeDialogByIndex(dialogIndex, { command: 'sure' })
            callback?.()
          },
        },
      ],
    })
  }

  /**
   * 快速打开成功对话框
   */
  const success = (message: string, title = '成功', callback?: () => void) => {
    const dialogIndex = dialogStore.value.length
    openDialog({
      header: title,
      contentRenderer: () => h('div', { class: 'text-center py-4 text-green-600' }, message),
      footerButtons: [
        {
          label: '确定',
          severity: 'success',
          text: true,
          btnClick: () => {
            closeDialogByIndex(dialogIndex, { command: 'sure' })
            callback?.()
          },
        },
      ],
    })
  }

  /**
   * 快速打开警告对话框
   */
  const warning = (message: string, title = '警告', callback?: () => void) => {
    const dialogIndex = dialogStore.value.length
    openDialog({
      header: title,
      contentRenderer: () => h('div', { class: 'text-center py-4 text-orange-600' }, message),
      footerButtons: [
        {
          label: '确定',
          severity: 'warning',
          text: true,
          btnClick: () => {
            closeDialogByIndex(dialogIndex, { command: 'sure' })
            callback?.()
          },
        },
      ],
    })
  }

  /**
   * 快速打开错误对话框
   */
  const error = (message: string, title = '错误', callback?: () => void) => {
    const dialogIndex = dialogStore.value.length
    openDialog({
      header: title,
      contentRenderer: () => h('div', { class: 'text-center py-4 text-red-600' }, message),
      footerButtons: [
        {
          label: '确定',
          severity: 'danger',
          text: true,
          btnClick: () => {
            closeDialogByIndex(dialogIndex, { command: 'sure' })
            callback?.()
          },
        },
      ],
    })
  }

  /**
   * 快速打开确认对话框
   */
  const confirm = (
    message: string,
    title = '确认',
    onConfirm?: () => void,
    onCancel?: () => void
  ) => {
    openConfirm(
      {
        header: title,
        message,
        acceptLabel: '确定',
        rejectLabel: '取消',
      },
      (result: boolean) => {
        if (result) {
          onConfirm?.()
        } else {
          onCancel?.()
        }
      }
    )
  }

  /**
   * 快速打开删除确认对话框
   */
  const confirmDelete = (
    message = '确定要删除吗？',
    title = '删除确认',
    onConfirm?: () => void,
    onCancel?: () => void
  ) => {
    openConfirm(
      {
        header: title,
        message,
        acceptLabel: '删除',
        rejectLabel: '取消',
        acceptClass: 'p-button-danger',
      },
      (result: boolean) => {
        if (result) {
          onConfirm?.()
        } else {
          onCancel?.()
        }
      }
    )
  }

  return {
    // 状态
    dialogStore,

    // 基础方法
    openDialog,
    openConfirm,
    openDynamic,
    closeDialog: closeDialogByIndex,
    closeDialogByIndex,
    closeAll,
    update,

    // 便捷方法
    info,
    success,
    warning,
    error,
    confirm,
    confirmDelete,
  }
}

export type { ButtonProps, ConfirmOptions, DialogOptions }
