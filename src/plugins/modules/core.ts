import router from '@/router'
import store from '@/stores'
import type { App } from 'vue'

/**
 * 安装 PrimeVue 插件
 * @param app Vue 应用实例
 * @param config 自定义配置选项
 */
export function setupCore(app: App) {
  app.use(router)
  app.use(store)
}

/**
 * 默认导出安装函数
 */
export default setupCore
