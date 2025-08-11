import type { SupportedLocale } from '@/locales/types'

// 声明全局类型
declare global {
  /** 多语言状态接口 */
  interface LocaleState {
    locale: SupportedLocale
    loading: boolean
  }
}

// 导出空对象使其成为外部模块
export {}
