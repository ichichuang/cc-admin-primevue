import type { LocaleInfo, SupportedLocale } from '@/locales'
import { getCurrentLocale, setLocale, supportedLocales } from '@/locales'
import store from '@/stores'
import { env } from '@/utils'
import { defineStore } from 'pinia'

interface LocaleState {
  locale: SupportedLocale
  loading: boolean
}

export const useLocaleStore = defineStore('locale', {
  state: (): LocaleState => ({
    locale: getCurrentLocale(),
    loading: false,
  }),

  getters: {
    // 获取当前语言
    currentLocale: (state: LocaleState) => state.locale,
    // 获取当前语言信息
    currentLocaleInfo: (state: LocaleState) =>
      supportedLocales.find(item => item.key === state.locale),
    // 是否为中文语言
    isChineseLang: (state: LocaleState) => state.locale.startsWith('zh'),
    // 是否为 RTL 语言
    isRTL: (state: LocaleState) => {
      const localeInfo = supportedLocales.find(item => item.key === state.locale)
      return localeInfo?.direction === 'rtl'
    },
    // 获取可用语言列表
    availableLocales: () => supportedLocales,
  },

  actions: {
    // 切换语言
    async switchLocale(newLocale: SupportedLocale) {
      if (this.locale === newLocale) {
        return
      }

      this.loading = true

      try {
        setLocale(newLocale)
        this.locale = newLocale

        // 触发自定义事件
        window.dispatchEvent(
          new CustomEvent('locale-store-changed', {
            detail: { locale: newLocale },
          })
        )
      } catch (error) {
        console.error('Failed to switch locale:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 初始化语言
    initLocale() {
      const current = getCurrentLocale()
      this.locale = current

      // 确保HTML属性设置正确
      document.documentElement.lang = current
      const localeInfo = supportedLocales.find(item => item.key === current)
      document.documentElement.dir = localeInfo?.direction || 'ltr'
    },

    // 获取语言信息
    getLocaleInfo(locale: SupportedLocale): LocaleInfo | undefined {
      return supportedLocales.find(item => item.key === locale)
    },
  },

  persist: {
    key: `${env.piniaKeyPrefix}-locale`,
    storage: localStorage,
  },
})

export const useLocaleStoreWithOut = () => {
  return useLocaleStore(store)
}
