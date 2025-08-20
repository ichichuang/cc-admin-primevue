import { useLoading } from '@/hooks'
import { setupLocales } from '@/plugins/modules/locales'
import { setupPrimeVue } from '@/plugins/modules/primevue'
import { setupRouter } from '@/plugins/modules/router'
import { setupScrollbar } from '@/plugins/modules/scrollbar'
import { setupStores } from '@/plugins/modules/stores'
import type { App } from 'vue'

/**
 * 统一设置所有插件
 * @param app Vue 应用实例
 */
export const setupPlugins = (app: App) => {
  // 先安装并初始化 Pinia Stores，确保持久化状态已就绪，再使用依赖 Store 的逻辑
  setupStores(app)
  const { loadingStart } = useLoading()
  loadingStart()
  setupRouter(app)
  setupLocales(app)
  setupPrimeVue(app)
  setupScrollbar(app)
}
