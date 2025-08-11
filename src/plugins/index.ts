import { useLoading } from '@/hooks'
import type { App } from 'vue'
import { nextTick } from 'vue'
import { setupLocales } from './modules/locales'
import { setupPrimeVue } from './modules/primevue'
import { setupRouter } from './modules/router'
import { setupStores } from './modules/stores'

/**
 * 统一设置所有插件
 * @param app Vue 应用实例
 */
export const setupPlugins = (app: App) => {
  const { loadingStart, loadingDone } = useLoading()
  loadingStart()
  // 1. 设置核心插件（路由、状态管理）
  setupStores(app)
  setupRouter(app)
  setupLocales(app)
  setupPrimeVue(app)
  nextTick(() => {
    setTimeout(() => {
      loadingDone()
    })
  })
}
