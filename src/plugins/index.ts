import { useLoading } from '@/hooks'
import type { App } from 'vue'
import { setupLocales } from './modules/locales'
import { setupPrimeVue } from './modules/primevue'
import { setupRouter } from './modules/router'
import { setupStores } from './modules/stores'

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
