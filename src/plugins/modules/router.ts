import router from '@/router'
import type { App } from 'vue'

export const setupRouter = (app: App) => {
  app.use(router)
}
