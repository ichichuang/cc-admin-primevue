import { useLoading } from '@/hooks'
import type { App } from 'vue'
import { setupLocales } from '@/plugins/modules/locales'
import { setupPrimeVue } from '@/plugins/modules/primevue'
import { setupRouter } from '@/plugins/modules/router'
import { setupStores } from '@/plugins/modules/stores'

/**
 * 统一设置所有插件
 * @param app Vue 应用实例
 */
export const setupPlugins = (app: App) => {
  const { loadingStart } = useLoading()
  loadingStart()
  setupStores(app)
  setupRouter(app)
  setupLocales(app)
  setupPrimeVue(app)
}
