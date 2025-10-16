/**
 * Vue 相关类型声明
 */

import type { Directive } from 'vue'

// 扩展 Vue 指令类型
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // PrimeVue 指令
    vTooltip: Directive
  }
}

// 扩展全局指令类型
declare module 'vue' {
  interface ComponentCustomProperties {
    vTooltip: Directive
  }
}
