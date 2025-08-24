<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ButtonProps, DialogOptions, EventType } from './utils/types'

// 简单的 isFunction 工具函数
const isFunction = (value: any): value is (...args: any[]) => any => {
  return typeof value === 'function'
}

const props = withDefaults(
  defineProps<{
    dialogStore: DialogOptions[]
  }>(),
  {
    dialogStore: () => [],
  }
)

const emit = defineEmits<{
  close: [options: DialogOptions, index: number, args?: any]
  open: [options: DialogOptions, index: number]
  maximize: [options: DialogOptions, index: number]
  minimize: [options: DialogOptions, index: number]
  fullscreen: [options: DialogOptions, index: number]
}>()

const sureBtnMap = ref<Record<number, { loading: boolean }>>({})

// 默认按钮配置
const defaultButtons = computed(() => {
  return (options: DialogOptions): ButtonProps[] => {
    if (options.footerButtons && options.footerButtons.length > 0) {
      return options.footerButtons
    }

    return [
      {
        label: '取消',
        severity: 'secondary',
        text: true,
        btnClick: ({ dialog: { options, index } }) => {
          const done = () => {
            emit('close', options, index, { command: 'cancel' })
          }
          if (options?.beforeCancel && isFunction(options.beforeCancel)) {
            options.beforeCancel(done, { options, index })
          } else {
            done()
          }
        },
      },
      {
        label: '确定',
        severity: 'primary',
        text: true,
        btnClick: ({ dialog: { options, index } }) => {
          if (options?.sureBtnLoading && index !== undefined) {
            sureBtnMap.value[index] = Object.assign({}, sureBtnMap.value[index], {
              loading: true,
            })
          }
          const closeLoading = () => {
            if (options?.sureBtnLoading && index !== undefined) {
              sureBtnMap.value[index].loading = false
            }
          }
          const done = () => {
            closeLoading()
            emit('close', options, index, { command: 'sure' })
          }
          if (options?.beforeSure && isFunction(options.beforeSure)) {
            options.beforeSure(done, { options, index, closeLoading })
          } else {
            done()
          }
        },
      },
    ] as ButtonProps[]
  }
})

// 事件回调处理
function eventsCallBack(event: EventType, options: DialogOptions, index: number) {
  const eventHandler = (options as any)[event]
  if (eventHandler && isFunction(eventHandler)) {
    return eventHandler({ options, index })
  }
}

// 处理关闭事件
function handleClose(options: DialogOptions, index: number, args = { command: 'close' }) {
  emit('close', options, index, args)
  eventsCallBack('close', options, index)
}

// 处理打开事件
function handleOpen(options: DialogOptions, index: number) {
  emit('open', options, index)
  eventsCallBack('open', options, index)
}

// 处理最大化事件
function handleMaximize(options: DialogOptions, index: number) {
  emit('maximize', options, index)
  eventsCallBack('maximize', options, index)
}

// 过滤不同类型的对话框
const standardDialogs = computed(() =>
  props.dialogStore.filter(item => item.type === 'dialog' || !item.type)
)

const confirmDialogs = computed(() => props.dialogStore.filter(item => item.type === 'confirm'))

const dynamicDialogs = computed(() => props.dialogStore.filter(item => item.type === 'dynamic'))
</script>

<template lang="pug">
// 标准对话框
Dialog(
  v-for='(options, index) in standardDialogs',
  :key='`dialog-${index}`',
  v-model:visible='options.visible',
  :header='options.header',
  :style='options.style',
  :class='options.class',
  :maximizable='options.maximizable',
  :close-on-escape='options.closeOnEscape',
  :dismissable-mask='options.closeOnMask',
  :closable='options.closable',
  :modal='options.modal',
  :append-to='options.appendTo',
  :position='options.position',
  :draggable='options.draggable',
  :keep-in-viewport='options.keepInViewport',
  :breakpoints='options.breakpoints',
  @show='handleOpen(options, index)',
  @hide='handleClose(options, index)',
  @maximize='handleMaximize(options, index)'
)
  // 自定义头部
  template(v-if='options?.headerRenderer', #header)
    component(
      :is='options.headerRenderer({ close: () => {}, maximize: () => {}, minimize: () => {} })'
    )

  // 自定义内容
  component(
    v-if='options?.contentRenderer',
    :is='options.contentRenderer({ options, index })',
    v-bind='options?.props',
    @close='(args: any) => handleClose(options, index, args)'
  )

  // 自定义底部
  template(v-if='!options?.hideFooter', #footer)
    template(v-if='options?.footerRenderer')
      component(:is='options.footerRenderer({ options, index })')
    template(v-else)
      .flex.gap-2.justify-end
        template(v-for='(btn, key) in defaultButtons(options)', :key='key')
          Button(
            v-bind='btn',
            :loading='key === 1 && sureBtnMap[index]?.loading',
            @click='btn.btnClick?.({ dialog: { options, index }, button: { btn, index: key } })'
          ) {{ btn.label }}

// 确认对话框
ConfirmDialog(
  v-for='(options, index) in confirmDialogs',
  :key='`confirm-${index}`',
  :group='options.confirmOptions?.group'
)

// 动态对话框
DynamicDialog(
  v-for='(options, index) in dynamicDialogs',
  :key='`dynamic-${index}`',
  :style='options.style',
  :class='options.class'
)
</template>

<style lang="scss" scoped>
:deep(.p-dialog) {
  .p-dialog-header {
    .p-dialog-title {
      font-weight: 600;
    }
  }

  .p-dialog-content {
    padding: 1.5rem;
  }

  .p-dialog-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--surface-border);
  }
}

:deep(.p-confirm-dialog) {
  .p-confirm-dialog-message {
    margin: 1rem 0;
  }

  .p-confirm-dialog-footer {
    margin-top: 1.5rem;
  }
}
</style>
