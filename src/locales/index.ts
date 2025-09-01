/**
 * 国际化配置入口文件
 */
import enUS from '@/locales/lang/en-US'
import zhCN from '@/locales/lang/zh-CN'
import zhTW from '@/locales/lang/zh-TW'
import { env } from '@/utils'
import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

// 类型定义
/** 支持的语言类型 */
export type SupportedLocale = 'zh-CN' | 'en-US' | 'zh-TW'

/** 语言配置信息 */
export interface LocaleInfo {
  key: SupportedLocale
  name: string
  flag: string
  direction: 'ltr' | 'rtl'
}

/** 语言包类型 */
export interface LocaleMessages {
  [key: string]: any
}

// 支持的语言列表
export const supportedLocales: LocaleInfo[] = [
  {
    key: 'zh-CN',
    name: '简体中文',
    flag: '🇨🇳',
    direction: 'ltr',
  },
  {
    key: 'en-US',
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
  },
  {
    key: 'zh-TW',
    name: '繁體中文',
    flag: '🇹🇼',
    direction: 'ltr',
  },
]

// 语言包映射
const messages: Record<SupportedLocale, LocaleMessages> = {
  ['zh-CN']: zhCN,
  ['en-US']: enUS,
  ['zh-TW']: zhTW,
}

// 获取默认语言（框架默认中文）
function getDefaultLocale(): SupportedLocale {
  return 'zh-CN'
}

// 创建 i18n 实例
export const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'zh-CN',
  messages: messages as any,
  globalInjection: true,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  missingWarn: env.devTools,
  fallbackWarn: env.devTools,
})

// 安装插件
export function setupI18n(app: App) {
  app.use(i18n)
}

// 获取当前语言
export function getCurrentLocale(): SupportedLocale {
  return (i18n.global.locale as any).value
}

// 设置语言
export function setLocale(locale: SupportedLocale) {
  if (messages[locale]) {
    ;(i18n.global.locale as any).value = locale

    // 更新HTML lang属性
    document.documentElement.lang = locale

    // 更新HTML dir属性
    const localeInfo = supportedLocales.find(item => item.key === locale)
    document.documentElement.dir = localeInfo?.direction || 'ltr'

    // 触发语言变更事件
    window.dispatchEvent(
      new CustomEvent('locale-changed', {
        detail: { locale },
      })
    )
  }
}

// 获取翻译文本
export function t(key: string, params?: Record<string, any>): string {
  return i18n.global.t(key, params || {})
}

// 格式化日期
export function d(date: Date | number, format?: string): string {
  return format ? i18n.global.d(date, format) : i18n.global.d(date)
}

// 格式化数字
export function n(number: number, format?: string): string {
  return format ? i18n.global.n(number, format) : i18n.global.n(number)
}

// 导出语言包
export { enUS } from '@/locales/lang/en-US'
export { zhCN } from '@/locales/lang/zh-CN'
export { zhTW } from '@/locales/lang/zh-TW'

// 按需导出常用国际化函数，便于使用
export { getDefaultLocale, messages }
