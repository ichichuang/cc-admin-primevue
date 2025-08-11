import { setupI18n } from '@/locales'
import type { App } from 'vue'

export const setupLocales = (app: App) => {
  setupI18n(app)
}
