/**
 * 国际化类型定义
 * 定义项目中使用的所有语言配置类型
 */

import type { AuthLocaleMessages } from './auth'
import type { DashboardLocaleMessages } from './dashboard'
import type { RouterLocaleMessages } from './router'
import type { UserLocaleMessages } from './user'

/** 支持的语言类型 */
export type SupportedLocale = 'zh-CN' | 'en-US' | 'zh-TW'

/** 语言配置信息 */
export interface LocaleInfo {
  key: SupportedLocale
  name: string
  flag: string
  direction: 'ltr' | 'rtl'
}

export interface LocaleMessages {
  auth: AuthLocaleMessages
  user: UserLocaleMessages
  dashboard: DashboardLocaleMessages
  router: RouterLocaleMessages
}
