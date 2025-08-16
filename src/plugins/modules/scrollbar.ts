import CustomScrollbar from 'custom-vue-scrollbar'
import 'custom-vue-scrollbar/dist/style.css'
import type { App } from 'vue'

/**
 * 设置 custom-vue-scrollbar 插件
 * @param app Vue 应用实例
 */
export const setupScrollbar = (app: App) => {
  // 注册全局组件
  app.component(CustomScrollbar.name, CustomScrollbar)
}

// 扩展 Vue 全局组件类型
declare module 'vue' {
  export interface GlobalComponents {
    CustomScrollbar: typeof CustomScrollbar
  }
}
