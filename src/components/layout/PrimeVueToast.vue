<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { reactive } from 'vue'

// 获取 PrimeVue Toast 实例
const toast = useToast()

// 模板注册表（保留）：按 group 注册复杂模板（全局影响）
const templateRegistry = reactive(
  new Map<string, { kind: 'message' | 'container'; renderer: any }>()
)

function registerTemplate(group: string, kind: 'message' | 'container', renderer: any) {
  templateRegistry.set(group, { kind, renderer })
}

function unregisterTemplate(group: string) {
  templateRegistry.delete(group)
}

function hasMessageTemplate(group: string) {
  const t = templateRegistry.get(group)
  return !!t && t.kind === 'message'
}

function hasContainerTemplate(group: string) {
  const t = templateRegistry.get(group)
  return !!t && t.kind === 'container'
}

function getTemplate(group: string) {
  return templateRegistry.get(group)?.renderer || null
}

// 统一处理关闭事件，调用消息自带 onClose 回调（若存在）
function handleToastClose(payload: any) {
  const message = (payload && (payload.message || payload)) as any
  if (message && typeof message.onClose === 'function') {
    try {
      message.onClose()
    } catch (_err) {
      // 忽略回调内部异常
    }
  }
}

// 二次封装 Toast 服务，提供便捷方法
const toastService = {
  // 模板注册 API（全局影响）
  registerTemplate,
  unregisterTemplate,

  /** 添加 Toast 消息 */
  add: (message: any) => {
    toast.add(message)
  },

  /** 指定 group 添加消息 */
  addIn: (group: string, message: any) => {
    toast.add({ ...message, group })
  },

  /**
   * 单条消息自定义容器渲染（不影响同组其它消息）
   * 会发送到 `${group}-custom` 分组，由专用 Toast 使用 container 插槽渲染
   */
  customIn: (
    group: string,
    renderer: (ctx: { message: any; closeCallback: () => void }) => any,
    message: any
  ) => {
    toast.add({ ...message, group: `${group}-custom`, _containerRenderer: renderer })
  },

  /** 各种便捷方法 */
  success: (summary: string, detail?: string, life = 3000) => {
    toast.add({ severity: 'success', summary, detail, life })
  },
  successIn: (group: string, summary: string, detail?: string, life = 3000) => {
    toast.add({ severity: 'success', summary, detail, life, group })
  },
  info: (summary: string, detail?: string, life = 3000) => {
    toast.add({ severity: 'info', summary, detail, life })
  },
  infoIn: (group: string, summary: string, detail?: string, life = 3000) => {
    toast.add({ severity: 'info', summary, detail, life, group })
  },
  warn: (summary: string, detail?: string, life = 3000) => {
    toast.add({ severity: 'warn', summary, detail, life })
  },
  warnIn: (group: string, summary: string, detail?: string, life = 3000) => {
    toast.add({ severity: 'warn', summary, detail, life, group })
  },
  error: (summary: string, detail?: string, life = 3000) => {
    toast.add({ severity: 'error', summary, detail, life })
  },
  errorIn: (group: string, summary: string, detail?: string, life = 3000) => {
    toast.add({ severity: 'error', summary, detail, life, group })
  },
  secondary: (summary: string, detail?: string, life = 3000) => {
    toast.add({ severity: 'secondary', summary, detail, life })
  },
  secondaryIn: (group: string, summary: string, detail?: string, life = 3000) => {
    toast.add({ severity: 'secondary', summary, detail, life, group })
  },
  contrast: (summary: string, detail?: string, life = 3000) => {
    toast.add({ severity: 'contrast', summary, detail, life })
  },
  contrastIn: (group: string, summary: string, detail?: string, life = 3000) => {
    toast.add({ severity: 'contrast', summary, detail, life, group })
  },

  /** 简易 loading（粘性消息，需手动清理） */
  loading: (summary = '加载中...', detail?: string, group?: string) => {
    const message = { severity: 'info', summary, detail, life: 0 }
    if (group) {
      toast.add({ ...message, group })
    } else {
      toast.add(message)
    }
  },

  /** 进度提示（纯文本百分比，由外部控制） */
  progress: (summary: string, percent: number, detail?: string, group?: string) => {
    const message = {
      severity: 'info',
      summary: `${summary} ${Math.max(0, Math.min(100, percent))}%`,
      detail,
      life: 0,
    }
    if (group) {
      toast.add({ ...message, group })
    } else {
      toast.add(message)
    }
  },

  /** 清除 */
  clear: (group?: string) => {
    if (group) {
      toast.removeGroup(group)
    } else {
      toast.removeAllGroups()
    }
  },
  removeGroup: (group: string) => toast.removeGroup(group),
  removeAllGroups: () => toast.removeAllGroups(),
  remove: (message: any) => toast.remove(message),
}

// 挂载到全局 window 对象
declare global {
  interface Window {
    $toast: typeof toastService
  }
}

window.$toast = toastService
</script>

<template lang="pug">
// 默认（右上角）
Toast(@close='handleToastClose')
// 左上角
Toast(position='top-left', group='top-left', @close='handleToastClose')
// 左下角
Toast(position='bottom-left', group='bottom-left', @close='handleToastClose')
// 右下角
Toast(position='bottom-right', group='bottom-right', @close='handleToastClose')
// 顶部居中（默认样式）
Toast(position='top-center', group='top-center', @close='handleToastClose')
  // 全局注册的模板（可选）
  template(#message='slotProps', v-if='hasMessageTemplate("top-center")')
    component(:is='getTemplate("top-center")', v-bind='slotProps')
  template(#container='{ message, closeCallback }', v-if='hasContainerTemplate("top-center")')
    component(:is='getTemplate("top-center")', :message='message', :close-callback='closeCallback')
// 顶部居中（仅自定义消息）
Toast(position='top-center', group='top-center-custom', @close='handleToastClose')
  template(#container='{ message, closeCallback }')
    //- 单条消息携带的渲染器
    component(
      :is='message._containerRenderer',
      :message='message',
      :close-callback='closeCallback'
    )
// 底部居中（默认样式）
Toast(position='bottom-center', group='bottom-center', @close='handleToastClose')
  template(#message='slotProps', v-if='hasMessageTemplate("bottom-center")')
    component(:is='getTemplate("bottom-center")', v-bind='slotProps')
  template(#container='{ message, closeCallback }', v-if='hasContainerTemplate("bottom-center")')
    component(
      :is='getTemplate("bottom-center")',
      :message='message',
      :close-callback='closeCallback'
    )
// 底部居中（仅自定义消息）
Toast(position='bottom-center', group='bottom-center-custom', @close='handleToastClose')
  template(#container='{ message, closeCallback }')
    component(
      :is='message._containerRenderer',
      :message='message',
      :close-callback='closeCallback'
    )
// 屏幕居中（默认样式）
Toast(position='center', group='center', @close='handleToastClose')
  template(#message='slotProps', v-if='hasMessageTemplate("center")')
    component(:is='getTemplate("center")', v-bind='slotProps')
  template(#container='{ message, closeCallback }', v-if='hasContainerTemplate("center")')
    component(:is='getTemplate("center")', :message='message', :close-callback='closeCallback')
// 屏幕居中（仅自定义消息）
Toast(position='center', group='center-custom', @close='handleToastClose')
  template(#container='{ message, closeCallback }')
    component(
      :is='message._containerRenderer',
      :message='message',
      :close-callback='closeCallback'
    )
</template>

<style lang="scss" scope></style>
